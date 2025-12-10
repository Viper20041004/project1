"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

# Import user schemas from user.py module
from .user import UserCreate, UserLogin, UserResponse as UserOut, Token, TokenData as TokenPayload


# Re-export for backward compatibility
__all__ = [
    'UserCreate',
    'UserLogin', 
    'UserOut',
    'Token',
    'TokenPayload',
    'ChatMessageCreate',
    'ChatMessageOut',
    'ChatHistoryOut',
    'ErrorResponse',
]

# ===== Chat Schemas =====
class ChatMessageCreate(BaseModel):
    """Chat message creation schema."""
    message: str = Field(..., min_length=1, description="User message")
    response: Optional[str] = Field(None, description="Assistant/AI response")
    role: str = Field("user", description="Role: user or assistant")


class ChatMessageOut(BaseModel):
    """Chat message response schema."""
    id: UUID
    user_id: UUID
    message: str
    response: Optional[str]
    role: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatHistoryOut(BaseModel):
    """Chat history response schema (paginated)."""
    total: int
    limit: int
    offset: int
    items: list[ChatMessageOut]


# ===== Error Schemas =====
class ErrorResponse(BaseModel):
    """Standard error response schema."""
    detail: str
    status_code: int
