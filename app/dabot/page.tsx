'use client';

import { useState, useEffect } from 'react';

const backgroundImages = [
    '/top1.jpg',
    '/top2.jpg',
    '/top3.jpg',
    '/top4.jpg',
    '/top5.jpg',
];

const brands = [
    { name: 'BUTTER', image: '/brands/butter.jpg' },
    { name: 'DIME', image: '/brands/dime.jpg' },
    { name: 'EVISEN', image: '/brands/evisen.jpg' },
    { name: 'FTC', image: '/brands/ftc_3.jpg' },
    { name: 'OBEY', image: '/brands/obey.jpg' },
    { name: 'POLAR', image: '/brands/polar.jpg' },
    { name: 'SNACKS', image: '/brands/snacks.jpg' },
    { name: 'YARDSALE', image: '/brands/yardsale.jpg' },
];

export default function Home() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // 5秒ごとに画像を切り替え
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % backgroundImages.length;
                console.log('Switching to image:', backgroundImages[newIndex]);
                return newIndex;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [currentImageIndex]);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <h1 className="text-4xl font-black italic tracking-tight">DABOT</h1>

                        {/* Navigation */}
                        <nav className="flex items-center gap-8">
                            <a href="/dabot" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                ホーム
                            </a>
                            <a href="/dabot/stores" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                店舗一覧
                            </a>
                            <a href="/dabot/brands" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                ブランド一覧
                            </a>
                            <a href="/dabot/about" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                店舗登録について
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative min-h-screen flex items-center justify-center">
                {/* Background Images - Grayscale skatepark with skateboarder */}
                <div className="absolute inset-0 z-0">
                    {backgroundImages.map((image, index) => (
                        <div
                            key={image}
                            className={`absolute inset-0 bg-cover bg-center bg-no-repeat grayscale transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundColor: '#e5e5e5',
                                zIndex: index === currentImageIndex ? 1 : 0
                            }}
                        />
                    ))}
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/20" style={{ zIndex: 2 }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-2xl px-6 text-center">
                    {/* Subtitle */}
                    <p className="text-sm mb-6 tracking-wide">
                        スケーター/ストリートブラント 取扱店舗検索サイト
                    </p>

                    {/* Main Logo */}
                    <h2 className="text-7xl font-black italic tracking-tight mb-12">
                        DABOT
                    </h2>

                    {/* Search Section */}
                    <div className="space-y-4">
                        {/* Keyword Search */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="キーワードを入力"
                                className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors"
                            />
                            <button className="px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                                検索
                            </button>
                        </div>

                        {/* Area Search Button */}
                        <button className="w-full px-6 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                            エリアから検索
                        </button>
                    </div>
                </div>

                {/* Decorative Icon/Element - Skateboard/Ramp illustration */}
                <div className="absolute bottom-20 left-20 z-10 opacity-80">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="35" width="60" height="10" fill="currentColor" />
                        <rect x="15" y="30" width="5" height="20" fill="currentColor" />
                        <rect x="60" y="30" width="5" height="20" fill="currentColor" />
                    </svg>
                </div>
            </main>

            {/* Brands Section */}
            <section className="py-20 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-black italic tracking-tight mb-4">
                            BRANDS
                        </h3>
                        <p className="text-gray-600 text-sm tracking-wide">
                            取扱ブランド一覧
                        </p>
                    </div>

                    {/* Brand Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                        {brands.map((brand) => (
                            <a
                                key={brand.name}
                                href={`/dabot/brands/${brand.name.toLowerCase()}`}
                                className="group relative aspect-square overflow-hidden bg-gray-100 hover:shadow-2xl transition-shadow duration-300"
                            >
                                {/* Brand Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{
                                        backgroundImage: `url(${brand.image})`,
                                    }}
                                />

                                {/* Overlay with Brand Name */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <h4 className="text-white text-2xl font-black italic tracking-tight">
                                        {brand.name}
                                    </h4>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* View All Link */}
                    <div className="text-center mt-12">
                        <a
                            href="/dabot/brands"
                            className="inline-block px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                        >
                            すべてのブランドを見る
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
