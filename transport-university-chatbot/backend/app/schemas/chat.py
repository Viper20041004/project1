"""
Chat schemas for request/response validation
"""
from typing import Optional, List
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ChatMessageBase(BaseModel):
    """Base chat message schema"""
    message: str = Field(..., min_length=1, max_length=5000, description="User message")


class ChatMessageCreate(ChatMessageBase):
    """Schema for creating a chat message"""
    pass


class ChatMessageResponse(BaseModel):
    """Schema for chat message response"""
    id: UUID
    user_id: UUID
    role: str
    message: str
    response: Optional[str] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True


class ChatHistoryResponse(BaseModel):
    """Schema for chat history response"""
    total: int
    messages: List[ChatMessageResponse]


class ChatRequest(BaseModel):
    """Schema for chat request"""
    message: str = Field(..., min_length=1, max_length=5000)
    conversation_id: Optional[UUID] = None


class ChatResponse(BaseModel):
    """Schema for chat response"""
    message: str
    response: str
    chat_id: UUID
    timestamp: datetime
