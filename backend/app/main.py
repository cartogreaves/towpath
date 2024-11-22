from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, boats, friends

app = FastAPI(title="Towpath Community API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["*"]  # Exposes all headers
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(boats.router, prefix="/boats", tags=["boats"])
app.include_router(friends.router, prefix="/friends", tags=["friends"])

@app.get("/")
async def root():
    return {"message": "Towpath Community API"}