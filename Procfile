ExpressなどのNode.jsサーバーを間に挟み、静的なNext.jsのビルド済みファイル（フロントエンド）を提供しつつ、バックエンド（Flask/FastAPI）へのリクエストをプロキシする形を取る

Node.jsのExpressプロキシサーバーをHerokuの公開ポートで起動するのが基本
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
