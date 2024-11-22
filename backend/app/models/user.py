# app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar = Column(String, default='👤')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    boats = relationship("Boat", back_populates="user")
    friendships_initiated = relationship("Friendship", 
                                      foreign_keys="[Friendship.user_id]",
                                      back_populates="user")
    friendships_received = relationship("Friendship", 
                                      foreign_keys="[Friendship.friend_id]",
                                      back_populates="friend")