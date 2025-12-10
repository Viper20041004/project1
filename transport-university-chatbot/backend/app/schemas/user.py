"""
User schemas for request/response validation
"""
from typing import Optional
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserBase(BaseModel):
    """Base user schema"""
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    email: EmailStr = Field(..., description="Email address")


class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str = Field(..., min_length=6, max_length=100, description="Password")
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """Validate password strength"""
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        # Relaxed validation - only require minimum length for better UX
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str = Field(..., min_length=1, description="Username or email")
    password: str = Field(..., min_length=1, description="Password")


class UserUpdate(BaseModel):
    """Schema for updating user information"""
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6, max_length=100)
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: str  # Changed from UUID to str for compatibility
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @field_validator('id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        """Convert UUID to string if needed"""
        if hasattr(v, '__str__'):
            return str(v)
        return v
    
    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    """Schema for user in database (includes password hash)"""
    password_hash: str


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token payload data"""
    user_id: Optional[UUID] = None
    username: Optional[str] = None
    email: Optional[str] = None
