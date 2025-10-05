from app.database import SessionLocal, engine
from app.models import Base, Category, Product, User
from app.auth import get_password_hash

# テーブル作成
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# 既存データをクリア（開発環境のみ）
db.query(Product).delete()
db.query(Category).delete()
db.query(User).delete()
db.commit()

# 管理者ユーザーを作成
admin_user = User(
    email="admin@example.com",
    username="admin",
    hashed_password=get_password_hash("admin123"),
    role="admin"
)
db.add(admin_user)

# テストユーザーを作成
test_user = User(
    email="user@example.com",
    username="testuser",
    hashed_password=get_password_hash("user123"),
    role="user"
)
db.add(test_user)
db.commit()


# カテゴリデータ
categories_data = [
    {"name": "トップス", "slug": "tops"},
    {"name": "アウター", "slug": "outerwear"},
    {"name": "パーカー", "slug": "hoodies"},
    {"name": "シャツ", "slug": "t-shirts"},
    {"name": "パンツ", "slug": "pants"},
    {"name": "スカート", "slug": "skirts"},
    {"name": "ヘアス", "slug": "heads"},
    {"name": "シューズ", "slug": "shoes"},
    {"name": "アクセサリー", "slug": "accessories"},
    {"name": "その他", "slug": "other"},
]

categories = []
for cat_data in categories_data:
    category = Category(**cat_data)
    db.add(category)
    categories.append(category)

db.commit()

# 商品データ(test_userが出品)
products_data = [
    {
        "name": "オーバーサイズパーカー",
        "description": "トレンドのオーバーサイズシルエット",
        "price": 4980,
        "category_id": 1,
        "seller_id": test_user.id,
        "image_url": "/images/oversized-hoodie.jpg",
        "stock": 3
    },
]

for prod_data in products_data:
    product = Product(**prod_data)
    db.add(product)

db.commit()
db.close()

print("✅ サンプルデータを追加しました！")
print(f"カテゴリ: {len(categories_data)}件")
print(f"商品: {len(products_data)}件")
print(f"管理者: email=admin@example.com, password=admin123")
print(f"一般ユーザー: email=user@example.com, password=user123")