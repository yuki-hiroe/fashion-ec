'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../../components/Header';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // products, users, orders

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

    // 管理者でない場合
    if (user.role !== 'admin') {
      router.push('/mypage');
      return;
    }

    // 管理者の場合、データ取得
    fetchUsers();
  }, [user, authLoading, router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`  // ヘッダーで送信
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
      setDataLoading(false);
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
      setDataLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('このユーザーを削除しますか？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/users/${userId}?token=${token}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`  // ヘッダーで送信
        }
      });

      if (response.ok) {
        alert('ユーザーを削除しました');
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (error) {
      alert('削除に失敗しました');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  // ログインしていないか管理者でない場合
  if (!user || user.role !== 'admin') {
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              管理者画面
            </h1>
            <p className="text-gray-600">ユーザー管理</p>
          </div>
        </div>

        {/* デスクトップ用テーブル */}
         <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ユーザー名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  メールアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  権限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {u.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/shop/${u.id}`} className="text-blue-600 hover:text-blue-900">
                      {u.username}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {u.role === 'admin' ? '管理者' : '一般'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/admin/users/${u.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                      編集
                    </Link>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={u.role === 'admin'}
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
          {users.map((u) => (
            <div key={u.id} className="bg-white border rounded-lg p-4 shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Link href={`/shop/${u.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                      {u.username}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <p className="text-xs text-gray-400 mt-1">ID: {u.id}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {u.role === 'admin' ? '管理者' : '一般'}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <Link href={`/admin/users/${u.id}/edit`} className="flex-1 text-blue-600 text-white hover:text-blue-900 mr-4">
                    <button className="w-full text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                      編集
                    </button>
                </Link>
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  className="flex-1 text-sm bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={u.role === 'admin'}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}