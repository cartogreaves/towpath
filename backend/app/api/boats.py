# app/api/boats.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List

from ..database import get_db
from ..models.boat import Boat
from ..models.user import User
from ..models.friend import Friendship, FriendshipStatus
from ..schemas.boat import BoatCreate, BoatUpdate, Boat as BoatSchema, BoatWithUser
from .auth import get_current_user

router = APIRouter()

# Get friends' boats (MUST come before /{boat_id} routes)
@router.get("/friends-boats", response_model=List[BoatWithUser])
async def get_friends_boats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Get all accepted friendships
        friendships = db.query(Friendship).filter(
            or_(
                and_(
                    Friendship.user_id == current_user.id,
                    Friendship.status == 'accepted'
                ),
                and_(
                    Friendship.friend_id == current_user.id,
                    Friendship.status == 'accepted'
                )
            )
        ).all()

        # Get friend IDs
        friend_ids = []
        for friendship in friendships:
            if friendship.user_id == current_user.id:
                friend_ids.append(friendship.friend_id)
            else:
                friend_ids.append(friendship.user_id)

        # Get boats of friends who have enabled location sharing
        friends_boats = db.query(Boat, User).join(User, Boat.user_id == User.id).filter(
            and_(
                Boat.user_id.in_(friend_ids),
                Boat.share_location_with_friends == True
            )
        ).all()

        # Convert to response format
        response_boats = []
        for boat, user in friends_boats:
            response_boats.append({
                "id": boat.id,
                "name": boat.name,
                "latitude": boat.latitude,
                "longitude": boat.longitude,
                "user_id": boat.user_id,
                "user_avatar": user.avatar,
                "user_username": user.username,
                "share_location_with_friends": boat.share_location_with_friends
            })

        return response_boats

    except Exception as e:
        print(f"Error fetching friends' boats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch friends' boats"
        )

# Get user's boats
@router.get("/my-boats", response_model=List[BoatSchema])
async def get_user_boats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Boat).filter(Boat.user_id == current_user.id).all()

# Create new boat
@router.post("/", response_model=BoatSchema)
async def create_boat(
    boat: BoatCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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
        share_location_with_friends=boat.share_location_with_friends,
        user_id=current_user.id
    )
    db.add(db_boat)
    db.commit()
    db.refresh(db_boat)
    return db_boat

# Get specific boat
@router.get("/{boat_id}", response_model=BoatSchema)
async def get_boat(
    boat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    boat = db.query(Boat).filter(
        Boat.id == boat_id,
        Boat.user_id == current_user.id
    ).first()
    if not boat:
        raise HTTPException(status_code=404, detail="Boat not found")
    return boat

# Update boat
@router.put("/{boat_id}", response_model=BoatSchema)
async def update_boat(
    boat_id: int,
    boat_update: BoatUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_boat = db.query(Boat).filter(
        Boat.id == boat_id,
        Boat.user_id == current_user.id
    ).first()
    if not db_boat:
        raise HTTPException(status_code=404, detail="Boat not found")
    
    for field, value in boat_update.dict(exclude_unset=True).items():
        setattr(db_boat, field, value)
    
    db.commit()
    db.refresh(db_boat)
    return db_boat

# Delete boat
@router.delete("/{boat_id}")
async def delete_boat(
    boat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    boat = db.query(Boat).filter(
        Boat.id == boat_id,
        Boat.user_id == current_user.id
    ).first()
    if not boat:
        raise HTTPException(status_code=404, detail="Boat not found")
    
    db.delete(boat)
    db.commit()
    return {"message": "Boat deleted successfully"}