# Pythonのベースイメージ
FROM python:3.12-slim

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係のインストール
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY backend/ /app

# UvicornでFastAPIを起動（ポート8000、ホスト0.0.0.0で公開）
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]