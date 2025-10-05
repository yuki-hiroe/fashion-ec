// 注文完了ページ
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../../components/Header';

export default function OrderCompletePage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/orders/${params.id}?token=${token}`
        );

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('注文情報の取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ご注文ありがとうございます
            </h1>
            <p className="text-gray-600">
              注文が正常に完了しました
            </p>
          </div>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-lg font-bold mb-4">注文情報</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">注文番号</span>
                  <span className="font-semibold">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">お名前</span>
                  <span>{order.shipping_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">電話番号</span>
                  <span>{order.shipping_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">配送先</span>
                  <span>{order.shipping_address}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>合計金額</span>
                  <span>¥{order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/" className="block">
              <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                トップページに戻る
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}