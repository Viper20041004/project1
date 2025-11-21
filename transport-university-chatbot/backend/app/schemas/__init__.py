"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ===== User Schemas =====
class UserCreate(BaseModel):
    """User registration schema."""
    username: str = Field(..., min_length=3, max_length=150, description="Username (3-150 chars)")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=6, description="Password (min 6 chars)")


class UserLogin(BaseModel):
    """User login schema."""
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Password")


class UserOut(BaseModel):
    """User response schema (no password)."""
    id: str
    username: str
    email: EmailStr
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


# ===== Token Schemas =====
class Token(BaseModel):
    """JWT token response schema."""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """JWT token payload schema (for validation)."""
    sub: Optional[str] = None
    exp: Optional[int] = None


# ===== Chat Schemas =====
class ChatMessageCreate(BaseModel):
    """Chat message creation schema."""
    message: str = Field(..., min_length=1, description="User message")
    response: Optional[str] = Field(None, description="Assistant/AI response")
    role: str = Field("user", description="Role: user or assistant")


class ChatMessageOut(BaseModel):
    """Chat message response schema."""
    id: str
    user_id: str
    message: str
    response: Optional[str]
    role: str
    timestamp: datetime

    class Config:
        orm_mode = True


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
