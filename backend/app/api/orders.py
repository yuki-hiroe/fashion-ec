# 注文用APIエンドポイント
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth
from ..database import get_db
from jose import JWTError, jwt

router = APIRouter()


def get_current_user(token: str, db: Session):
    """トークンから現在のユーザーを取得"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="認証情報を検証できませんでした",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = auth.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception

    return user


@router.post("/", response_model=schemas.OrderResponse)
def create_order(
        order: schemas.OrderCreate,
        token: str,
        db: Session = Depends(get_db)
):
    """新規注文を作成"""
    # ユーザー認証
    current_user = get_current_user(token, db)

    # 合計金額を計算
    total_amount = sum(item.price * item.quantity for item in order.items)

    # 注文を作成
    db_order = models.Order(
        user_id=current_user.id,
        total_amount=total_amount,
        shipping_name=order.shipping_name,
        shipping_phone=order.shipping_phone,
        shipping_address=order.shipping_address
    )
    db.add(db_order)
    db.flush()  # IDを取得するためにflush

    # 注文アイテムを作成
    for item in order.items:
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_order_item)

    db.commit()
    db.refresh(db_order)

    return db_order


@router.get("/", response_model=List[schemas.OrderResponse])
def get_user_orders(
        token: str,
        db: Session = Depends(get_db)
):
    """ユーザーの注文履歴を取得"""
    current_user = get_current_user(token, db)

    orders = db.query(models.Order).filter(
        models.Order.user_id == current_user.id
    ).order_by(models.Order.created_at.desc()).all()

    return orders


@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(
        order_id: int,
        token: str,
        db: Session = Depends(get_db)
):
    """注文詳細を取得"""
    current_user = get_current_user(token, db)

    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="注文が見つかりません")

    return order