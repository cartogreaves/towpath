# app/models/boat.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Boat(Base):
    __tablename__ = "boats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    share_location_with_friends = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to User
    user = relationship("User", back_populates="boats")