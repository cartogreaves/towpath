# app/api/friends.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
import logging

from ..database import get_db
from ..models.friend import Friendship, FriendshipStatus
from ..models.user import User
from ..schemas.friend import FriendshipCreate, FriendResponse, FriendProfile
from .auth import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/search/{username}", response_model=List[FriendProfile])
async def search_users(
    username: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Searching for users with username like: {username}")
    
    try:
        # Get users matching the search query
        users = db.query(User).filter(
            User.username.ilike(f"%{username}%"),
            User.id != current_user.id
        ).all()
        
        logger.info(f"Found {len(users)} users matching search query")
        
        if not users:
            return []
        
        # Get existing friendships for these users
        user_ids = [user.id for user in users]
        friendships = db.query(Friendship).filter(
            or_(
                and_(Friendship.user_id == current_user.id, Friendship.friend_id.in_(user_ids)),
                and_(Friendship.friend_id == current_user.id, Friendship.user_id.in_(user_ids))
            )
        ).all()
        
        # Create a mapping of user_id to friendship details
        friendship_map = {}
        for friendship in friendships:
            other_id = friendship.friend_id if friendship.user_id == current_user.id else friendship.user_id
            friendship_map[other_id] = {
                "id": friendship.id,
                "status": friendship.status
            }
        
        # Convert users to FriendProfile responses
        response = []
        for user in users:
            friend_profile = FriendProfile(
                id=user.id,
                username=user.username,
                avatar=user.avatar,
                friendship_id=friendship_map.get(user.id, {}).get("id"),
                friendship_status=friendship_map.get(user.id, {}).get("status")
            )
            response.append(friend_profile)
        
        return response
        
    except Exception as e:
        logger.error(f"Error in search_users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while searching for users"
        )

@router.post("/request", status_code=status.HTTP_201_CREATED)
async def send_friend_request(
    friend_request: FriendshipCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Received friend request from user {current_user.id} to {friend_request.friend_id}")
        
        # Check if friend exists
        friend = db.query(User).filter(User.id == friend_request.friend_id).first()
        if not friend:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if trying to friend self
        if friend.id == current_user.id:
            raise HTTPException(status_code=400, detail="Cannot send friend request to yourself")
        
        # Check if friendship already exists
        existing_friendship = db.query(Friendship).filter(
            or_(
                and_(
                    Friendship.user_id == current_user.id,
                    Friendship.friend_id == friend.id
                ),
                and_(
                    Friendship.user_id == friend.id,
                    Friendship.friend_id == current_user.id
                )
            )
        ).first()
        
        if existing_friendship:
            if existing_friendship.status == FriendshipStatus.PENDING:
                raise HTTPException(status_code=400, detail="Friend request already sent")
            elif existing_friendship.status == FriendshipStatus.ACCEPTED:
                raise HTTPException(status_code=400, detail="Already friends")
            elif existing_friendship.status == FriendshipStatus.REJECTED:
                # If previously rejected, allow new request by updating status
                existing_friendship.status = FriendshipStatus.PENDING
                db.commit()
                return {"message": "Friend request sent successfully"}
        
        # Create new friendship request
        new_friendship = Friendship(
            user_id=current_user.id,
            friend_id=friend.id,
            status=FriendshipStatus.PENDING
        )
        
        db.add(new_friendship)
        db.commit()
        db.refresh(new_friendship)
        
        return {"message": "Friend request sent successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in send_friend_request: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/respond/{friendship_id}/{action}")
async def respond_to_friend_request(
    friendship_id: int,
    action: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        friendship = db.query(Friendship).filter(
            Friendship.id == friendship_id,
            Friendship.friend_id == current_user.id,
            Friendship.status == FriendshipStatus.PENDING
        ).first()
        
        if not friendship:
            raise HTTPException(status_code=404, detail="Friend request not found")
        
        if action.lower() == "accept":
            friendship.status = FriendshipStatus.ACCEPTED
        elif action.lower() == "reject":
            friendship.status = FriendshipStatus.REJECTED
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        db.commit()
        return {"message": f"Friend request {action}ed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in respond_to_friend_request: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=FriendResponse)
async def get_friends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        friendships = db.query(Friendship).filter(
            or_(
                Friendship.user_id == current_user.id,
                Friendship.friend_id == current_user.id
            )
        ).all()
        
        friends = []
        pending_sent = []
        pending_received = []
        
        for friendship in friendships:
            is_requester = friendship.user_id == current_user.id
            other_user = friendship.friend if is_requester else friendship.user
            
            profile = FriendProfile(
                id=other_user.id,
                username=other_user.username,
                avatar=other_user.avatar,
                friendship_id=friendship.id,
                friendship_status=friendship.status
            )
            
            if friendship.status == FriendshipStatus.ACCEPTED:
                friends.append(profile)
            elif friendship.status == FriendshipStatus.PENDING:
                if is_requester:
                    pending_sent.append(profile)
                else:
                    pending_received.append(profile)
        
        return FriendResponse(
            friends=friends,
            pending_sent=pending_sent,
            pending_received=pending_received
        )
    except Exception as e:
        logger.error(f"Error in get_friends: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching friends"
        )

@router.delete("/{friendship_id}")
async def remove_friend(
    friendship_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        friendship = db.query(Friendship).filter(
            Friendship.id == friendship_id,
            or_(
                Friendship.user_id == current_user.id,
                Friendship.friend_id == current_user.id
            )
        ).first()
        
        if not friendship:
            raise HTTPException(status_code=404, detail="Friendship not found")
        
        db.delete(friendship)
        db.commit()
        return {"message": "Friend removed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in remove_friend: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))