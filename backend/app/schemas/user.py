# schemas/user.py
from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: str
    username: str
    avatar: str = '👤'

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    avatar: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# Combined response for updates that return both user and token
class UserWithToken(BaseModel):
    user: UserBase
    access_token: Optional[str] = None