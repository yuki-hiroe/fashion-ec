Fashion EC - C2Cマーケットプレイス型ECサイト
高校生・大学生向けのトレンド感あるファッションECサイト。ユーザーが商品を出品・購入できるC2C（Consumer to Consumer）マーケットプレイス機能を搭載。
技術スタック
バックエンド

FastAPI - PythonのWebフレームワーク
SQLAlchemy - ORM
SQLite - データベース（開発環境）
JWT - 認証
Pydantic - バリデーション
Passlib - パスワードハッシュ化

フロントエンド

Next.js 15 - Reactフレームワーク（App Router）
JavaScript - プログラミング言語
Tailwind CSS - スタイリング
Context API - 状態管理（Cart、Auth）

主な機能
ユーザー機能

✅ ユーザー登録・ログイン（JWT認証）
✅ 商品一覧・詳細表示
✅ カテゴリフィルター（トップス、ボトムス、アウター、アクセサリー）
✅ 価格フィルター（¥3,000以下、¥5,000以下、¥10,000以下）
✅ ショッピングカート機能（LocalStorage永続化）
✅ 注文処理・注文完了画面
✅ マイページ（出品商品一覧）

管理者機能

✅ 管理者専用画面
✅ 商品登録・編集・削除
✅ 全商品一覧管理

デザイン

✅ レスポンシブデザイン（スマホファースト）
✅ グラデーション・ホバーエフェクト
✅ アニメーション（スライドアップ、スケール変換）
✅ モダンなUI/UX

プロジェクト構成
fashion-ec/
├── backend/                    # FastAPIバックエンド
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPIアプリケーション
│   │   ├── database.py        # DB接続設定
│   │   ├── models.py          # SQLAlchemyモデル
│   │   ├── schemas.py         # Pydanticスキーマ
│   │   ├── auth.py            # 認証ロジック
│   │   └── api/               # APIエンドポイント
│   │       ├── products.py    # 商品API
│   │       ├── auth.py        # 認証API
│   │       └── orders.py      # 注文API
│   ├── create_sample_data.py  # サンプルデータ作成
│   ├── requirements.txt
│   └── venv/
│
└── frontend/                   # Next.jsフロントエンド
    ├── app/
    │   ├── page.js            # トップページ
    │   ├── layout.js          # レイアウト
    │   ├── globals.css        # グローバルCSS
    │   ├── products/[id]/     # 商品詳細
    │   ├── cart/              # カート
    │   ├── checkout/          # 注文確認
    │   ├── order-complete/    # 注文完了
    │   ├── login/             # ログイン
    │   ├── register/          # 新規登録
    │   ├── mypage/            # マイページ
    │   ├── sell/              # 出品（無効化済み）
    │   └── admin/             # 管理者画面
    ├── components/
    │   ├── Header.js          # ヘッダー
    │   └── ProductCard.js     # 商品カード
    ├── contexts/
    │   ├── CartContext.js     # カート状態管理
    │   └── AuthContext.js     # 認証状態管理
    └── public/
        └── images/            # 商品画像
セットアップ手順
1. バックエンドのセットアップ
bashcd fashion-ec/backend

# 仮想環境作成
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# パッケージインストール
pip install -r requirements.txt

# サンプルデータ作成
python create_sample_data.py

# サーバー起動
uvicorn app.main:app --reload
2. フロントエンドのセットアップ
bashcd fashion-ec/frontend

# パッケージインストール
npm install --legacy-peer-deps

# Tailwind関連
npm install -D tailwindcss @tailwindcss/postcss

# 開発サーバー起動
npm run dev
3. アクセス

フロントエンド: http://localhost:3000
バックエンドAPI: http://localhost:8000
API ドキュメント: http://localhost:8000/docs

デフォルトアカウント
管理者

メールアドレス: admin@example.com
ユーザー名: admin
パスワード: admin123

一般ユーザー

メールアドレス: user@example.com
ユーザー名: testuser
パスワード: user123

データベース構造
テーブル

users - ユーザー情報（role: user/admin）
categories - カテゴリ
products - 商品（seller_id で出品者と紐付け）
orders - 注文
order_items - 注文明細

# API エンドポイント
# 認証

POST /api/auth/register - 新規登録
POST /api/auth/login - ログイン
GET /api/auth/me - ユーザー情報取得

# 商品

GET /api/products - 商品一覧
GET /api/products/{id} - 商品詳細
POST /api/products - 商品登録（要認証）
PUT /api/products/{id} - 商品編集（要認証）
DELETE /api/products/{id} - 商品削除（要認証）
GET /api/my-products - 自分の出品商品（要認証）

# カテゴリ

GET /api/categories - カテゴリ一覧

# 注文

POST /api/orders/ - 注文作成（要認証）
GET /api/orders/ - 注文履歴（要認証）
GET /api/orders/{id} - 注文詳細（要認証）

# 主な依存パッケージ
バックエンド
fastapi
uvicorn
sqlalchemy
pydantic
python-jose[cryptography]
passlib[bcrypt]
python-multipart
フロントエンド
next@latest
react@latest
tailwindcss
@tailwindcss/postcss
開発のポイント
CSRF対策

バックエンドはCSRF保護が有効
フロントエンドでトークンをクエリパラメータで送信

# 画像管理

public/images/に商品画像を配置
データベースには/images/product.jpg形式で保存

# 認証フロー

ログイン → JWTトークン取得
LocalStorageに保存
API リクエスト時にトークンを送信

# 今後の拡張案

画像検索機能（例：欲しい服を画像から探す）
商品レビュー機能
お気に入り機能
注文履歴ページ
ユーザー間メッセージング
決済機能統合（Stripe等）
画像アップロード機能（Cloudinary等）

