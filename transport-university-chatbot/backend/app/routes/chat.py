"""Chat history routes (save and retrieve messages)."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.chat_service import save_chat, get_chat_history
from ..schemas import ChatMessageCreate, ChatMessageOut, ChatHistoryOut

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/save", response_model=ChatMessageOut, status_code=status.HTTP_201_CREATED)
def save_message(chat_in: ChatMessageCreate, request, db: Session = Depends(get_db)):
    """Save a chat message for the current user."""
    # Get current user from request.state (set by AuthMiddleware)
    user = getattr(request.state, "user", None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Save chat entry
    entry = save_chat(
        db=db,
        user_id=user.id,
        message=chat_in.message,
        response=chat_in.response,
        role=chat_in.role
    )
    
    return entry


@router.get("/history", response_model=ChatHistoryOut)
def get_history(
    limit: int = Query(50, ge=1, le=200, description="Max items per page"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    request=None,
    db: Session = Depends(get_db)
):
    """Get chat history for the current user with pagination."""
    # Get current user from request.state (set by AuthMiddleware)
    user = getattr(request.state, "user", None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Get total count
    from ..models.chat_history import ChatHistory
    total = db.query(ChatHistory).filter(ChatHistory.user_id == user.id).count()
    
    # Get paginated items
    items = get_chat_history(db, user_id=user.id, limit=limit, offset=offset)
    
    return ChatHistoryOut(
        total=total,
        limit=limit,
        offset=offset,
        items=items
    )


@router.delete("/history/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(chat_id: str, request, db: Session = Depends(get_db)):
    """Delete a chat message (only if owned by current user)."""
    from ..models.chat_history import ChatHistory
    
    user = getattr(request.state, "user", None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Find and verify ownership
    import uuid
    try:
        chat_uuid = uuid.UUID(chat_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid chat ID format"
        )
    
    entry = db.query(ChatHistory).filter(
        (ChatHistory.id == chat_uuid) & (ChatHistory.user_id == user.id)
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat message not found or not owned by you"
        )
    
    db.delete(entry)
    db.commit()
    
    return None
