'use client';

import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useState} from 'react';
import {useCart} from '../contexts/CartContext';
import {useAuth} from '../contexts/AuthContext';

function HeaderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');
    const currentPrice = searchParams.get('price');
    const {getTotalItems} = useCart();
    const {user, logout} = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const categories = [
        {slug: null, name: 'すべて'},
        {slug: 'tops', name: 'トップス'},
        {slug: 'outerwear', name: 'アウター'},
        {slug: 'hoodies', name: 'パーカー'},
        {slug: 'pants', name: 'パンツ'},
        {slug: 'skirts', name: 'スカート'},
        {slug: 'shoes', name: 'シューズ'},
        {slug: 'accessories', name: 'アクセサリー'},
        {slug: 'other', name: 'その他'},
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
        setMobileMenuOpen(false);
    };

    const handlePriceClick = (value) => {
        const params = new URLSearchParams();
        if (currentCategory) params.set('category', currentCategory);
        if (value !== null) params.set('price', value);

        const queryString = params.toString();
        router.push(queryString ? `/?${queryString}` : '/');
        setMobileMenuOpen(false);
    };

    return (
        // headerタグのクラス名を変更
        <header className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                {/* トップバー */}
                <div className="flex justify-between items-center mb-3">
                    {/* ログインユーザーがadminでなければ、トップページへのリンク */}
                    { user?.role !== 'admin' ? (
                        <Link href="/">
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 cursor-pointer hover:scale-105 transition-transform">
                                TRADERS
                            </h1>
                        </Link>
                    ) : (
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            TRADERS
                        </h1>
                    )}

                    <div className="flex items-center gap-4">
                        {/* カートアイコン */}
                        {/* ログインユーザーがadminでなければ、カートアイコン */}
                        { user?.role !== 'admin' && (
                            <Link href="/cart">
                                <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
                                    <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                    {getTotalItems() > 0 && (
                                        <span
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
                                            {getTotalItems()}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        )}

                        {/* ハンバーガーメニューボタン（モバイル） */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2"
                            aria-label="メニュー"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                )}
                            </svg>
                        </button>

                        {/* デスクトップメニュー */}
                        <div className="hidden lg:flex items-center gap-3">
                          {user ? (
                            <>
                              {user?.role === 'admin' ? (
                                // 管理者用メニュー
                                <>
                                    <Link href="/admin">
                                        <button className="text-sm bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold ">
                                          管理者画面
                                        </button>
                                    </Link>
                                    <span className="text-sm text-gray-700 font-semibold">
                                    {user.username}さん
                                    </span>
                                    <button onClick={logout} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 font-medium">
                                    ログアウト
                                    </button>
                                </>
                              ) : (
                                // 一般ユーザー用メニュー
                                <>
                                  <Link href="/mypage">
                                    <button className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 font-semibold">
                                      マイページ
                                    </button>
                                  </Link>
                                  <span className="text-sm text-gray-700 font-semibold">
                                    {user.username}さん
                                  </span>
                                  <button onClick={logout} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 font-medium">
                                    ログアウト
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <Link href="/login">
                              <button className="text-sm bg-gray-100 cursor-pointer hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold transition-colors">
                                ログイン
                              </button>
                            </Link>
                          )}
                        </div>
                    </div>
                </div>

                {/* デスクトップ版カテゴリ・価格フィルター */}
                <div className="hidden lg:block">
                    {/* 管理者の場合は表示しない */}
                    { user?.role !== 'admin' && (
                        <nav className="flex gap-3 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                            {categories.map((category, index) => {
                                const isActive = currentCategory === category.slug;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleCategoryClick(category.slug)}
                                        className={`px-6 py-2.5 rounded-full whitespace-nowrap font-semibold transition-all duration-300 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </nav>
                    )}
                    { user?.role !== 'admin' && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {priceRanges.map((range, index) => {
                                const isActive = currentPrice === range.value;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handlePriceClick(range.value)}
                                        className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-md scale-105'
                                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:scale-105'
                                        }`}
                                    >
                                        {range.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* モバイルメニュー */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 max-h-[70vh] overflow-y-auto">
                    {/* ユーザーメニュー */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      {user ? (
                        <div className="space-y-3">
                          <div className="w-full text-right text-sm font-semibold text-gray-700">
                            {user.username}さん
                          </div>
                          {user?.role === 'admin' ? (
                            // 管理者用
                            <div className="flex justify-end" onClick={() => setMobileMenuOpen(false)}>
                                <Link href="/admin">
                                    <button className="text-sm bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold ">
                                      管理者画面
                                    </button>
                                </Link>
                            </div>
                          ) : (
                            // 一般ユーザー用
                            <Link href="/mypage" onClick={() => setMobileMenuOpen(false)}>
                              <button className="w-full text-right text-sm text-gray-700 cursor-pointer hover:text-gray-900 font-semibold px-4 py-2">
                                マイページ
                              </button>
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              logout();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full text-right text-sm text-gray-600 cursor-pointer hover:text-gray-900 px-4 py-2"
                          >
                            ログアウト
                          </button>
                        </div>
                      ) : (
                        <div className='flex justify-end' onClick={() => setMobileMenuOpen(false)}>
                            <Link href="/login">
                                <button className="text-sm bg-gray-100 cursor-pointer hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold transition-colors">
                                ログイン
                                </button>
                            </Link>
                        </div>
                      )}
                    </div>

                    {/* カテゴリ */}
                    {/* 管理者の場合は表示しない */}
                    { user?.role !== 'admin' && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">カテゴリ</h3>
                            <div className="space-y-2">
                                {categories.map((category, index) => {
                                    const isActive = currentCategory === category.slug;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleCategoryClick(category.slug)}
                                            className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 価格フィルター */}
                    {/* 管理者の場合は表示しない */}
                    { user?.role !== 'admin' && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">価格</h3>
                            <div className="space-y-2">
                                {priceRanges.map((range, index) => {
                                    const isActive = currentPrice === range.value;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handlePriceClick(range.value)}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                                isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
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