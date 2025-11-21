from datetime import datetime
import uuid
from sqlalchemy import Column, ForeignKey, DateTime, Text, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ..database import Base


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(32), nullable=False, default="user")
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = relationship("User", backref="chat_history")

    def __repr__(self) -> str:
        return f"<ChatHistory id={self.id} user_id={self.user_id} role={self.role} timestamp={self.timestamp}>"
