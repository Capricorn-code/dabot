'use client';

import { useState } from 'react';
import Link from 'next/link';

// サンプルデータ - 実際にはAPIやローカルストレージから取得
const favoriteStores = [
    {
        id: 'instant',
        name: 'INSTANT',
        nameJa: 'インスタント',
        area: '関東',
        city: '渋谷区',
    },
    {
        id: 'evisen-shop',
        name: 'EVISEN SKATEBOARDS',
        nameJa: 'エビセンスケートボード',
        area: '関東',
        city: '渋谷区',
    }
];

const favoriteBrands = [
    { name: 'BUTTER', nameJa: 'バター' },
    { name: 'DIME', nameJa: 'ダイム' },
    { name: 'EVISEN', nameJa: 'エビセン' },
    { name: 'POLAR', nameJa: 'ポーラー' },
];

const recentlyViewed = [
    {
        type: 'store' as const,
        id: 'ftc-tokyo',
        name: 'FTC TOKYO',
        nameJa: 'エフティーシー東京',
        viewedAt: '2時間前'
    },
    {
        type: 'brand' as const,
        id: 'yardsale',
        name: 'YARDSALE',
        nameJa: 'ヤードセール',
        viewedAt: '3時間前'
    },
    {
        type: 'store' as const,
        id: 'coverage',
        name: 'COVERAGE',
        nameJa: 'カバレッジ',
        viewedAt: '1日前'
    },
];

type Tab = 'favorites' | 'history' | 'settings';

export default function MyPage() {
    const [activeTab, setActiveTab] = useState<Tab>('favorites');

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/dabot" className="text-4xl font-black italic tracking-tight hover:opacity-70 transition-opacity">
                            DABOT
                        </Link>

                        {/* Navigation */}
                        <nav className="flex items-center gap-8">
                            <Link href="/dabot" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                ホーム
                            </Link>
                            <Link href="/dabot/stores" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                店舗一覧
                            </Link>
                            <Link href="/dabot/brands" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                ブランド一覧
                            </Link>
                            <Link href="/dabot/about" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                店舗登録について
                            </Link>
                            <Link href="/dabot/mypage" className="text-sm font-medium border-b-2 border-black">
                                マイページ
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    {/* Page Title */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            MY PAGE
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            あなたのお気に入りと閲覧履歴
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="mb-8 flex gap-2 pb-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                                activeTab === 'favorites'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            お気に入り
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                                activeTab === 'history'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            閲覧履歴
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                                activeTab === 'settings'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            設定
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-12">
                        {/* Favorites Tab */}
                        {activeTab === 'favorites' && (
                            <div className="space-y-8">
                                {/* Favorite Stores */}
                                <section>
                                    <h2 className="text-2xl font-black italic tracking-tight mb-6 flex items-center gap-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        お気に入り店舗
                                    </h2>
                                    {favoriteStores.length > 0 ? (
                                        <div className="grid gap-4">
                                            {favoriteStores.map(store => (
                                                <Link
                                                    key={store.id}
                                                    href={`/dabot/stores/${store.id}`}
                                                    className="group block"
                                                >
                                                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                                                                <span className="text-white text-xs font-black italic">
                                                                    {store.name.substring(0, 3)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-black italic tracking-tight mb-1 group-hover:translate-x-2 transition-transform duration-300">
                                                                    {store.name}
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {store.nameJa} / {store.area} {store.city}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button className="p-2 text-red-500 hover:scale-110 transition-transform">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
                                            <p className="text-gray-500">お気に入り店舗がありません</p>
                                        </div>
                                    )}
                                </section>

                                {/* Favorite Brands */}
                                <section>
                                    <h2 className="text-2xl font-black italic tracking-tight mb-6 flex items-center gap-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        お気に入りブランド
                                    </h2>
                                    {favoriteBrands.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {favoriteBrands.map((brand, index) => (
                                                <Link
                                                    key={brand.name}
                                                    href={`/dabot/brands/${brand.name.toLowerCase()}`}
                                                    className="group relative aspect-square bg-gradient-to-br from-slate-900 to-slate-700 hover:shadow-2xl transition-all duration-500 flex items-center justify-center border border-gray-800 hover:border-gray-600"
                                                >
                                                    <h3 className="relative text-white text-2xl font-black italic tracking-tight text-center px-4 group-hover:scale-110 transition-all duration-500">
                                                        {brand.name}
                                                    </h3>
                                                    <button className="absolute top-2 right-2 p-1 text-red-500 hover:scale-110 transition-transform">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                        </svg>
                                                    </button>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
                                            <p className="text-gray-500">お気に入りブランドがありません</p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {/* History Tab */}
                        {activeTab === 'history' && (
                            <section>
                                <h2 className="text-2xl font-black italic tracking-tight mb-6 flex items-center gap-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    最近見た店舗・ブランド
                                </h2>
                                {recentlyViewed.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentlyViewed.map((item, index) => (
                                            <Link
                                                key={`${item.type}-${item.id}`}
                                                href={`/dabot/${item.type === 'store' ? 'stores' : 'brands'}/${item.id}`}
                                                className="group block"
                                            >
                                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 flex items-center justify-center ${
                                                            item.type === 'store'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-purple-100 text-purple-700'
                                                        }`}>
                                                            {item.type === 'store' ? (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                                    <polyline points="9 22 9 12 15 12 15 22" />
                                                                </svg>
                                                            ) : (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-black italic tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                                                                    {item.name}
                                                                </h3>
                                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1">
                                                                    {item.type === 'store' ? '店舗' : 'ブランド'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{item.nameJa}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{item.viewedAt}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
                                        <p className="text-gray-500">閲覧履歴がありません</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <section>
                                <h2 className="text-2xl font-black italic tracking-tight mb-6 flex items-center gap-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
                                        <path d="M19.07 4.93l-4.24 4.24m-5.66 0L4.93 4.93m14.14 14.14l-4.24-4.24m-5.66 0l-4.24 4.24" />
                                    </svg>
                                    設定
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-6 bg-white border-2 border-gray-200">
                                        <h3 className="font-bold mb-2">通知設定</h3>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" className="w-5 h-5" defaultChecked />
                                            <span className="text-sm text-gray-700">新規店舗の追加を通知する</span>
                                        </label>
                                    </div>

                                    <div className="p-6 bg-white border-2 border-gray-200">
                                        <h3 className="font-bold mb-2">エリア設定</h3>
                                        <select className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none">
                                            <option>関東</option>
                                            <option>関西</option>
                                            <option>中部</option>
                                            <option>九州</option>
                                        </select>
                                    </div>

                                    <div className="p-6 bg-white border-2 border-gray-200">
                                        <h3 className="font-bold mb-2">データ管理</h3>
                                        <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors">
                                            閲覧履歴をクリア
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
