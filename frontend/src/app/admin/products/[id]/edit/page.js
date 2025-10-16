'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../../contexts/AuthContext';
import Header from '../../../../../../components/Header';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock: '',
    status: 'available'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {

    if (!user) {
      return;
    }

    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProduct();
    fetchCategories();
  }, [user, router, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/${params.id}`);
      const data = await response.json();

      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        category_id: data.category_id?.toString() || '',
        image_url: data.image_url || '',
        stock: data.stock?.toString() || '',
        status: data.status || 'available'
      });

      if (data.image_url) {
        setImagePreview(data.image_url);
      }

      setLoading(false);
    } catch (error) {
      console.error('商品取得エラー:', error);
      setError('商品情報の取得に失敗しました');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('カテゴリ取得エラー:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('画像サイズは5MB以下にしてください');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData({
        ...formData,
        image_url: base64String
      });
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/products/${params.id}?token=${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // ...formData,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category_id: parseInt(formData.category_id),
          image_url: formData.image_url,
          stock: parseInt(formData.stock),
          status: formData.status
        })
      });

      if (!response.ok) {
        throw new Error('商品の更新に失敗しました');
      }

      alert('商品を更新しました');
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">商品編集</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* 商品名 */}
          <form onSubmit={handleSubmit}>
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
                required
              />
            </div>

            {/* 商品説明 */}
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
                  min="1"
                  required
                />
              </div>
            </div>

            {/* カテゴリー */}
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

            {/* 商品画像 */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                商品画像
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-1">
                新しい画像を選択しない場合は、現在の画像が維持されます
              </p>

              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">現在の画像:</p>
                  <img
                    src={imagePreview}
                    alt="プレビュー"
                    className="w-48 h-48 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* 在庫 */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                在庫数 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="input-field"
                min="0"
                required
              />
            </div>

            {/* ボタン */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitLoading}
                className="flex-1 btn-primary"
              >
                {submitLoading ? '更新中...' : '更新'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="flex-1 btn-secondary"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}