import os
from contextlib import asynccontextmanager
from typing import List, Optional
from uuid import UUID

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import APIError, AuthenticationError, OpenAI, RateLimitError
from pydantic import BaseModel
from sqlmodel import Session, select

from auth import get_current_user_id
from database import create_db_and_tables, get_session
from models import Conversation, Message, utc_now

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-customer-support-seven-omega.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None


class ChatResponse(BaseModel):
    conversation_id: UUID
    reply: str


class ConversationSummary(BaseModel):
    id: UUID
    title: Optional[str] = None
    created_at: str
    updated_at: str


class MessageOut(BaseModel):
    role: str
    content: str
    created_at: str


@app.get("/")
def home():
    return {"message": "AI Customer Support API is running!"}


@app.get("/conversations", response_model=List[ConversationSummary])
def list_conversations(
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    """Return this user's own conversations, most recently updated first."""

    conversations = session.exec(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    ).all()

    return [
        ConversationSummary(
            id=conversation.id,
            title=conversation.title,
            created_at=conversation.created_at.isoformat(),
            updated_at=conversation.updated_at.isoformat(),
        )
        for conversation in conversations
    ]


@app.get(
    "/conversations/{conversation_id}/messages",
    response_model=List[MessageOut],
)
def get_conversation_messages(
    conversation_id: UUID,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    """Return the messages for one conversation, if it belongs to the caller."""

    conversation = session.get(Conversation, conversation_id)

    # Ownership check: a conversation that doesn't exist or that belongs
    # to a different Clerk user is reported the same way, so callers can't
    # probe for other users' conversation ids.
    if not conversation or conversation.user_id != user_id:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    ).all()

    return [
        MessageOut(
            role=message.role,
            content=message.content,
            created_at=message.created_at.isoformat(),
        )
        for message in messages
    ]


@app.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    try:
        message_text = request.message.strip()

        if not message_text:
            raise HTTPException(
                status_code=422,
                detail="Message cannot be empty.",
            )

        # Continue an existing conversation or create a new one
        if request.conversation_id:
            conversation = session.get(
                Conversation,
                request.conversation_id,
            )

            if not conversation:
                raise HTTPException(
                    status_code=404,
                    detail="Conversation not found.",
                )

            # Prevent users from accessing another user's conversation
            if conversation.user_id != user_id:
                raise HTTPException(
                    status_code=404,
                    detail="Conversation not found.",
                )
        else:
            conversation = Conversation(
                user_id=user_id,
                title=message_text[:120],
            )
            session.add(conversation)
            session.commit()
            session.refresh(conversation)

        # Save the user's message
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=message_text,
        )

        session.add(user_message)
        conversation.updated_at = utc_now()
        session.add(conversation)
        session.commit()

        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise HTTPException(
                status_code=503,
                detail="AI service is not configured yet.",
            )

        client = OpenAI(api_key=api_key)

        response = client.responses.create(
            model="gpt-5-mini",
            instructions="""
            You are a customer support assistant for an online store.

            Help customers with:
            - Orders and order status
            - Shipping and delivery
            - Returns
            - Refunds
            - Damaged or incorrect items
            - General product questions

            Be friendly, professional, and concise.

            If you do not have enough information to answer a question,
            ask the customer for the information you need.

            Never invent order details, delivery dates, refund statuses,
            or customer information.
            """,
            input=message_text,
        )

        # Save the assistant's response
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=response.output_text,
        )

        session.add(assistant_message)
        conversation.updated_at = utc_now()
        session.add(conversation)
        session.commit()

        return {
            "conversation_id": conversation.id,
            "reply": response.output_text,
        }

    except HTTPException:
        raise

    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="AI service is currently unavailable due to API quota.",
        )

    except AuthenticationError:
        raise HTTPException(
            status_code=401,
            detail="AI service authentication failed.",
        )

    except APIError:
        raise HTTPException(
            status_code=502,
            detail="AI service is temporarily unavailable.",
        )

    except Exception as error:
        print(f"Unexpected error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Something went wrong while processing your message.",
        )
