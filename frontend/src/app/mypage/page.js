'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../../components/Header';
import Link from 'next/link';

export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // ユーザー認証チェック
  useEffect(() => {
    // 認証チェックが完了していない場合は待つ
    if (authLoading) {
      return;
    }
    // ログインしていない場合
    if (!user) {
      router.push('/login');
      return;
    }

    // ログインしている場合、商品取得
    fetchMyProducts();
  }, [user, authLoading, router]);

  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/my-products?token=${token}`);

      if (response.ok) {
        const data = await response.json();
        const activeProducts = data.filter(p => p.status !== 'deleted');
        setProducts(activeProducts);
      }
    } catch (error) {
      console.error('商品取得エラー:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
  if (!confirm('この商品を削除しますか？')) {
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/api/products/${productId}?token=${token}`,
      { method: 'DELETE' }
    );

    if (response.ok) {
      alert('商品を削除しました');
      // 商品リストから削除
      setProducts(products.filter(p => p.id !== productId));
    } else {
      throw new Error('削除に失敗しました');
    }
  } catch (error) {
    alert(error.message);
  }
};

  //認証チェック中
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">認証中...</div>
      </div>
    );
  }

  // ログインしていない場合
  if (!user) {
    return null;
  }

  // データ読み込み中
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl">データ読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ヘッダー */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link href={`/shop/${user.id}`}>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.username}'s Store
              </h1>
            </Link>
            <p className="text-gray-600">
              {user.username}さんの出品商品
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <button className="btn-secondary">
                商品を探す
              </button>
            </Link>
            <Link href="/mypage/products/new">
              <button className="btn-primary">
                新規出品
              </button>
            </Link>
          </div>
        </div>

        {/* 商品一覧 */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-6">
              まだ商品を出品していません
            </p>
            <Link href="/mypage/products/new">
              <button className="btn-primary">
                最初の商品を出品
              </button>
            </Link>
          </div>
        ) : (
           <>
            {/* デスクトップ用テーブル */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      商品
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      価格
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      在庫
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      状態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.image_url || '/images/default.jpg'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <div className="font-semibold text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ¥{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.stock}個
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'sold'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status === 'available' ? '販売中' :
                           product.status === 'sold' ? '売却済み' :
                           product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/mypage/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* モバイル用カード */}
            <div className="lg:hidden space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white border rounded-lg p-4 shadow">
                  <div className="flex gap-4">
                    <img
                      src={product.image_url || '/images/default.jpg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500">ID: {product.id}</p>
                      <p className="text-lg font-bold mt-1">¥{product.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-600">在庫: {product.stock}個</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status === 'available' ? '販売中' : '売却済み'}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/mypage/products/${product.id}/edit`} className="flex-1 text-blue-600 hover:text-blue-900 mr-4">
                          <button className="w-full text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                            編集
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 text-sm bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}