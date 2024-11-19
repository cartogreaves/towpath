from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, Token, UserBase

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    db_user = User(email=user.email, username=user.username, hashed_password=hashed_password)
    
    db.add(db_user)
    db.commit()
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = next(get_db())
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserBase)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "username": current_user.username,
        "avatar": current_user.avatar
    }

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# auth.py (Backend)
@router.put("/update")
async def update_user(
    updates: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print(f"Received update request with data: {updates}")  # Debug print
    try:
        user = db.query(User).filter(User.id == current_user.id).first()
        
        if "email" in updates:
            print(f"Updating email to: {updates['email']}")  # Debug print
            existing_user = db.query(User).filter(User.email == updates["email"]).first()
            if existing_user and existing_user.id != current_user.id:
                raise HTTPException(status_code=400, detail="Email already registered")
            user.email = updates["email"]
            db.commit()
            access_token = create_access_token(data={"sub": updates["email"]})
            return {"access_token": access_token, "email": updates["email"]}
            
        if "username" in updates:
            existing_user = db.query(User).filter(User.username == updates["username"]).first()
            if existing_user and existing_user.id != current_user.id:
                raise HTTPException(status_code=400, detail="Username already taken")
            user.username = updates["username"]
            db.commit()
            return {"username": updates["username"]}
        
        if "current_password" in updates and "new_password" in updates:
            if not verify_password(updates["current_password"], user.hashed_password):
                raise HTTPException(status_code=400, detail="Incorrect password")
            user.hashed_password = pwd_context.hash(updates["new_password"])
            db.commit()
            access_token = create_access_token(data={"sub": user.email})
            return {"access_token": access_token}

        if "avatar" in updates:
            user.avatar = updates["avatar"]
            db.commit()
            return {"avatar": updates["avatar"]}
            
        raise HTTPException(status_code=400, detail="No valid update fields provided")
        
    except Exception as e:
        db.rollback()
        print(f"Error updating user: {str(e)}")  # Debug print
        raise HTTPException(status_code=500, detail=str(e))