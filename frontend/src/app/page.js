'use client';

import {useState, useEffect, Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';

function HomePageContent() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const priceFilter = searchParams.get('price');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/products`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error('商品データの取得に失敗しました');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('取得エラー:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [category, priceFilter]);

    // カテゴリと価格でフィルタリング
    const filteredProducts = products.filter(product => {
        // カテゴリフィルター
        if (category && product.category?.slug !== category) {
            return false;
        }

        // 価格フィルター
        if (priceFilter) {
            const maxPrice = parseInt(priceFilter);
            if (product.price > maxPrice) {
                return false;
            }
        }

        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">読み込み中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">
                    <p>エラー: {error}</p>
                    <p className="text-sm mt-2">バックエンドが起動しているか確認してください</p>
                </div>
            </div>
        );
    }

    // フィルター状態の表示文言
    const getFilterDescription = () => {
        const parts = [];

        if (category) {
            parts.push(`${getCategoryName(category)}`);
        }

        if (priceFilter) {
            parts.push(`¥${parseInt(priceFilter).toLocaleString()}以下`);
        }

        if (parts.length === 0) {
            return '新着アイテム';
        }

        return parts.join(' / ');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header/>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* ヒーローセクション */}
                <div className="mb-12">
                    <h2 className="text-4xl font-black text-gray-900 mb-3">
                        {getFilterDescription()}
                    </h2>
                    <div className="flex items-center gap-4">
                        <p className="text-gray-600 text-lg">
                            {filteredProducts.length}件の商品
                        </p>
                        {(category || priceFilter) && (
                            <button
                                onClick={() => window.location.href = '/'}
                                className="text-sm text-blue-600 hover:text-blue-700 underline font-semibold"
                            >
                                フィルターをリセット
                            </button>
                        )}
                    </div>
                </div>

                {/* 商品グリッド */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div>

                {/* 商品がない場合 */}
                {filteredProducts.length === 0 && !loading && !error && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">😢</div>
                        <p className="text-gray-500 text-xl mb-6">
                            条件に一致する商品がありません
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="btn-primary"
                        >
                            フィルターをリセット
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

// カテゴリ名取得用のヘルパー関数
function getCategoryName(slug) {
    const categories = {
        'tops': 'トップス',
        'bottoms': 'ボトムス',
        'outerwear': 'アウター',
        'accessories': 'アクセサリー',
    };
    return categories[slug] || 'カテゴリ';
}

// Suspenseでラップしたメインエクスポート
export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
            <div className="text-xl">読み込み中...</div>
        </div>}>
            <HomePageContent/>
        </Suspense>
    );
}