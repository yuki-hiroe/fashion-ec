from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models, auth
from app.database import get_db
from app.auth import get_current_user, get_password_hash

router = APIRouter()


@router.get("/users", response_model=List[schemas.UserResponse])
def get_all_users(
        authorization: str = Header(None),  # ヘッダーから取得
        db: Session = Depends(get_db)
):
    """全ユーザー取得（管理者のみ）"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="認証が必要です")

    token = authorization.replace("Bearer ", "")
    current_user = auth.get_current_user(token, db)

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="権限がありません")

    users = db.query(models.User).all()
    return users


@router.delete("/users/{user_id}")
def delete_user(
        user_id: int,
        authorization: str = Header(None),  # ヘッダーから取得
        db: Session = Depends(get_db)
):
    """ユーザー削除（管理者のみ）"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="認証が必要です")

    token = authorization.replace("Bearer ", "")
    current_user = auth.get_current_user(token, db)

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="権限がありません")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")

    if user.role == "admin":
        raise HTTPException(status_code=400, detail="管理者は削除できません")

    # ユーザーの商品を論理削除
    db.query(models.Product).filter(
        models.Product.seller_id == user_id
    ).update({
        "status": "deleted",
        "is_active": False
    })

    db.delete(user)
    db.commit()

    return {"message": "ユーザーを削除しました"}


@router.put("/users/{user_id}")
def update_user(
        user_id: int,
        user_update: dict,
        authorization: str = Header(None),
        db: Session = Depends(get_db)
):
    """ユーザー情報更新（管理者のみ）"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="認証が必要です")

    token = authorization.replace("Bearer ", "")
    current_user = auth.get_current_user(token, db)

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="権限がありません")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")

    # 更新
    if "username" in user_update:
        user.username = user_update["username"]
    if "email" in user_update:
        user.email = user_update["email"]
    if "role" in user_update:
        user.role = user_update["role"]
    if "password" in user_update and user_update["password"]:
        # パスワードが空でない場合のみハッシュ化して更新
        user.hashed_password = get_password_hash(user_update["password"])

    db.commit()
    db.refresh(user)

    return {"message": "ユーザー情報を更新しました"}