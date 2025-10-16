from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth
from ..database import get_db
from jose import JWTError, jwt
from sqlalchemy.orm import joinedload

router = APIRouter()

def get_current_user(token: str, db: Session):
    """トークンから現在のユーザーを取得"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="認証情報を検証できませんでした"
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

#-------------------------------------
# 商品一覧取得
#-------------------------------------
@router.get("/products", response_model=List[schemas.ProductResponse])
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = db.query(models.Product).options(
        joinedload(models.Product.seller),
        joinedload(models.Product.category)
    ).filter(
        models.Product.is_active == True,
        models.Product.status != "deleted"  # 削除済みのみ除外、soldは表示
    ).offset(skip).limit(limit).all()
    return products

#-------------------------------------
# 商品詳細取得
#-------------------------------------
@router.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """商品詳細を取得"""
    product = db.query(models.Product).options(
        joinedload(models.Product.seller),  # sellerを明示的にロード
        joinedload(models.Product.category)
    ).filter(models.Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="商品が見つかりません")

    return product

#-------------------------------------
# 特定ユーザーの商品一覧取得
#-------------------------------------
@router.get("/{user_id}/products", response_model=List[schemas.ProductResponse])
def get_user_products(user_id: int, db: Session = Depends(get_db)):
    """特定ユーザーの商品を取得（売却済みも含む）"""
    from sqlalchemy.orm import joinedload

    products = db.query(models.Product).options(
        joinedload(models.Product.seller),
        joinedload(models.Product.category)
    ).filter(
        models.Product.seller_id == user_id,
        models.Product.status != "deleted",  # 削除済みのみ除外
        models.Product.is_active == True
    ).all()
    return products


# 商品出品
@router.post("/products", response_model=schemas.ProductResponse)
def create_product(
        product: schemas.ProductCreate,
        token: str,
        db: Session = Depends(get_db)
):
    """商品を出品"""
    current_user = get_current_user(token, db)

    db_product = models.Product(
        **product.dict(),
        seller_id=current_user.id,
        status="available",
        is_active=True
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product


# 自分の出品商品一覧
@router.get("/my-products", response_model=List[schemas.ProductResponse])
def get_my_products(token: str, db: Session = Depends(get_db)):
    """自分が出品した商品一覧"""
    current_user = get_current_user(token, db)

    products = db.query(models.Product).filter(
        models.Product.seller_id == current_user.id,
        models.Product.status != "deleted"
    ).order_by(models.Product.created_at.desc()).all()

    return products


# 商品編集
@router.put("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(
        product_id: int,
        product_update: schemas.ProductUpdate,
        token: str,
        db: Session = Depends(get_db)
):
    """商品情報を更新"""
    current_user = get_current_user(token, db)

    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="商品が見つかりません")

    # 出品者本人または管理者のみ編集可能
    if db_product.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="権限がありません")

    # 更新
    for key, value in product_update.dict(exclude_unset=True).items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)

    return db_product


# 商品削除
@router.delete("/products/{product_id}")
def delete_product(
        product_id: int,
        token: str,
        db: Session = Depends(get_db)
):
    """商品を削除"""
    current_user = get_current_user(token, db)

    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="商品が見つかりません")

    # 出品者本人または管理者のみ削除可能
    if db_product.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="権限がありません")

    db_product.status = "deleted"
    db_product.is_active = False
    db.commit()

    return {"message": "商品を削除しました"}


#-------------------------------------
# カテゴリ一覧取得
#-------------------------------------
@router.get("/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()
    return categories