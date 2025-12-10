"""Chat history routes (save and retrieve messages)."""

from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.chat_service import save_chat, get_chat_history
from ..schemas import ChatMessageCreate, ChatMessageOut, ChatHistoryOut

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/send", response_model=ChatMessageOut, status_code=status.HTTP_201_CREATED)
def chat_with_bot(chat_in: ChatMessageCreate, request: Request, db: Session = Depends(get_db)):
    """Chat with the bot: validates user, generates RAG response, and saves history."""
    # Get current user from request.state (set by AuthMiddleware)
    user = getattr(request.state, "user", None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    # Import RAG modules here to avoid circular imports or context issues
    try:
        from ..rag.retriever import retrieve_context
        from ..rag.generator import generate_answer
    except ImportError as e:
         print(f"RAG IMPORT ERROR: {e}")
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG module not found: {str(e)}"
        )

    # Generate Response
    try:
        context = retrieve_context(chat_in.message)
        answer = generate_answer(chat_in.message, context)
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG Error: {str(e)}"
        )
    
    # Save chat entry
    entry = save_chat(
        db=db,
        user_id=user.id,
        message=chat_in.message,
        response=answer, # The AI response
        role="user" # The initiator
    )
    
    return entry


@router.get("/history", response_model=ChatHistoryOut)
def get_history(
    limit: int = Query(50, ge=1, le=200, description="Max items per page"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    request: Request = None,
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
    
    # Convert to Pydantic models
    items_validated = [ChatMessageOut.model_validate(item) for item in items]
    
    return ChatHistoryOut(
        total=total,
        limit=limit,
        offset=offset,
        items=items_validated
    )


@router.delete("/history/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(chat_id: str, request: Request, db: Session = Depends(get_db)):
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
