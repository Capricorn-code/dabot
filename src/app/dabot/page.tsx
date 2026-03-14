'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { Schema } from '@/amplify/data/resource';

const backgroundImages = [
    '/top1.jpg',
    '/top2.jpg',
    '/top3.jpg',
    '/top4.jpg',
    '/top5.jpg',
];

type Brand = Schema['Brands']['type'];

export default function Home() {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await fetch('/api/brands');
                if (!response.ok) return;
                const data = await response.json();
                setBrands(data.brands || []);
            } catch (err) {
                console.error('Error fetching brands:', err);
            }
        };
        fetchBrands();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyword.trim()) {
            router.push(`/dabot/stores?keyword=${encodeURIComponent(keyword)}`);
        } else {
            router.push('/dabot/stores');
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <Header />

            {/* Hero Section — Full Screen with background */}
            <main className="relative min-h-screen flex flex-col">

                {/* Background slideshow */}
                <div className="absolute inset-0">
                    {backgroundImages.map((image, index) => (
                        <div
                            key={image}
                            className={`absolute inset-0 bg-cover bg-center grayscale transition-opacity duration-1000 ${
                                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    ))}
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/55" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col flex-1 px-6 sm:px-10 md:px-16 lg:px-24 pt-28 sm:pt-32 pb-10">

                    {/* Main content — grows to fill */}
                    <div className="flex-1 flex flex-col justify-center max-w-2xl">

                        {/* Label */}
                        <p className="text-white/50 text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-5 sm:mb-6">
                            Skater &amp; Street Brand — 取扱店舗検索
                        </p>

                        {/* DABOT */}
                        <h1
                            className="font-black italic leading-none tracking-tighter text-white mb-3 select-none"
                            style={{ fontSize: 'clamp(5rem, 20vw, 13rem)' }}
                        >
                            DABOT
                        </h1>

                        {/* Lime accent line */}
                        <div
                            className="w-16 sm:w-20 mb-8 sm:mb-10"
                            style={{ height: '3px', backgroundColor: '#CCFF00' }}
                        />

                        {/* Search form */}
                        <form onSubmit={handleSearch} className="w-full space-y-3">
                            <div className="flex h-13 sm:h-14">
                                <input
                                    type="text"
                                    placeholder="ブランド名・エリアで検索"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="flex-1 min-w-0 px-4 sm:px-5 py-3 sm:py-4 bg-white text-black text-sm focus:outline-none placeholder-gray-400"
                                />
                                <button
                                    type="submit"
                                    className="shrink-0 px-5 sm:px-7 py-3 sm:py-4 text-black text-sm font-bold tracking-wide transition-opacity hover:opacity-80"
                                    style={{ backgroundColor: '#CCFF00' }}
                                >
                                    検索
                                </button>
                            </div>
                            <Link
                                href="/dabot/stores"
                                className="block w-full py-3 sm:py-4 border border-white/30 text-white text-xs sm:text-sm font-medium tracking-[0.2em] text-center hover:bg-white hover:text-black transition-all duration-200"
                            >
                                エリアから探す
                            </Link>
                        </form>
                    </div>

                    {/* Bottom bar — indicators + counter */}
                    <div className="flex items-center justify-between mt-8">
                        {/* Slide indicators */}
                        <div className="flex items-center gap-2">
                            {backgroundImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentImageIndex(i)}
                                    className="transition-all duration-300"
                                    style={{
                                        width: i === currentImageIndex ? '24px' : '6px',
                                        height: '3px',
                                        backgroundColor: i === currentImageIndex ? '#CCFF00' : 'rgba(255,255,255,0.3)',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Counter */}
                        <span className="text-white/30 text-xs font-mono tracking-widest">
                            {String(currentImageIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(backgroundImages.length).padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </main>

            {/* Brands Section */}
            <section className="py-16 sm:py-24 px-6 sm:px-10 bg-[#0a0a0a]">
                <div className="container mx-auto max-w-6xl">
                    {/* Section header */}
                    <div className="flex items-end justify-between mb-10 sm:mb-14 pb-5 sm:pb-6 border-b border-white/10">
                        <div>
                            <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-2">Directory</p>
                            <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight text-white">
                                BRANDS
                            </h2>
                        </div>
                        <Link
                            href="/dabot/brands"
                            className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                        >
                            すべて見る →
                        </Link>
                    </div>

                    {/* Brand grid */}
                    {brands.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-white/5">
                            {brands.slice(0, 8).map((brand) => (
                                <Link
                                    key={brand.id}
                                    href={`/dabot/brands/${brand.id}`}
                                    className="group relative aspect-square bg-[#111] flex items-center justify-center overflow-hidden hover:bg-[#181818] transition-colors duration-300"
                                >
                                    {/* Lime top line on hover */}
                                    <div
                                        className="absolute top-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-300"
                                        style={{ backgroundColor: '#CCFF00' }}
                                    />
                                    <span className="relative text-white text-lg sm:text-xl md:text-2xl font-black italic tracking-tight text-center px-3 group-hover:scale-105 transition-transform duration-300">
                                        {brand.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white/20 text-sm text-center py-16">ブランドを読み込み中...</p>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
