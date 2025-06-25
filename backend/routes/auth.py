# backend/routes/auth.py
from fastapi import APIRouter, HTTPException, Depends
from models.user import User
from auth import hash_password, verify_password, create_access_token
from db import init_db
from pydantic import BaseModel
from beanie import PydanticObjectId

router = APIRouter()

class SignUpRequest(BaseModel):
    name:str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def signup(user: SignUpRequest):
    try:
        existing = await User.find_one(User.email == user.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        new_user = User(
            name=user.name,
            email=user.email,
            password=hash_password(user.password)  # still saving as .password, just hashed
        )
        await new_user.insert()

        # 🔐 Generate token
        token = create_access_token({"sub": new_user.email})

        return {
            "message": "User created",
            "access_token": token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during signup")



@router.post("/login")
async def login(user: LoginRequest):
    existing = await User.find_one(User.email == user.email)
    if not existing or not verify_password(user.password, existing.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": existing.email})
    return {"access_token": token, "token_type": "bearer"}
