'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import type { Schema } from '@/amplify/data/resource';

type Store = Schema['Stores']['type'];
type Brand = Schema['Brands']['type'];

export default function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const storeId = resolvedParams.id;

    const [store, setStore] = useState<Store | null>(null);
    const [brandMap, setBrandMap] = useState<Map<string, string>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStore = async () => {
            try {
                setLoading(true);
                const [storeRes, brandsRes] = await Promise.all([
                    fetch(`/api/stores/${storeId}`),
                    fetch('/api/brands'),
                ]);

                if (storeRes.status === 404) {
                    setError('店舗が見つかりませんでした');
                    return;
                }

                if (!storeRes.ok) {
                    throw new Error('Failed to fetch store');
                }

                const data = await storeRes.json();
                setStore(data.store);

                if (brandsRes.ok) {
                    const brandsData = await brandsRes.json();
                    const map = new Map<string, string>();
                    (brandsData.brands || []).forEach((b: Brand) => {
                        map.set(b.id, b.name);
                    });
                    setBrandMap(map);
                }
            } catch (err) {
                console.error('Error fetching store:', err);
                setError('店舗データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        fetchStore();
    }, [storeId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 pb-20 text-center">
                    <p className="text-gray-500 text-lg">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 pb-20 text-center">
                    <p className="text-red-500 text-lg mb-8">{error || '店舗が見つかりませんでした'}</p>
                    <Link
                        href="/dabot/stores"
                        className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                    >
                        店舗一覧に戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container mx-auto max-w-4xl px-6">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                        <a href="/dabot" className="hover:text-black transition-colors">ホーム</a>
                        <span>/</span>
                        <Link href="/dabot/stores" className="hover:text-black transition-colors">店舗一覧</Link>
                        <span>/</span>
                        <span className="text-black font-medium">{store.name}</span>
                    </div>

                    {/* Store Header */}
                    <div className="mb-12">
                        <div className="flex items-baseline gap-4 mb-2">
                            <h1 className="text-6xl font-black italic tracking-tight">
                                {store.name}
                            </h1>
                            {store.is_open_now ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                                    営業中
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded">
                                    営業外
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">{store.area}</p>
                        {user && (
                            <Link
                                href={`/dabot/stores/${storeId}/edit`}
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 border-2 border-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
                            >
                                編集する
                            </Link>
                        )}
                    </div>

                    {/* Main Info Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Left: Details */}
                        <div className="space-y-6">
                            {store.description && (
                                <div>
                                    <h2 className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
                                        店舗紹介
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">{store.description}</p>
                                </div>
                            )}

                            <div>
                                <h2 className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
                                    住所
                                </h2>
                                <p className="text-gray-800">{store.address}</p>
                            </div>

                            {store.phone_number && (
                                <div>
                                    <h2 className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
                                        電話番号
                                    </h2>
                                    <a
                                        href={`tel:${store.phone_number}`}
                                        className="text-gray-800 hover:text-black transition-colors"
                                    >
                                        {store.phone_number}
                                    </a>
                                </div>
                            )}

                            {store.business_hours && (
                                <div>
                                    <h2 className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
                                        営業時間
                                    </h2>
                                    <p className="text-gray-800">{store.business_hours}</p>
                                </div>
                            )}

                            {store.site_url && (
                                <div>
                                    <h2 className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
                                        Webサイト
                                    </h2>
                                    <a
                                        href={store.site_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-800 hover:text-black underline underline-offset-4 transition-colors break-all"
                                    >
                                        {store.site_url}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Right: Brand Info */}
                        <div className="space-y-6">
                            <div className="border-2 border-gray-200 p-8">
                                <h2 className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-6">
                                    取扱ブランド ({store.brand_number})
                                </h2>
                                {store.display_brand_ids && store.display_brand_ids.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {store.display_brand_ids.map((brandId) => {
                                            const brandName = brandMap.get(brandId ?? '');
                                            if (!brandName) return null;
                                            return (
                                                <span key={brandId} className="inline-block px-3 py-2 bg-black text-white text-sm font-medium">
                                                    {brandName}
                                                </span>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-7xl font-black italic tracking-tight mb-2">
                                            {store.brand_number}
                                        </p>
                                        <p className="text-sm text-gray-500">ブランド取扱中</p>
                                    </div>
                                )}
                            </div>

                            {store.review_count !== null && store.review_count !== undefined && (
                                <div className="border-2 border-gray-200 p-8">
                                    <h2 className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-6">
                                        レビュー
                                    </h2>
                                    <div className="text-center">
                                        <p className="text-7xl font-black italic tracking-tight mb-2">
                                            {store.review_count}
                                        </p>
                                        <p className="text-sm text-gray-500">件のレビュー</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back to List */}
                    <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                        <Link
                            href="/dabot/stores"
                            className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19 12H5M5 12L12 19M5 12L12 5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            店舗一覧に戻る
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
