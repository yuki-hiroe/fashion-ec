'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../../components/Header';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address1: '',
    address2: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // ユーザー認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // カートが空の場合
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              カートが空です
            </h1>
            <Link href="/">
              <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800">
                買い物を続ける
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const totalAmount = getTotalPrice();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 確認アラート
    if (!confirm('注文を確定してもよろしいですか？')) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('ログインしてください');
      }

      // 住所を結合
      const fullAddress = `〒${shippingInfo.postalCode} ${shippingInfo.prefecture}${shippingInfo.city}${shippingInfo.address1}${shippingInfo.address2 ? ' ' + shippingInfo.address2 : ''}`;

      const orderData = {
        shipping_name: shippingInfo.name,
        shipping_phone: shippingInfo.phone,
        shipping_address: fullAddress,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch(`${API_URL}/api/orders?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '注文に失敗しました');
      }

      const result = await response.json();

      // カートをクリア
      clearCart();

      // 注文完了ページへ
      router.push(`/order-complete/${result.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          注文確認
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 配送先情報入力 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">配送先情報</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* お名前 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="山田 太郎"
                    required
                  />
                </div>

                {/* 電話番号 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="090-1234-5678"
                    required
                  />
                </div>

                {/* 郵便番号 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    郵便番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="123-4567"
                    pattern="\d{3}-?\d{4}"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">ハイフンありでもなしでも可</p>
                </div>

                {/* 都道府県 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    都道府県 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={shippingInfo.prefecture}
                    onChange={(e) => setShippingInfo({...shippingInfo, prefecture: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="北海道">北海道</option>
                    <option value="青森県">青森県</option>
                    <option value="岩手県">岩手県</option>
                    <option value="宮城県">宮城県</option>
                    <option value="秋田県">秋田県</option>
                    <option value="山形県">山形県</option>
                    <option value="福島県">福島県</option>
                    <option value="茨城県">茨城県</option>
                    <option value="栃木県">栃木県</option>
                    <option value="群馬県">群馬県</option>
                    <option value="埼玉県">埼玉県</option>
                    <option value="千葉県">千葉県</option>
                    <option value="東京都">東京都</option>
                    <option value="神奈川県">神奈川県</option>
                    <option value="新潟県">新潟県</option>
                    <option value="富山県">富山県</option>
                    <option value="石川県">石川県</option>
                    <option value="福井県">福井県</option>
                    <option value="山梨県">山梨県</option>
                    <option value="長野県">長野県</option>
                    <option value="岐阜県">岐阜県</option>
                    <option value="静岡県">静岡県</option>
                    <option value="愛知県">愛知県</option>
                    <option value="三重県">三重県</option>
                    <option value="滋賀県">滋賀県</option>
                    <option value="京都府">京都府</option>
                    <option value="大阪府">大阪府</option>
                    <option value="兵庫県">兵庫県</option>
                    <option value="奈良県">奈良県</option>
                    <option value="和歌山県">和歌山県</option>
                    <option value="鳥取県">鳥取県</option>
                    <option value="島根県">島根県</option>
                    <option value="岡山県">岡山県</option>
                    <option value="広島県">広島県</option>
                    <option value="山口県">山口県</option>
                    <option value="徳島県">徳島県</option>
                    <option value="香川県">香川県</option>
                    <option value="愛媛県">愛媛県</option>
                    <option value="高知県">高知県</option>
                    <option value="福岡県">福岡県</option>
                    <option value="佐賀県">佐賀県</option>
                    <option value="長崎県">長崎県</option>
                    <option value="熊本県">熊本県</option>
                    <option value="大分県">大分県</option>
                    <option value="宮崎県">宮崎県</option>
                    <option value="鹿児島県">鹿児島県</option>
                    <option value="沖縄県">沖縄県</option>
                  </select>
                </div>

                {/* 市区町村 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    市区町村 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="渋谷区"
                    required
                  />
                </div>

                {/* 番地 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    番地 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address1}
                    onChange={(e) => setShippingInfo({...shippingInfo, address1: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="代々木1-2-3"
                    required
                  />
                </div>

                {/* 建物名・部屋番号（任意） */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    建物名・部屋番号
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address2}
                    onChange={(e) => setShippingInfo({...shippingInfo, address2: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="〇〇マンション101号室"
                  />
                </div>
              </form>
            </div>

            {/* 注文商品一覧 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">注文内容</h2>

              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
                  <img
                    src={item.image_url || '/images/default.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      ¥{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 注文サマリー */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">お支払い金額</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">小計</span>
                  <span className="font-semibold">
                    ¥{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">送料</span>
                  <span className="font-semibold text-gray-600">0</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>合計</span>
                  <span>¥{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors disabled:bg-gray-400 mb-3"
              >
                {loading ? '注文中...' : '注文を確定する'}
              </button>

              <Link href="/cart" className="block">
                <button className="w-full border border-gray-300 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  カートに戻る
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}