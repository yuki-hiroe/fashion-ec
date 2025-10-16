from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"

#-------------------------------------------------------
#カテゴリテーブル
#-------------------------------------------------------
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True)  # URL用
    created_at = Column(DateTime, default=datetime.utcnow)
    # -------------------------------------------------------
    # リレーション
    # -------------------------------------------------------
    products = relationship("Product", back_populates="category")

#-------------------------------------------------------
#商品テーブル
#-------------------------------------------------------
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True) #商品ID
    name = Column(String(200), nullable=False) #商品名
    description = Column(Text) #説明
    price = Column(Float, nullable=False) #値段
    category_id = Column(Integer, ForeignKey("categories.id"))
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    image_url = Column(Text)
    stock = Column(Integer, default=1) #在庫管理
    is_active = Column(Boolean, default=True)
    status = Column(String(50), default="available")  # available, sold, deleted
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # -------------------------------------------------------
    # リレーション
    # -------------------------------------------------------
    category = relationship("Category", back_populates="products")
    seller = relationship("User", foreign_keys=[seller_id])

#-------------------------------------------------------
#ユーザーテーブル
#-------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# -------------------------------------------------------
# 注文テーブル
# ------------------------------------------------------
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="pending")  # pending, confirmed, shipped, delivered, canceled
    shipping_address = Column(Text, nullable=False)
    shipping_name = Column(String(100), nullable=False)
    shipping_phone = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")
    order_items = relationship("OrderItem", back_populates="order")

# -------------------------------------------------------
# 注文項目テーブル
# ------------------------------------------------------
class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # 注文時の価格を保存

    order = relationship("Order", back_populates="order_items")
    product = relationship("Product")