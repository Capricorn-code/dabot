'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const brands = [
    { name: 'BUTTER', nameJa: 'バター', image: '/brands/butter.jpg', description: 'NYC発のスケートブランド' },
    { name: 'DIME', nameJa: 'ダイム', image: '/brands/dime.jpg', description: 'カナダ・モントリオール発' },
    { name: 'EVISEN', nameJa: 'エビセン', image: '/brands/evisen.jpg', description: '日本発スケートブランド' },
    { name: 'FTC', nameJa: 'エフティーシー', image: '/brands/ftc_3.jpg', description: 'サンフランシスコの老舗' },
    { name: 'OBEY', nameJa: 'オベイ', image: '/brands/obey.jpg', description: 'ストリートアートブランド' },
    { name: 'POLAR', nameJa: 'ポーラー', image: '/brands/polar.jpg', description: 'スウェーデン発' },
    { name: 'SNACKS', nameJa: 'スナックス', image: '/brands/snacks.jpg', description: 'NY発スケートブランド' },
    { name: 'YARDSALE', nameJa: 'ヤードセール', image: '/brands/yardsale.jpg', description: 'ロンドン発' },
];

type SortOption = 'name-asc' | 'name-desc' | 'ja-asc' | 'ja-desc';

export default function BrandsPage() {
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');

    const sortedBrands = useMemo(() => {
        const sorted = [...brands];
        switch (sortOption) {
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'ja-asc':
                return sorted.sort((a, b) => a.nameJa.localeCompare(b.nameJa, 'ja'));
            case 'ja-desc':
                return sorted.sort((a, b) => b.nameJa.localeCompare(a.nameJa, 'ja'));
            default:
                return sorted;
        }
    }, [sortOption]);

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
                            <Link href="/dabot/brands" className="text-sm font-medium border-b-2 border-black">
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
                <div className="container mx-auto max-w-5xl">
                    {/* Page Title */}
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

                    {/* Brand List */}
                    <div className="space-y-4">
                        {sortedBrands.map((brand, index) => (
                            <Link
                                key={brand.name}
                                href={`/dabot/brands/${brand.name.toLowerCase()}`}
                                className="group block"
                                style={{
                                    animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                                }}
                            >
                                <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-500">
                                    {/* Brand Icon/Text */}
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
                                        <p className="text-sm text-gray-600 mb-1">{brand.nameJa}</p>
                                        <p className="text-sm text-gray-500">{brand.description}</p>
                                    </div>

                                    {/* Arrow Icon */}
                                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
