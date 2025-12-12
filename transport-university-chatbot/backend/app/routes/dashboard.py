from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List

from ..database import get_db
from ..models.user import User
from ..models.chat_history import ChatHistory
from ..schemas.dashboard import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("", response_model=DashboardStats)
def get_dashboard_stats(request: Request, db: Session = Depends(get_db)):
    """
    Get dashboard statistics.
    Requires: Admin privileges (checked via request.state.user_id and DB lookup)
    """
    # 1. Verify Authentication & Admin Status
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    current_user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
        
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required."
        )

    # 2. Collect Statistics
    # Total Users
    total_users = db.query(User).count()
    
    # Total Questions (User messages)
    total_questions = db.query(ChatHistory).filter(ChatHistory.role == "user").count()
    
    # Frequent Questions (Top 5 exact matches)
    frequent_questions_query = (
        db.query(ChatHistory.message, func.count(ChatHistory.message).label('count'))
        .filter(ChatHistory.role == "user")
        .group_by(ChatHistory.message)
        .order_by(func.count(ChatHistory.message).desc())
        .limit(5)
        .all()
    )
    
    frequent_questions_list = [q.message for q in frequent_questions_query]

    return {
        "total_users": total_users,
        "total_questions": total_questions,
        "frequent_questions": frequent_questions_list
    }
