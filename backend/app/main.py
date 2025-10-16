from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import products, orders, auth, users, admin
import os


#-----------------------------------------------
# データベーステーブル作成
#-----------------------------------------------
Base.metadata.create_all(bind=engine)
app = FastAPI(title="Fashion EC API")
#-----------------------------------------------
# CORS設定（Next.jsからアクセスできるように）
#-----------------------------------------------
# 本番環境用のCORS設定
origins = [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "http://localhost:3000")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#-----------------------------------------------
# ルーター登録
#-----------------------------------------------
app.include_router(products.router, prefix="/api", tags=["products"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])

# app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
# app.include_router(cart.router, prefix="/api/cart", tags=["cart"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.get("/")
def read_root():
    return {"message": "Fashion EC API"}