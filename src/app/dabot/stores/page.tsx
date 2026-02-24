'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import type { Schema } from '@/amplify/data/resource';

type Store = Schema['Stores']['type'];

type SortOption = 'name-asc' | 'name-desc' | 'area' | 'brands-desc' | 'review-desc';

export default function StoresPage() {
    return (
        <Suspense fallback={<StoresPageLoading />}>
            <StoresPageContent />
        </Suspense>
    );
}

function StoresPageLoading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <p className="text-gray-500 text-lg">読み込み中...</p>
        </div>
    );
}

function StarButton({ storeId, favoriteIds, userId }: {
    storeId: string;
    favoriteIds: Set<string>;
    userId: string | null;
}) {
    const [isFav, setIsFav] = useState(favoriteIds.has(storeId));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsFav(favoriteIds.has(storeId));
    }, [favoriteIds, storeId]);

    const toggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        try {
            if (isFav && userId) {
                const res = await fetch('/api/favorites', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, target_type: 'store', target_id: storeId }),
                });
                if (res.ok) setIsFav(false);
            } else {
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ target_type: 'store', target_id: storeId }),
                });
                if (res.ok) setIsFav(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={`p-2 transition-all duration-200 hover:scale-125 ${loading ? 'opacity-50' : ''}`}
            aria-label={isFav ? 'お気に入りから削除' : 'お気に入りに追加'}
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isFav ? '#facc15' : 'none'} stroke={isFav ? '#facc15' : '#9ca3af'} strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </button>
    );
}

function StoresPageContent() {
    const searchParams = useSearchParams();
    const keywordParam = searchParams.get('keyword') || '';

    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');
    const [selectedArea, setSelectedArea] = useState<string>('all');
    const [keyword, setKeyword] = useState(keywordParam);
    const [favStoreIds, setFavStoreIds] = useState<Set<string>>(new Set());
    const [favUserId, setFavUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/stores');
                if (!response.ok) throw new Error('Failed to fetch stores');
                const data = await response.json();
                setStores(data.stores || []);
            } catch (err) {
                console.error('Error fetching stores:', err);
                setError('店舗データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        const fetchFavIds = async () => {
            try {
                const res = await fetch('/api/favorites/ids');
                if (!res.ok) return;
                const data = await res.json();
                setFavStoreIds(new Set(data.storeIds || []));
                setFavUserId(data.userId || null);
            } catch {
                // 未ログイン時など - 無視
            }
        };

        fetchStores();
        fetchFavIds();
    }, []);

    const areas = useMemo(() => {
        const areaSet = new Set(stores.map(store => store.area));
        return ['all', ...Array.from(areaSet)];
    }, [stores]);

    const filteredAndSortedStores = useMemo(() => {
        let filtered = [...stores];

        if (keyword.trim()) {
            const lowerKeyword = keyword.toLowerCase();
            filtered = filtered.filter((store) => {
                return (
                    store.name?.toLowerCase().includes(lowerKeyword) ||
                    store.address?.toLowerCase().includes(lowerKeyword) ||
                    store.area?.toLowerCase().includes(lowerKeyword) ||
                    store.description?.toLowerCase().includes(lowerKeyword) ||
                    store.phone_number?.toLowerCase().includes(lowerKeyword)
                );
            });
        }

        if (selectedArea !== 'all') {
            filtered = filtered.filter(store => store.area === selectedArea);
        }

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
                return filtered.sort((a, b) => b.brand_number - a.brand_number);
            case 'review-desc':
                return filtered.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
            default:
                return filtered;
        }
    }, [stores, sortOption, selectedArea, keyword]);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
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
                                    onClick={() => setSortOption('review-desc')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'review-desc'
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    レビュー数順
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">読み込み中...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20">
                            <p className="text-red-500 text-lg">{error}</p>
                        </div>
                    )}

                    {/* Store List */}
                    {!loading && !error && (
                        <div className="space-y-6">
                            {filteredAndSortedStores.map((store, index) => (
                                <div
                                    key={store.id}
                                    className="relative"
                                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                                >
                                    <Link href={`/dabot/stores/${store.id}`} className="group block">
                                        <div className="relative p-6 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-500">
                                            {/* Store Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-3 mb-2">
                                                        <h2 className="text-3xl font-black italic tracking-tight group-hover:translate-x-2 group-hover:text-gray-900 transition-all duration-300">
                                                            {store.name}
                                                        </h2>
                                                        {store.is_open_now && (
                                                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 font-medium rounded">
                                                                営業中
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                                <circle cx="12" cy="10" r="3" />
                                                            </svg>
                                                            {store.area}
                                                        </span>
                                                        {store.phone_number && (
                                                            <span className="flex items-center gap-1 text-gray-500">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                                </svg>
                                                                {store.phone_number}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-4">
                                                    <span className="inline-block px-3 py-1 bg-black text-white text-xs font-medium">
                                                        {store.brand_number}ブランド
                                                    </span>
                                                </div>
                                            </div>

                                            {store.description && (
                                                <p className="text-sm text-gray-600 mb-4">
                                                    {store.description}
                                                </p>
                                            )}

                                            <p className="text-xs text-gray-500 mb-4">
                                                📍 {store.address}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                {store.review_count !== null && store.review_count !== undefined && (
                                                    <span className="flex items-center gap-1">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                        </svg>
                                                        {store.review_count} レビュー
                                                    </span>
                                                )}
                                                {store.business_hours && (
                                                    <span className="flex items-center gap-1">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        {store.business_hours}
                                                    </span>
                                                )}
                                                {store.site_url && (
                                                    <span className="flex items-center gap-1">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                                        </svg>
                                                        サイトあり
                                                    </span>
                                                )}
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-2 transition-transform duration-300">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Star Button - outside Link to avoid navigation */}
                                    <div className="absolute bottom-4 right-4">
                                        <StarButton
                                            storeId={store.id}
                                            favoriteIds={favStoreIds}
                                            userId={favUserId}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && !error && filteredAndSortedStores.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">
                                該当する店舗が見つかりませんでした
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
