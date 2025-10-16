// 商品詳細ページ
'use client';

import {useState, useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useCart} from '../../../../contexts/CartContext';
import Header from "../../../../components/Header";
import {useAuth} from "../../../../contexts/AuthContext";
import Link from 'next/link';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const {addToCart} = useCart();
    const [product, setProduct] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const {user} = useAuth();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`${API_URL}/api/products/${params.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error('商品が見つかりませんでした');
                }

                const data = await response.json();
                console.log('商品詳細:', data);
                setProduct(data);
            } catch (error) {
                console.error('エラー:', error);
                setError(error.message);
            } finally {
                setDataLoading(false);
            }
        }

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`「${product.name}」を${quantity}個カートに追加しました！`);
        // カートページに遷移するかどうか選択できるようにする
        const goToCart = confirm('カートページに移動しますか？');
        if (goToCart) {
            router.push('../../cart');
        } else {
            router.push('/')
        }
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    if (dataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">読み込み中...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">{error || '商品が見つかりません'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-black text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-800"
                    >
                        トップページに戻る
                    </button>
                </div>
            </div>
        );
    }

    const handleDelete = async () => {
        // 削除確認ダイアログを表示する
        if (!confirm('本当にこの商品を削除しますか？')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/products/${product.id}?token=${token}`,
                {
                    method: 'DELETE'
                }
            );

            if (response.ok) {
                alert('商品を削除しました');
                router.push('/mypage');
            } else {
                throw new Error('削除に失敗しました');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <Header/>

            {/* 戻るボタン */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <span>←</span> 商品一覧
                </button>

                {product.seller && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => router.push(`/shop/${product.seller.id}`)}
                      className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    >
                      <span>←</span> {product.seller.username}'s Store
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* 商品画像 */}
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                              src={product.image_url || '/images/sold_out.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* 商品情報 */}
                        <div className="flex flex-col">
                            {/* 出品者情報 */}
                            {product.seller && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">出品者</h3>
                                    <p className="text-lg font-semibold">{product.seller.username}</p>
                                </div>
                            )}

                            {/* カテゴリ */}
                            {product.category && (
                                <span className="text-sm text-gray-500 mb-2">
                            {product.category.name}
                                </span>
                            )}

                            {/* 商品名 */}
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h2>

                            {/* 価格 */}
                            <div className="text-4xl font-bold text-gray-900 mb-6">
                                ¥{product.price.toLocaleString()}
                            </div>

                            {/* 説明 */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">商品説明</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description || '商品説明はありません'}
                                </p>
                            </div>

                            {/* 在庫状況 */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">在庫:</span>
                                    {product.status === 'sold' ? (
                                      <span className="text-red-600 font-semibold">
                                        売り切れ
                                      </span>
                                    ) : product.stock > 0 ? (
                                      <span className="text-green-600 font-semibold">
                                        {product.stock}個 在庫あり
                                      </span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">
                                          在庫切れ
                                        </span>
                                    )}
                                </div>
                            </div>


                            {/* 数量選択 */}
                            {product.status !== 'sold' && product.status !== 'deleted' && product.stock > 0 && (
                              <div className="mb-6">
                                <label className="text-sm font-semibold mb-2 block">数量</label>
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    −
                                  </button>
                                  <span className="text-xl font-semibold w-12 text-center">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stock}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    ＋
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* カートに追加ボタン */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || product.status === 'sold' || product.status === 'deleted'}
                                className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg cursor-pointer hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {product.status === 'sold' ? '売り切れ' :
                                    product.status === 'deleted' ? '販売終了' :
                                        product.stock > 0 ? 'カートに追加' : '在庫切れ'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}