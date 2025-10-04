'use client';

import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense} from 'react';
import {useCart} from '../contexts/CartContext';
import {useAuth} from '../contexts/AuthContext';

function HeaderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');
    const currentPrice = searchParams.get('price');
    const {getTotalItems} = useCart();
    const {user, logout} = useAuth();

    const categories = [
        {slug: null, name: 'すべて'},
        {slug: 'tops', name: 'トップス'},
        {slug: 'bottoms', name: 'ボトムス'},
        {slug: 'outerwear', name: 'アウター'},
        {slug: 'accessories', name: 'アクセサリー'},
    ];

    const priceRanges = [
        {value: null, label: '価格指定なし'},
        {value: '3000', label: '¥3,000以下'},
        {value: '5000', label: '¥5,000以下'},
        {value: '10000', label: '¥10,000以下'},
    ];

    const handleCategoryClick = (slug) => {
        const params = new URLSearchParams();
        if (slug !== null) params.set('category', slug);
        if (currentPrice) params.set('price', currentPrice);

        const queryString = params.toString();
        router.push(queryString ? `/?${queryString}` : '/');
    };

    const handlePriceClick = (value) => {
        const params = new URLSearchParams();
        if (currentCategory) params.set('category', currentCategory);
        if (value !== null) params.set('price', value);

        const queryString = params.toString();
        router.push(queryString ? `/?${queryString}` : '/');
    };

    return (
        // headerタグのクラス名を変更
        <header className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex justify-between items-center mb-3">
                  <Link href="/">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 cursor-pointer hover:scale-105 transition-transform">
                      FASHION EC
                    </h1>
                  </Link>

                  <div className="flex items-center gap-4">
                    {/* ユーザー情報 */}
                    {user ? (
                      <div className="flex items-center gap-3">
                        {/* 管理者の場合 */}
                        {user.role === 'admin' ? (
                          <Link href="/admin">
                            <button className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all">
                              管理者画面
                            </button>
                          </Link>
                        ) : (
                          // 一般ユーザーの場合は出品ボタンを非表示
                          null
                        )}

                        <Link href="/mypage">
                          <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold">
                            マイページ
                          </button>
                        </Link>

                        <span className="text-sm text-gray-700 font-semibold">
                          {user.username}さん
                        </span>

                        <button
                          onClick={logout}
                          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                        >
                          ログアウト
                        </button>
                      </div>
                    ) : (
                      <Link href="/login">
                        <button className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold transition-colors">
                          ログイン
                        </button>
                      </Link>
                    )}

                    {/* カートアイコン */}
                    <Link href="/cart">
                      <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {getTotalItems() > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {getTotalItems()}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
            </div>
        </header>
    );
}

export default function Header() {
    return (
        <Suspense fallback={<div className="h-40 bg-white"></div>}>
            <HeaderContent/>
        </Suspense>
    );
}