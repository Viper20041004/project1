"""
Chat service module
Handles chat history operations including saving and retrieving chat messages
"""
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.chat_history import ChatHistory


def save_chat(
    db: Session,
    user_id: UUID,
    message: str,
    response: str,
    role: str = "user"
) -> ChatHistory:
    """
    Save a chat message and its response to database
    Args:
        db: Database session
        user_id: User UUID
        message: User's message
        response: Bot's response
        role: Message role (user/assistant)
    Returns:
        Created ChatHistory object
    """
    chat_item = ChatHistory(
        user_id=user_id,
        message=message,
        response=response,
        role=role,
        timestamp=datetime.utcnow()
    )
    db.add(chat_item)
    db.commit()
    db.refresh(chat_item)
    return chat_item


def get_chat_history(
    db: Session,
    user_id: UUID,
    limit: int = 50,
    offset: int = 0
) -> List[ChatHistory]:
    """
    Retrieve chat history for a specific user
    Args:
        db: Database session
        user_id: User UUID
        limit: Maximum number of messages to return
        offset: Number of messages to skip
    Returns:
        List of ChatHistory objects ordered by timestamp (newest first)
    """
    query = db.query(ChatHistory).filter(
        ChatHistory.user_id == user_id
    ).order_by(desc(ChatHistory.timestamp))
    
    return query.offset(offset).limit(limit).all()


def get_recent_chat_history(
    db: Session,
    user_id: UUID,
    limit: int = 10
) -> List[ChatHistory]:
    """
    Get recent chat history for context
    Args:
        db: Database session
        user_id: User UUID
        limit: Number of recent messages
    Returns:
        List of recent ChatHistory objects
    """
    return db.query(ChatHistory).filter(
        ChatHistory.user_id == user_id
    ).order_by(desc(ChatHistory.timestamp)).limit(limit).all()


def get_chat_by_id(
    db: Session,
    chat_id: UUID
) -> Optional[ChatHistory]:
    """
    Get a specific chat message by ID
    Args:
        db: Database session
        chat_id: Chat UUID
    Returns:
        ChatHistory object if found, None otherwise
    """
    return db.query(ChatHistory).filter(ChatHistory.id == chat_id).first()


def delete_chat(
    db: Session,
    chat_id: UUID,
    user_id: UUID
) -> bool:
    """
    Delete a specific chat message
    Args:
        db: Database session
        chat_id: Chat UUID
        user_id: User UUID (for verification)
    Returns:
        True if deleted, False otherwise
    """
    chat = db.query(ChatHistory).filter(
        ChatHistory.id == chat_id,
        ChatHistory.user_id == user_id
    ).first()
    
    if chat:
        db.delete(chat)
        db.commit()
        return True
    return False


def delete_user_chat_history(
    db: Session,
    user_id: UUID
) -> int:
    """
    Delete all chat history for a user
    Args:
        db: Database session
        user_id: User UUID
    Returns:
        Number of deleted messages
    """
    deleted_count = db.query(ChatHistory).filter(
        ChatHistory.user_id == user_id
    ).delete()
    db.commit()
    return deleted_count


def get_chat_count(
    db: Session,
    user_id: UUID
) -> int:
    """
    Get total number of chat messages for a user
    Args:
        db: Database session
        user_id: User UUID
    Returns:
        Total count of chat messages
    """
    return db.query(ChatHistory).filter(
        ChatHistory.user_id == user_id
    ).count()


def format_chat_for_context(chat_history: List[ChatHistory]) -> str:
    """
    Format chat history for LLM context
    Args:
        chat_history: List of ChatHistory objects
    Returns:
        Formatted string for context
    """
    formatted = []
    for chat in reversed(chat_history):  # Reverse to show oldest first
        formatted.append(f"User: {chat.message}")
        if chat.response:
            formatted.append(f"Assistant: {chat.response}")
    return "\n".join(formatted)
