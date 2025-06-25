# routers/categories.py
from fastapi import APIRouter, Depends, HTTPException
from models.category import Category
from models.user import User
from auth import get_current_user
from typing import List
from beanie import PydanticObjectId
from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str

class CategoryUpdate(BaseModel):
    name: str

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=Category)
async def create_category(category_data: CategoryCreate, user: User = Depends(get_current_user)):
    category = Category(
        user_id=str(user.id),
        name=category_data.name
    )
    await category.insert()
    return category

@router.get("/", response_model=List[Category])
async def get_user_categories(user: User = Depends(get_current_user)):
    return await Category.find(Category.user_id == str(user.id)).to_list()

@router.put("/{category_id}", response_model=Category)
async def update_category(
    category_id: PydanticObjectId,
    new_data: CategoryUpdate,
    user: User = Depends(get_current_user),
):
    category = await Category.get(category_id)
    if not category or category.user_id != str(user.id):
        raise HTTPException(status_code=404, detail="Category not found")

    category.name = new_data.name
    await category.save()
    return category


@router.delete("/{category_id}")
async def delete_category(category_id: PydanticObjectId, user: User = Depends(get_current_user)):
    category = await Category.get(category_id)
    if not category or category.user_id != str(user.id):
        raise HTTPException(status_code=404, detail="Category not found")
    await category.delete()
    return {"message": "Category deleted"}

class CategoryUpdate(BaseModel):
    name: str
