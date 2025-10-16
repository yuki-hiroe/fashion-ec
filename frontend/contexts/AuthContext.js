// 認証用のContextを作成
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // ページ読み込み時にトークンをチェック
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

    const login = async (username, password) => {
      try {
        const formBody = new URLSearchParams();
        formBody.append('username', username);
        formBody.append('password', password);

        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString(),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.access_token);

          setUser({
            username: data.username,
            role: data.role,
            id: data.user_id
          });

          return {
            success: true,
            role: data.role  // roleを返す
          };
        } else {
          const errorData = await response.json();
          return {
            success: false,
            error: errorData.detail || 'ログインに失敗しました'
          };
        }
      } catch (error) {
        return {
          success: false,
          error: 'ログインに失敗しました'
        };
      }
  };

  const register = async (email, username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || '登録に失敗しました');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}