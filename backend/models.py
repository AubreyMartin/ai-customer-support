from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


def utc_now():
    return datetime.now(timezone.utc)


class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[str] = Field(
        default=None,
        max_length=255,
        index=True,
    )
    title: Optional[str] = Field(default=None, max_length=120)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    conversation_id: UUID = Field(
        foreign_key="conversations.id",
        index=True,
    )

    role: str = Field(max_length=20)
    content: str
    created_at: datetime = Field(
        default_factory=utc_now,
        index=True,
    )