from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.boat import Boat
from ..schemas.boat import BoatCreate, BoatUpdate, Boat as BoatSchema
from .auth import get_current_user
from ..models.user import User

router = APIRouter()

@router.post("/", response_model=BoatSchema)
async def create_boat(
    boat: BoatCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user already has a boat
    existing_boat = db.query(Boat).filter(Boat.user_id == current_user.id).first()
    if existing_boat:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a boat registered"
        )

    db_boat = Boat(
        name=boat.name,
        latitude=boat.latitude,
        longitude=boat.longitude,
        user_id=current_user.id
    )
    db.add(db_boat)
    db.commit()
    db.refresh(db_boat)
    return db_boat

@router.get("/my-boats", response_model=List[BoatSchema])
async def get_user_boats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Boat).filter(Boat.user_id == current_user.id).all()

@router.get("/{boat_id}", response_model=BoatSchema)
async def get_boat(
    boat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    boat = db.query(Boat).filter(Boat.id == boat_id, Boat.user_id == current_user.id).first()
    if not boat:
        raise HTTPException(status_code=404, detail="Boat not found")
    return boat

@router.put("/{boat_id}", response_model=BoatSchema)
async def update_boat(
    boat_id: int,
    boat_update: BoatUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_boat = db.query(Boat).filter(Boat.id == boat_id, Boat.user_id == current_user.id).first()
    if not db_boat:
        raise HTTPException(status_code=404, detail="Boat not found")
    
    for field, value in boat_update.dict(exclude_unset=True).items():
        setattr(db_boat, field, value)
    
    db.commit()
    db.refresh(db_boat)
    return db_boat

@router.delete("/{boat_id}")
async def delete_boat(
    boat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    boat = db.query(Boat).filter(Boat.id == boat_id, Boat.user_id == current_user.id).first()
    if not boat:
        raise HTTPException(status_code=404, detail="Boat not found")
    
    db.delete(boat)
    db.commit()
    return {"message": "Boat deleted successfully"}