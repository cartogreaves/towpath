from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: str
    username: str

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str