from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api import products

# データベーステーブル作成
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fashion EC API")

# CORS設定（Next.jsからアクセスできるように）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.jsのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(products.router, prefix="/api", tags=["products"])

@app.get("/")
def read_root():
    return {"message": "Fashion EC API"}