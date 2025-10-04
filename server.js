const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000; // Herokuが指定するポートを使用
// バックエンドサーバーが起動しているポートを指定 (例: 8000番)
const BACKEND_PORT = 8000;

// Next.jsのビルド結果ディレクトリを指定
// Next.jsの 'output: "export"' でビルドされると 'out' フォルダが生成されます。
const FRONTEND_BUILD_PATH = path.join(__dirname, 'frontend', 'out');

app.use(
  // プロキシするパス（例: /api/ で始まるリクエスト）
  '/api',
  createProxyMiddleware({
    target: `http://localhost:${BACKEND_PORT}`, // 転送先
    changeOrigin: true, // ホストヘッダーの書き換えを許可
  })
);
// ------------------------------------------------------------------
// 1. APIプロキシ設定を最初に記述
// ------------------------------------------------------------------
// /api/ で始まるリクエストを、バックエンド（Flask/FastAPI）へ転送
app.use(
  '/api',
  createProxyMiddleware({
    target: `http://localhost:${BACKEND_PORT}`, // バックエンドサーバーのポート
    changeOrigin: true, // ホストヘッダーの書き換えを許可
  })
);
// ------------------------------------------------------------------
// 2. 静的ファイルの配信とSPAフォールバック
// ------------------------------------------------------------------
// 静的ファイルを配信 (CSS, JS, 画像など)
app.use(express.static(FRONTEND_BUILD_PATH));
// SPAのルーティングに対応するため、上記APIと静的ファイルに該当しない
// すべてのGETリクエストを index.html にフォールバックさせる
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});
// ------------------------------------------------------------------
// 3. サーバー起動
// ------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});