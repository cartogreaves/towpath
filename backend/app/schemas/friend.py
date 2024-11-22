# app/schemas/friend.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class FriendshipStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class FriendshipBase(BaseModel):
    friend_id: int

class FriendshipCreate(FriendshipBase):
    pass

class Friendship(FriendshipBase):
    id: int
    user_id: int
    status: FriendshipStatus
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class FriendProfile(BaseModel):
    id: int
    username: str
    avatar: str
    friendship_id: Optional[int] = None
    friendship_status: Optional[FriendshipStatus] = None

    class Config:
        from_attributes = True

class FriendResponse(BaseModel):
    friends: List[FriendProfile]
    pending_sent: List[FriendProfile]
    pending_received: List[FriendProfile]