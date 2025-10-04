/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的エクスポートを有効にする
  output: 'export',

  // 静的エクスポート時に trailingSlash を付けるかどうかはお好みで
  trailingSlash: true,
};

export default nextConfig;
