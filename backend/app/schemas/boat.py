# app/schemas/boat.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BoatBase(BaseModel):
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    share_location_with_friends: bool = False

class BoatCreate(BoatBase):
    pass

class BoatUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    share_location_with_friends: Optional[bool] = None

class Boat(BoatBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class BoatWithUser(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    user_id: int
    user_avatar: str
    user_username: str
    share_location_with_friends: bool

    class Config:
        from_attributes = True