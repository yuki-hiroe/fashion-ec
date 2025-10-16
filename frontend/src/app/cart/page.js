'use client';

import {useCart} from '../../../contexts/CartContext';
import {useRouter} from 'next/navigation';
import Header from '../../../components/Header';
import Link from 'next/link';

export default function CartPage() {
    const router = useRouter();
    const {cart, removeFromCart, updateQuantity, clearCart, getTotalPrice} = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header/>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            カートが空です
                        </h1>
                        <p className="text-gray-600 mb-8">
                            商品を追加してください
                        </p>
                        <Link href="/">
                            <button
                                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                                買い物を続ける
                            </button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header/>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    ショッピングカート
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* カート商品リスト */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-6 border-b last:border-b-0"
                                >
                                    {/* 商品画像 */}
                                    <Link href={`/products/${item.id}`}>
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                                        />
                                    </Link>

                                    {/* 商品情報 */}
                                    <div className="flex-1">
                                        <Link href={`/products/${item.id}`}>
                                            <h3 className="font-semibold text-lg hover:text-gray-600 cursor-pointer">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {item.description}
                                        </p>
                                        <p className="text-lg font-bold mt-2">
                                            ¥{item.price.toLocaleString()}
                                        </p>

                                        {/* 数量変更 */}
                                        <div className="flex items-center gap-4 mt-4 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                                                >
                                                    −
                                                </button>
                                                <span className="w-12 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                                                >
                                                    ＋
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (confirm('カートから削除しますか？')) {
                                                        removeFromCart(item.id);
                                                    }
                                                }}
                                                className="text-red-600 cursor-pointer hover:text-red-700 text-sm ml-4"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>

                                    {/* 小計 */}
                                    <div className="text-right">
                                        <p className="text-lg font-bold">
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
                        <h2 className="text-xl font-bold mb-4">注文サマリー</h2>
                    
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between">
                            <span className="text-gray-600">小計</span>
                            <span className="font-semibold">
                              ¥{getTotalPrice().toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">送料</span>
                            <span className="font-semibold text-gray-600">0</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between text-lg font-bold">
                            <span>合計</span>
                            <span>¥{getTotalPrice().toLocaleString()}</span>
                          </div>
                        </div>
                    
                        <Link href="/checkout" className="block mb-3">
                          <button className="w-full bg-black text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-gray-800 transition-colors">
                            購入手続きへ
                          </button>
                        </Link>
                    
                        <Link href="/" className="block mb-4">
                          <button className="w-full border border-gray-300 py-3 rounded-lg font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
                            買い物を続ける
                          </button>
                        </Link>
                    
                        <button
                          onClick={() => {
                            if (confirm('カートを空にしますか？')) {
                              clearCart();
                            }
                          }}
                          className="w-full text-red-600 cursor-pointer hover:text-red-700 text-sm font-semibold"
                        >
                          カートを空にする
                        </button>
                      </div>
                    </div>
                </div>
            </main>
        </div>
    );
}