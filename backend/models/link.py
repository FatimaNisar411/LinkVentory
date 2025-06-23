from beanie import Document
from pydantic import HttpUrl, Field
from datetime import datetime
from typing import Optional


class Link(Document):
    user_id: str  # Owner of the link
    url: HttpUrl
    title: str
    note: Optional[str] = None
    category_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "links"  # MongoDB collection name

    class Config:
        schema_extra = {
            "example": {
                "user_id": "64fa2c3b2f3b5d6a9b8e7b12",
                "url": "https://example.com/resource",
                "title": "Interesting Article",
                "note": "Read later for internship prep",
                "category_id": "64fa2c9a2b6d3f9b4a7d4f13",
                "created_at": "2025-06-23T12:00:00Z"
            }
        }
