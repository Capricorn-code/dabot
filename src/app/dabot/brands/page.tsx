'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import type { Schema } from '@/amplify/data/resource';

type Brand = Schema['Brands']['type'];

type SortOption = 'name-asc' | 'name-desc' | 'ja-asc' | 'ja-desc';

function StarButton({ brandId, favoriteIds, userId }: {
    brandId: string;
    favoriteIds: Set<string>;
    userId: string | null;
}) {
    const [isFav, setIsFav] = useState(favoriteIds.has(brandId));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsFav(favoriteIds.has(brandId));
    }, [favoriteIds, brandId]);

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
                    body: JSON.stringify({ user_id: userId, target_type: 'brand', target_id: brandId }),
                });
                if (res.ok) setIsFav(false);
            } else {
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ target_type: 'brand', target_id: brandId }),
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

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');
    const [favBrandIds, setFavBrandIds] = useState<Set<string>>(new Set());
    const [favUserId, setFavUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/brands');
                if (!response.ok) throw new Error('Failed to fetch brands');
                const data = await response.json();
                setBrands(data.brands || []);
            } catch (err) {
                console.error('Error fetching brands:', err);
                setError('ブランドデータの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        const fetchFavIds = async () => {
            try {
                const res = await fetch('/api/favorites/ids');
                if (!res.ok) return;
                const data = await res.json();
                setFavBrandIds(new Set(data.brandIds || []));
                setFavUserId(data.userId || null);
            } catch {
                // 未ログイン時など - 無視
            }
        };

        fetchBrands();
        fetchFavIds();
    }, []);

    const sortedBrands = useMemo(() => {
        const sorted = [...brands];
        switch (sortOption) {
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'ja-asc':
                return sorted.sort((a, b) => (a.name_kana || '').localeCompare(b.name_kana || '', 'ja'));
            case 'ja-desc':
                return sorted.sort((a, b) => (b.name_kana || '').localeCompare(a.name_kana || '', 'ja'));
            default:
                return sorted;
        }
    }, [brands, sortOption]);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            BRANDS
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            取扱ブランド一覧 ({brands.length}ブランド)
                        </p>
                    </div>

                    {/* Sort Options */}
                    <div className="mb-8 flex items-center gap-4 pb-6 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-700">並び替え:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortOption('name-asc')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'name-asc'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                A-Z
                            </button>
                            <button
                                onClick={() => setSortOption('name-desc')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'name-desc'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Z-A
                            </button>
                            <button
                                onClick={() => setSortOption('ja-asc')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'ja-asc'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                あ-ん
                            </button>
                            <button
                                onClick={() => setSortOption('ja-desc')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${sortOption === 'ja-desc'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                ん-あ
                            </button>
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

                    {/* Brand List */}
                    {!loading && !error && (
                        <div className="space-y-4">
                            {sortedBrands.map((brand, index) => (
                                <div
                                    key={brand.id}
                                    className="relative"
                                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                                >
                                    <Link href={`/dabot/brands/${brand.id}`} className="group block">
                                        <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-500">
                                            {/* Brand Icon */}
                                            <div className={`relative w-32 h-32 flex-shrink-0 bg-gradient-to-br ${
                                                index % 4 === 0 ? 'from-slate-900 to-slate-700' :
                                                index % 4 === 1 ? 'from-zinc-900 to-zinc-700' :
                                                index % 4 === 2 ? 'from-neutral-900 to-neutral-700' :
                                                'from-gray-900 to-gray-700'
                                            } flex items-center justify-center group-hover:scale-105 transition-transform duration-500 border border-gray-800`}>
                                                <span className="text-white text-2xl font-black italic tracking-tight text-center px-2 break-words">
                                                    {brand.name}
                                                </span>
                                            </div>

                                            {/* Brand Info */}
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-3xl font-black italic tracking-tight mb-2 group-hover:translate-x-2 group-hover:text-gray-900 transition-all duration-300">
                                                    {brand.name}
                                                </h2>
                                                {brand.name_kana && (
                                                    <p className="text-sm text-gray-600 mb-1">{brand.name_kana}</p>
                                                )}
                                                {brand.description && (
                                                    <p className="text-sm text-gray-500">{brand.description}</p>
                                                )}
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-2 transition-transform duration-300">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Star Button - outside Link to avoid navigation */}
                                    <div className="absolute bottom-4 right-4">
                                        <StarButton
                                            brandId={brand.id}
                                            favoriteIds={favBrandIds}
                                            userId={favUserId}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && !error && sortedBrands.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">
                                ブランドが登録されていません
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
