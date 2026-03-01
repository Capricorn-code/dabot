'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';

type FavoriteKey = {
    user_id: string;
    target_type: string;
    target_id: string;
};

type FavoriteStore = {
    favoriteKey: FavoriteKey;
    id: string;
    name: string;
    area: string;
    address: string;
};

type FavoriteBrand = {
    favoriteKey: FavoriteKey;
    id: string;
    name: string;
    name_kana: string | null;
};

export default function MyPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([]);
    const [favoriteBrands, setFavoriteBrands] = useState<FavoriteBrand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        router.replace('/dabot/login');
        return null;
    }

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/favorites');
            if (!res.ok) {
                throw new Error('お気に入りの取得に失敗しました');
            }
            const data = await res.json();
            setFavoriteStores(data.stores || []);
            setFavoriteBrands(data.brands || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const removeFavorite = async (key: FavoriteKey) => {
        try {
            const res = await fetch('/api/favorites', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(key),
            });
            if (!res.ok) {
                throw new Error('削除に失敗しました');
            }
            await fetchFavorites();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            MY PAGE
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            あなたのお気に入り
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 bg-gray-50 border-2 border-dashed border-gray-300">
                            <p className="text-gray-500">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
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
                                            <div key={store.id} className="group flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300">
                                                <Link
                                                    href={`/dabot/stores/${store.id}`}
                                                    className="flex items-center gap-4 flex-1 min-w-0"
                                                >
                                                    <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white text-xs font-black italic">
                                                            {store.name.substring(0, 3)}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-xl font-black italic tracking-tight mb-1 group-hover:translate-x-2 transition-transform duration-300">
                                                            {store.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {store.area} / {store.address}
                                                        </p>
                                                    </div>
                                                </Link>
                                                <button
                                                    onClick={() => removeFavorite(store.favoriteKey)}
                                                    className="p-2 text-red-500 hover:scale-110 transition-transform flex-shrink-0"
                                                    aria-label="お気に入りから削除"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                </button>
                                            </div>
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
                                        {favoriteBrands.map(brand => (
                                            <div key={brand.id} className="relative group">
                                                <Link
                                                    href={`/dabot/brands/${brand.id}`}
                                                    className="flex aspect-square bg-gradient-to-br from-slate-900 to-slate-700 hover:shadow-2xl transition-all duration-500 items-center justify-center border border-gray-800 hover:border-gray-600"
                                                >
                                                    <h3 className="text-white text-2xl font-black italic tracking-tight text-center px-4 group-hover:scale-110 transition-all duration-500">
                                                        {brand.name}
                                                    </h3>
                                                </Link>
                                                <button
                                                    onClick={() => removeFavorite(brand.favoriteKey)}
                                                    className="absolute top-2 right-2 p-1 text-red-500 hover:scale-110 transition-transform"
                                                    aria-label="お気に入りから削除"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                </button>
                                            </div>
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
                </div>
            </main>
        </div>
    );
}
