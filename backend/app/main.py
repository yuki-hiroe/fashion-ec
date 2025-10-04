from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api import products, auth, orders
import os

#-----------------------------------------------
# データベーステーブル作成
#-----------------------------------------------
Base.metadata.create_all(bind=engine)
app = FastAPI(title="Fashion EC API")
#-----------------------------------------------
# CORS設定（Next.jsからアクセスできるように）
#-----------------------------------------------

origins = [
    "http://localhost:3000",
    "https://your-frontend-app.vercel.app",  # 後でフロントエンドのURLに変更
    os.getenv("FRONTEND_URL", "http://localhost:3000")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Next.jsのURL
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

@app.get("/")
def read_root():
    return {"message": "Fashion EC API"}