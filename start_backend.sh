#!/bin/bash
# 必要な環境変数を設定（例: GunicornがAPIサーバーを公開するポート）
export GUNICORN_PORT=8000
# GunicornでFlask/FastAPIアプリを起動
gunicorn -w 4 -b 0.0.0.0:$GUNICORN_PORT app:app &
# バックグラウンド(&)で起動したら、次のNode.jsサーバーに制御を渡す
# ...