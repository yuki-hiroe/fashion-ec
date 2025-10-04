import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover-lift animate-slide-up cursor-pointer">
        {/* 画像エリア */}
        <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* 価格バッジ */}
          <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
            ¥{product.price.toLocaleString()}
          </div>
        </div>

        {/* 情報エリア */}
        <div className="p-5">
          {/* カテゴリ */}
          {product.category && (
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}

          {/* 商品名 */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>

          {/* 説明 */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* 在庫状況 */}
          <div className="flex items-center justify-between">
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 font-semibold">
                在庫あり
              </span>
            ) : (
              <span className="text-xs text-red-600 font-semibold">
                売り切れ
              </span>
            )}
            <span className="text-sm font-semibold text-black group-hover:underline">
              詳細を見る →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}