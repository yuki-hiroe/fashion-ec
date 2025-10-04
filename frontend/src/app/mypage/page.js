'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../../components/Header';
import Link from 'next/link';

export default function MyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/my-products?token=${token}`);

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('商品取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.username}`s Store
            </h1>
            <p className="text-gray-600">
              {user.username}さんの出品商品
            </p>
          </div>
          {/*<Link href="/sell">*/}
          {/*  <button className="btn-primary">*/}
          {/*    商品を出品*/}
          {/*  </button>*/}
          {/*</Link>*/}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">読み込み中...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-6">
              まだ商品を出品していません
            </p>
            {/*<Link href="/sell">*/}
            {/*  <button className="btn-primary">*/}
            {/*    最初の商品を出品*/}
            {/*  </button>*/}
            {/*</Link>*/}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link href={`/products/${product.id}`}>
                  <img
                    src={product.image_url || 'https://picsum.photos/400/500'}
                    alt={product.name}
                    className="w-full aspect-[4/5] object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-xl font-bold mb-3">
                    ¥{product.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.status === 'available' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.status === 'available' ? '販売中' : '売却済み'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}