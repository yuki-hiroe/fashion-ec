from pydantic import BaseModel, EmailStr
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime

#-------------------------------------------------------
#DBのテーブル、カラムの構造定義
#-------------------------------------------------------

if TYPE_CHECKING:
    # 型チェック時のみインポート（循環参照を避ける）
    pass
#-------------------------------------------------------
# カテゴリ
#-------------------------------------------------------
class CategoryBase(BaseModel):
    name: str
    slug: str


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# -------------------------------------------------------
# ユーザー
# -------------------------------------------------------
class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str
    role: Optional[str] = "user"

class UserResponse(UserBase):
    id: int
    hashed_password: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class User(UserBase):
    id: int
    is_active: bool
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

#-------------------------------------------------------
# 商品
#-------------------------------------------------------
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    image_url: Optional[str] = None
    stock: int = 0
    is_active: bool = True

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[Category] = None

    class Config:
        from_attributes = True

# 商品出品用
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    image_url: Optional[str] = None #Base64も可
    stock: int = 1

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    status: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    seller_id: int
    image_url: Optional[str] = None
    stock: int
    is_active: bool
    status: str
    created_at: datetime
    updated_at: datetime
    category: Optional[Category] = None
    seller: Optional[UserResponse]

    class Config:
        from_attributes = True

# -------------------------------------------------------
# トークン
# ------------------------------------------------------
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    
# ログインレスポンス用（新規追加）
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    username: str
    role: str
    user_id: int

# -------------------------------------------------------
# 注文アイテム
# -------------------------------------------------------
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float


class OrderItemResponse(OrderItemCreate):
    id: int
    product: Optional[Product] = None

    class Config:
        from_attributes = True

# -------------------------------------------------------
# 注文
# -------------------------------------------------------
class OrderCreate(BaseModel):
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    created_at: datetime
    order_items: List[OrderItemResponse]

    class Config:
        from_attributes = True