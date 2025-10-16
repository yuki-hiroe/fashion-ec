'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductCard({ product }) {
  const params = useParams();
  const currentUserId = params.userId;
  return (

    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover-lift animate-slide-up cursor-pointer">
      {/* 画像エリア */}
      <Link href={`/products/${product.id}`}>
        <div className="aspect-[4/5] relative overflow-hidden bg-white">
          <img
            src={product.image_url || '/images/default.jpg'}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              product.status === 'sold' 
                ? 'opacity-40 grayscale' 
                : 'group-hover:scale-110'
            }`}
          />

          {/* 売り切れオーバーレイ */}
          {product.status === 'sold' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-2xl shadow-2xl transform -rotate-12">
                SOLD OUT
              </div>
            </div>
          )}

          {/* 価格バッジ */}
          <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
            ¥{product.price.toLocaleString()}
          </div>
        </div>
      </Link>
      {/* 情報エリア */}
      <div className="p-5">
          {/* 出品者情報を追加 */}
          {product.seller &&　currentUserId !== String(product.seller.id) && (
            <Link href={`/shop/${product.seller.id}`}>
              <div className="text-xs text-gray-500 mb-2 hover:text-gray-700 hover:underline cursor-pointer flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                by {product.seller.username}
              </div>
            </Link>
          )}

          {product.category && (
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}

        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          {product.status === 'sold' ? (
            <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-semibold">
              売り切れ
            </span>
          ) : product.status === 'deleted' ? (
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold">
                販売終了
              </span>
          ) : product.stock > 0 ? (
            <span className="text-xs text-green-600 font-semibold">
              在庫あり
            </span>
          ) : (
            <span className="text-xs text-red-600 font-semibold">
              在庫切れ
            </span>
          )}
          <Link href={`/products/${product.id}`}>
            <span className="text-sm font-semibold text-black group-hover:underline">
              詳細を見る →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}