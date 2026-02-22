'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { Header } from '@/components/Header';
import type { Schema } from '@/amplify/data/resource';

type Brand = Schema['Brands']['type'];

export default function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const brandId = resolvedParams.id;

    const [brand, setBrand] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/brands/${brandId}`);

                if (response.status === 404) {
                    setError('ブランドが見つかりませんでした');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch brand');
                }

                const data = await response.json();
                setBrand(data.brand);
            } catch (err) {
                console.error('Error fetching brand:', err);
                setError('ブランドデータの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();
    }, [brandId]);

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

    if (error || !brand) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 pb-20 text-center">
                    <p className="text-red-500 text-lg mb-8">{error || 'ブランドが見つかりませんでした'}</p>
                    <Link
                        href="/dabot/brands"
                        className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                    >
                        ブランド一覧に戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="pt-32 pb-20">
                <div className="container mx-auto max-w-6xl px-6">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                        <a href="/dabot" className="hover:text-black transition-colors">ホーム</a>
                        <span>/</span>
                        <Link href="/dabot/brands" className="hover:text-black transition-colors">ブランド一覧</Link>
                        <span>/</span>
                        <span className="text-black font-medium">{brand.name}</span>
                    </div>

                    {/* Hero Section */}
                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        {/* Brand Visual */}
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                            <span className="text-white text-6xl font-black italic tracking-tight text-center px-4">
                                {brand.name}
                            </span>
                        </div>

                        {/* Brand Info */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-6xl font-black italic tracking-tight mb-4">
                                {brand.name}
                            </h1>
                            {brand.name_kana && (
                                <p className="text-xl text-gray-600 mb-8">{brand.name_kana}</p>
                            )}
                            {brand.description && (
                                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                    {brand.description}
                                </p>
                            )}

                            {/* Brand Details */}
                            <div className="space-y-4 border-t border-gray-200 pt-8">
                                {brand.found_year && (
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-500 w-24">設立年</span>
                                        <span className="text-base font-medium">{brand.found_year}</span>
                                    </div>
                                )}
                                {brand.birth_place && (
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-500 w-24">発祥地</span>
                                        <span className="text-base font-medium">{brand.birth_place}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Store Search Section */}
                    <div className="bg-gray-50 p-12 text-center">
                        <h2 className="text-3xl font-black italic tracking-tight mb-4">
                            {brand.name}を取り扱う店舗を探す
                        </h2>
                        <p className="text-gray-600 mb-8">
                            このブランドを取り扱っている店舗を検索できます
                        </p>
                        <div className="max-w-2xl mx-auto">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="エリアやキーワードで検索"
                                    defaultValue={brand.name}
                                    className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                />
                                <button className="px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                                    検索
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Back to List */}
                    <div className="mt-16 text-center">
                        <Link
                            href="/dabot/brands"
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
                            ブランド一覧に戻る
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
