from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BoatBase(BaseModel):
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class BoatCreate(BoatBase):
    pass

class BoatUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class Boat(BoatBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True