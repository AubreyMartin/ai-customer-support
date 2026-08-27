import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI, RateLimitError, AuthenticationError, APIError
from pydantic import BaseModel

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "AI Customer Support API is running!"}


@app.post("/chat")
def chat(request: ChatRequest):
    try:
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
            input=request.message
        )

        return {
            "reply": response.output_text
        }

    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="AI service is currently unavailable due to API quota."
        )

    except AuthenticationError:
        raise HTTPException(
            status_code=401,
            detail="AI service authentication failed."
        )

    except APIError:
        raise HTTPException(
            status_code=502,
            detail="AI service is temporarily unavailable."
        )

    except Exception as error:
        print(f"Unexpected error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Something went wrong while processing your message."
        )