# routers/links.py
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from models.link import Link
from models.user import User
from auth import get_current_user
from typing import List, Optional
from beanie import PydanticObjectId
from pydantic import BaseModel, HttpUrl
from typing import Optional
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LinkUpdate(BaseModel):
    url: Optional[HttpUrl] = None
    title: Optional[str] = None
    note: Optional[str] = None
    category_id: Optional[str] = None


router = APIRouter(prefix="/links", tags=["Links"])

@router.post("/", response_model=Link)
async def create_link(link: Link, user: User = Depends(get_current_user)):
    link.user_id = str(user.id)
    await link.insert()
    return link

@router.get("/", response_model=List[Link])
async def get_links(
    user: User = Depends(get_current_user),
    category_id: Optional[str] = Query(None)
):
    query = Link.user_id == str(user.id)
    if category_id:
        query = query & (Link.category_id == category_id)
    return await Link.find(query).to_list()


# @router.put("/{link_id}", response_model=Link)
# async def update_link(link_id: PydanticObjectId, updated: Link, user: User = Depends(get_current_user)):
#     link = await Link.get(link_id)
#     if not link or link.user_id != str(user.id):
#         raise HTTPException(status_code=404, detail="Link not found")
#     link.title = updated.title
#     link.note = updated.note
#     link.category_id = updated.category_id
#     await link.save()
#     return link
@router.patch("/{link_id}", response_model=Link)
async def update_link(link_id: PydanticObjectId, updated: LinkUpdate, user: User = Depends(get_current_user)):
    link = await Link.get(link_id)
    if not link or link.user_id != str(user.id):
        raise HTTPException(status_code=404, detail="Link not found")
    
    update_data = updated.dict(exclude_unset=True)  # Only fields sent in request
    for field, value in update_data.items():
        setattr(link, field, value)
    
    await link.save()
    return link



@router.delete("/{link_id}")
async def delete_link(link_id: PydanticObjectId, user: User = Depends(get_current_user)):
    link = await Link.get(link_id)
    if not link or link.user_id != str(user.id):
        raise HTTPException(status_code=404, detail="Link not found")
    await link.delete()
    return {"message": "Link deleted"}



@router.get("/category/{category_id}", response_model=List[Link])
async def get_links_by_category(
    category_id: PydanticObjectId = Path(..., description="Category ID to filter links"),
    user: User = Depends(get_current_user)
):
    logging.info(f"User ID: {user.id}, Category ID: {category_id}")
    links = await Link.find(
    {
        "user_id": str(user.id),
        "category_id": str(category_id),
    }
).to_list()

    logging.info(f"Found {len(links)} links")
    return links