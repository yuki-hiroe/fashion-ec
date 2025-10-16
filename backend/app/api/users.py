from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from app import schemas, models
from app.database import get_db

router = APIRouter()


@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """ユーザー情報を取得"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return user


@router.get("/{user_id}/products", response_model=List[schemas.ProductResponse])
def get_user_products(user_id: int, db: Session = Depends(get_db)):
    """特定ユーザーの商品を取得（売却済みも含む）"""
    products = db.query(models.Product).options(
        joinedload(models.Product.seller),
        joinedload(models.Product.category)
    ).filter(
        models.Product.seller_id == user_id,
        models.Product.status != "deleted",
        models.Product.is_active == True
    ).all()
    return products