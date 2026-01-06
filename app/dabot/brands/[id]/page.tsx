'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';

const brandsData = {
    butter: {
        name: 'BUTTER',
        nameJa: 'バター',
        image: '/brands/butter.jpg',
        description: 'NYC発のスケートブランド',
        longDescription: 'BUTTER GOODSは、ニューヨーク発のスケートブランド。ストリートカルチャーとスケートボードの融合から生まれた独自のスタイルが特徴です。',
        established: '1994',
        origin: 'New York, USA',
        category: 'Skateboard / Streetwear',
    },
    dime: {
        name: 'DIME',
        nameJa: 'ダイム',
        image: '/brands/dime.jpg',
        description: 'カナダ・モントリオール発',
        longDescription: 'DIMEは、カナダ・モントリオール発のスケートブランド。ユニークなデザインとユーモアのあるアプローチで知られています。',
        established: '2005',
        origin: 'Montreal, Canada',
        category: 'Skateboard / Streetwear',
    },
    evisen: {
        name: 'EVISEN',
        nameJa: 'エビセン',
        image: '/brands/evisen.jpg',
        description: '日本発スケートブランド',
        longDescription: 'EVISENは、日本発のスケートブランド。日本のストリートカルチャーとスケートボードシーンを代表するブランドの一つです。',
        established: '2011',
        origin: 'Tokyo, Japan',
        category: 'Skateboard / Streetwear',
    },
    ftc: {
        name: 'FTC',
        nameJa: 'エフティーシー',
        image: '/brands/ftc_3.jpg',
        description: 'サンフランシスコの老舗',
        longDescription: 'FTC（For The City）は、サンフランシスコを拠点とする老舗スケートショップ＆ブランド。西海岸スケートカルチャーの中心的存在です。',
        established: '1986',
        origin: 'San Francisco, USA',
        category: 'Skateboard / Streetwear',
    },
    obey: {
        name: 'OBEY',
        nameJa: 'オベイ',
        image: '/brands/obey.jpg',
        description: 'ストリートアートブランド',
        longDescription: 'OBEYは、ストリートアーティストShepard Faireyによって設立されたブランド。アートとストリートカルチャーを融合させたユニークなデザインが特徴です。',
        established: '2001',
        origin: 'Los Angeles, USA',
        category: 'Streetwear / Art',
    },
    polar: {
        name: 'POLAR',
        nameJa: 'ポーラー',
        image: '/brands/polar.jpg',
        description: 'スウェーデン発',
        longDescription: 'POLAR SKATE CO.は、スウェーデン発のスケートブランド。北欧らしいミニマルなデザインと高品質な製品で知られています。',
        established: '2011',
        origin: 'Malmö, Sweden',
        category: 'Skateboard / Streetwear',
    },
    snacks: {
        name: 'SNACKS',
        nameJa: 'スナックス',
        image: '/brands/snacks.jpg',
        description: 'NY発スケートブランド',
        longDescription: 'SNACKSは、ニューヨーク発のスケートブランド。遊び心のあるデザインとストリート感覚が魅力です。',
        established: '2015',
        origin: 'New York, USA',
        category: 'Skateboard / Streetwear',
    },
    yardsale: {
        name: 'YARDSALE',
        nameJa: 'ヤードセール',
        image: '/brands/yardsale.jpg',
        description: 'ロンドン発',
        longDescription: 'YARDSALEは、ロンドン発のスケートブランド。イギリスのストリートカルチャーを体現したユニークなスタイルが特徴です。',
        established: '2013',
        origin: 'London, UK',
        category: 'Skateboard / Streetwear',
    },
};

type BrandId = keyof typeof brandsData;

export default function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const brandId = resolvedParams.id.toLowerCase() as BrandId;
    const brand = brandsData[brandId];

    if (!brand) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href="/dabot" className="text-4xl font-black italic tracking-tight hover:opacity-70 transition-opacity">
                            DABOT
                        </a>

                        {/* Navigation */}
                        <nav className="flex items-center gap-8">
                            <a href="/dabot" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                ホーム
                            </a>
                            <a href="/davot/stores" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                店舗一覧
                            </a>
                            <a href="/dabot/brands" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                ブランド一覧
                            </a>
                            <a href="/davot/about" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                店舗登録について
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20">
                <div className="container mx-auto max-w-6xl px-6">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                        <a href="/dabot" className="hover:text-black transition-colors">ホーム</a>
                        <span>/</span>
                        <a href="/dabot/brands" className="hover:text-black transition-colors">ブランド一覧</a>
                        <span>/</span>
                        <span className="text-black font-medium">{brand.name}</span>
                    </div>

                    {/* Hero Section */}
                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        {/* Brand Image */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${brand.image})`,
                                }}
                            />
                        </div>

                        {/* Brand Info */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-6xl font-black italic tracking-tight mb-4">
                                {brand.name}
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">{brand.nameJa}</p>
                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                {brand.longDescription}
                            </p>

                            {/* Brand Details */}
                            <div className="space-y-4 border-t border-gray-200 pt-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-500 w-24">設立年</span>
                                    <span className="text-base font-medium">{brand.established}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-500 w-24">発祥地</span>
                                    <span className="text-base font-medium">{brand.origin}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-500 w-24">カテゴリー</span>
                                    <span className="text-base font-medium">{brand.category}</span>
                                </div>
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
                        <a
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
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
