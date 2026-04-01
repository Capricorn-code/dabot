'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import type { Schema } from '@/amplify/data/resource';

type Store = Schema['Stores']['type'];
type Brand = Schema['Brands']['type'];

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
    const router = useRouter();
    const { user } = useAuth();
    const [isFav, setIsFav] = useState(favoriteIds.has(storeId));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsFav(favoriteIds.has(storeId));
    }, [favoriteIds, storeId]);

    const toggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            router.push('/dabot/login');
            return;
        }
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
                    body: JSON.stringify({ user_id: user.userId, target_type: 'store', target_id: storeId }),
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
    const [brandMap, setBrandMap] = useState<Map<string, string>>(new Map());
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
                const [storesRes, brandsRes] = await Promise.all([
                    fetch('/api/stores'),
                    fetch('/api/brands'),
                ]);
                if (!storesRes.ok) throw new Error('Failed to fetch stores');
                const storesData = await storesRes.json();
                setStores(storesData.stores || []);

                if (brandsRes.ok) {
                    const brandsData = await brandsRes.json();
                    const map = new Map<string, string>();
                    (brandsData.brands || []).forEach((b: Brand) => {
                        map.set(b.id, b.name);
                    });
                    setBrandMap(map);
                }
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredAndSortedStores.map((store, index) => (
                                <div
                                    key={store.id}
                                    className="relative"
                                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                                >
                                    <Link href={`/dabot/stores/${store.id}`} className="group block">
                                        <div className="relative p-5 bg-white border border-gray-200 border-l-4 border-l-[#CCFF00] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            {/* Area Badge & Status */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="bg-black text-white text-xs font-bold px-2 py-0.5">
                                                    {store.area}
                                                </span>
                                                {store.is_open_now && (
                                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 font-medium">
                                                        営業中
                                                    </span>
                                                )}
                                            </div>

                                            {/* Store Name */}
                                            <h2 className="text-2xl font-black italic tracking-tight mb-3 group-hover:translate-x-1 transition-transform duration-300">
                                                {store.name}
                                            </h2>

                                            {/* Brand Tags */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {store.display_brand_ids && store.display_brand_ids.length > 0 ? (
                                                    store.display_brand_ids.map((brandId) => {
                                                        const brandName = brandMap.get(brandId ?? '');
                                                        if (!brandName) return null;
                                                        return (
                                                            <span key={brandId} className="inline-block px-2 py-0.5 bg-gray-900 text-white text-xs font-medium">
                                                                {brandName}
                                                            </span>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="inline-block px-2 py-0.5 bg-gray-900 text-white text-xs font-medium">
                                                        {store.brand_number}ブランド
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            {store.description && (
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {store.description}
                                                </p>
                                            )}

                                            {/* Footer Info */}
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                                                <span className="flex items-center gap-1">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                        <circle cx="12" cy="10" r="3" />
                                                    </svg>
                                                    <span className="truncate max-w-40">{store.address}</span>
                                                </span>
                                                {store.review_count !== null && store.review_count !== undefined && (
                                                    <span className="flex items-center gap-1">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                        </svg>
                                                        {store.review_count}
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
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-1 transition-transform duration-300">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Star Button */}
                                    <div className="absolute top-3 right-3">
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

            <Footer />

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
