'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Header from '../../../../../components/Header';
import Link from 'next/link';

export default function SellPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ログインしていない場合
  if (!user) {
    router.push('/login');
    return null;
  }

  // カテゴリ取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('カテゴリ取得エラー:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('ログインしてください');
      }

      const response = await fetch(`http://localhost:8000/api/products?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          category_id: parseInt(formData.category_id)
        })
      });

      if (!response.ok) {
        throw new Error('商品詳細の編集に失敗しました');
      }

      const result = await response.json();
      alert('商品詳細を編集しました！');
      router.push(`/products/${result.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">商品詳細を編集</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 商品名 */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                商品名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="例: ベーシックTシャツ"
                required
              />
            </div>

            {/* 説明 */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                商品説明
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="商品の状態やサイズ感など"
              />
            </div>

            {/* 価格 */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                価格 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-600">¥</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field pl-8"
                  placeholder="2980"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* カテゴリ */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                カテゴリ <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">カテゴリを選択</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 画像URL */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                画像URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                画像のURLを入力してください
              </p>
            </div>

            {/* ボタン */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:bg-gray-400"
              >
                {loading ? '出品中...' : '出品する'}
              </button>
              <Link href="/mypage" className="flex-1">
                <button
                  type="button"
                  className="w-full btn-secondary"
                >
                  キャンセル
                </button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}