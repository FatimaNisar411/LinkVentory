# models/user.py
from beanie import Document
from pydantic import EmailStr


class User(Document):
    name: str
    email: EmailStr
    password: str

    class Settings:
        name = "users"  # MongoDB collection name

    class Config:
        schema_extra = {
            "example": {
                "name": "Fatima",
                "email": "fatima@example.com",
                "password": "hashed_password_here"
            }
        }
