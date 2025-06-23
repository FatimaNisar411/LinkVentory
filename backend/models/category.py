from beanie import Document
from pydantic import Field
from datetime import datetime


class Category(Document):
    user_id: str  # Owner of the category
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "categories"  # MongoDB collection name

    class Config:
        schema_extra = {
            "example": {
                "user_id": "64fa2c3b2f3b5d6a9b8e7b12",
                "name": "Work",
                "created_at": "2025-06-23T12:00:00Z"
            }
        }
