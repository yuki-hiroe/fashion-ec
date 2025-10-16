'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../../components/Header';
import ProductCard from '../../../../components/ProductCard';

export default function ShopPage() {
  const params = useParams();
  const router = useRouter();
  const [shopOwner, setShopOwner] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        // ショップオーナー情報取得
        const userRes = await fetch(`${API_URL}/api/users/${params.userId}`);
        if (!userRes.ok) {
          throw new Error('ユーザーが見つかりません');
        }
        const userData = await userRes.json();
        setShopOwner(userData);

        // そのユーザーの商品取得
        const productsRes = await fetch(`${API_URL}/api/users/${params.userId}/products`);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.userId) {
      fetchShopData();
    }
  }, [params.userId, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!shopOwner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ショップが見つかりません
            </h1>
            <p className="text-gray-600">
              指定されたユーザーは存在しないか、削除されました。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 戻るボタン */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
                <span>←</span> 商品一覧
            </button>
        </div>
        {/* ショップヘッダー */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {shopOwner.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {shopOwner.username}'s Store
              </h1>
              <p className="text-gray-600 mt-1">
                {products.length}件の商品を販売中
              </p>
            </div>
          </div>
        </div>

        {/* 商品一覧 */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              まだ商品がありません
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}