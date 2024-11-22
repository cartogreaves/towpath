# app/models/friend.py
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class FriendshipStatus:
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

class Friendship(Base):
    __tablename__ = "friendships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    friend_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(10), nullable=False, default=FriendshipStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        CheckConstraint(
            status.in_([FriendshipStatus.PENDING, FriendshipStatus.ACCEPTED, FriendshipStatus.REJECTED]),
            name='valid_status'
        ),
    )

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="friendships_initiated")
    friend = relationship("User", foreign_keys=[friend_id], back_populates="friendships_received")