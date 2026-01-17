'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// 店舗データの型定義
type Store = {
    id: string;
    name: string;
    nameJa: string;
    area: string;
    prefecture: string;
    city: string;
    address: string;
    brands: string[];
    description: string;
    openYear?: number | null;
};

type SortOption = 'name-asc' | 'name-desc' | 'area' | 'brands-desc' | 'year-desc';

export default function StoresPage() {
    const searchParams = useSearchParams();
    const keywordParam = searchParams.get('keyword') || '';

    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');
    const [selectedArea, setSelectedArea] = useState<string>('all');
    const [keyword, setKeyword] = useState(keywordParam);

    // 店舗データを取得
    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/stores');

                if (!response.ok) {
                    throw new Error('Failed to fetch stores');
                }

                const data = await response.json();
                setStores(data.stores || []);
            } catch (err) {
                console.error('Error fetching stores:', err);
                setError('店舗データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    // エリアのリストを取得
    const areas = useMemo(() => {
        const areaSet = new Set(stores.map(store => store.area));
        return ['all', ...Array.from(areaSet)];
    }, [stores]);

    // フィルタリングとソート
    const filteredAndSortedStores = useMemo(() => {
        // キーワードでフィルタリング
        let filtered = [...stores];

        if (keyword.trim()) {
            const lowerKeyword = keyword.toLowerCase();
            filtered = filtered.filter((store) => {
                return (
                    store.name?.toLowerCase().includes(lowerKeyword) ||
                    store.nameJa?.toLowerCase().includes(lowerKeyword) ||
                    store.prefecture?.toLowerCase().includes(lowerKeyword) ||
                    store.city?.toLowerCase().includes(lowerKeyword) ||
                    store.address?.toLowerCase().includes(lowerKeyword) ||
                    store.description?.toLowerCase().includes(lowerKeyword)
                );
            });
        }

        // エリアでフィルタリング
        if (selectedArea !== 'all') {
            filtered = filtered.filter(store => store.area === selectedArea);
        }

        // ソート
        switch (sortOption) {
            case 'name-asc':
                return filtered.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return filtered.sort((a, b) => b.name.localeCompare(a.name));
            case 'area':
                return filtered.sort((a, b) => {
                    if (a.area !== b.area) return a.area.localeCompare(b.area, 'ja');
                    return a.name.localeCompare(b.name);
                });
            case 'brands-desc':
                return filtered.sort((a, b) => (b.brands?.length || 0) - (a.brands?.length || 0));
            case 'year-desc':
                return filtered.sort((a, b) => (b.openYear || 0) - (a.openYear || 0));
            default:
                return filtered;
        }
    }, [stores, sortOption, selectedArea, keyword]);

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
                            <Link href="/dabot/stores" className="text-sm font-medium border-b-2 border-black">
                                店舗一覧
                            </Link>
                            <Link href="/dabot/brands" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                ブランド一覧
                            </Link>
                            <Link href="/dabot/about" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                店舗登録について
                            </Link>
                            <Link href="/dabot/mypage" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                マイページ
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    {/* Page Title */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            STORES
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            取扱店舗一覧 ({filteredAndSortedStores.length}店舗)
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="キーワードで検索..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                        />
                    </div>

                    {/* Filters and Sort */}
                    <div className="mb-8 space-y-4 pb-6 border-b border-gray-200">
                        {/* Area Filter */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700 w-20">エリア:</span>
                            <div className="flex flex-wrap gap-2">
                                {areas.map(area => (
                                    <button
                                        key={area}
                                        onClick={() => setSelectedArea(area)}
                                        className={`px-4 py-2 text-sm font-medium transition-colors ${selectedArea === area
                                                ? 'bg-black text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {area === 'all' ? 'すべて' : area}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700 w-20">並び替え:</span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSortOption('name-asc')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'name-asc'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    名前 A-Z
                                </button>
                                <button
                                    onClick={() => setSortOption('name-desc')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'name-desc'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    名前 Z-A
                                </button>
                                <button
                                    onClick={() => setSortOption('area')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'area'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    エリア順
                                </button>
                                <button
                                    onClick={() => setSortOption('brands-desc')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'brands-desc'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    取扱ブランド数
                                </button>
                                <button
                                    onClick={() => setSortOption('year-desc')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'year-desc'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    創業年順
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">読み込み中...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-20">
                            <p className="text-red-500 text-lg">{error}</p>
                        </div>
                    )}

                    {/* Store List */}
                    {!loading && !error && (
                        <div className="space-y-6">
                            {filteredAndSortedStores.map((store, index) => (
                                <Link
                                    key={store.id}
                                    href={`/dabot/stores/${store.id}`}
                                    className="group block"
                                    style={{
                                        animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                                    }}
                                >
                                    <div className="relative p-6 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-500">
                                        {/* Store Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-3 mb-2">
                                                    <h2 className="text-3xl font-black italic tracking-tight group-hover:translate-x-2 group-hover:text-gray-900 transition-all duration-300">
                                                        {store.name}
                                                    </h2>
                                                    <span className="text-sm text-gray-600">{store.nameJa}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                            <circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                        {store.prefecture} {store.city}
                                                    </span>
                                                    {store.openYear && (
                                                        <span className="text-gray-500">
                                                            創業 {store.openYear}年
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Area Badge */}
                                            <div className="flex-shrink-0 ml-4">
                                                <span className="inline-block px-3 py-1 bg-black text-white text-xs font-medium">
                                                    {store.area}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 mb-4">
                                            {store.description}
                                        </p>

                                        {/* Address */}
                                        <p className="text-xs text-gray-500 mb-4">
                                            📍 {store.address}
                                        </p>

                                        {/* Brands */}
                                        {store.brands && store.brands.length > 0 && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs font-medium text-gray-700">
                                                    取扱ブランド:
                                                </span>
                                                {store.brands.map(brand => (
                                                    <span
                                                        key={brand}
                                                        className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium text-gray-700 group-hover:bg-gray-200 transition-colors"
                                                    >
                                                        {brand}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Arrow Icon */}
                                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="transform group-hover:translate-x-2 transition-transform duration-300"
                                            >
                                                <path
                                                    d="M5 12H19M19 12L12 5M19 12L12 19"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && !error && filteredAndSortedStores.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">
                                該当する店舗が見つかりませんでした
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Animation Keyframes */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
