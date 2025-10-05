
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的エクスポートを無効にする
  // output: 'export',

  // 静的エクスポート時に trailingSlash を付けるかどうかはお好みで
  // trailingSlash: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};

export default nextConfig;
