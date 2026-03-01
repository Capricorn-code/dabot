'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const baseNavItems = [
        { href: '/dabot', label: 'ホーム' },
        { href: '/dabot/stores', label: '店舗一覧', exactMatch: true },
        { href: '/dabot/brands', label: 'ブランド一覧' },
        { href: '/dabot/stores/new', label: '店舗登録はこちら' },
    ];

    const isActive = (item: { href: string; exactMatch?: boolean }) => {
        if (item.href === '/dabot') return pathname === '/dabot';
        if (item.exactMatch) return pathname === item.href;
        return pathname.startsWith(item.href);
    };

    const handleSignOut = async () => {
        setMenuOpen(false);
        await signOut();
        router.push('/dabot');
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 md:py-6">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/dabot"
                            className="text-3xl md:text-4xl font-black italic tracking-tight hover:opacity-70 transition-opacity"
                            onClick={() => setMenuOpen(false)}
                        >
                            DABOT
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {baseNavItems.map((item) => (
                                <Link
                                    key={item.href + item.label}
                                    href={item.href}
                                    className={
                                        isActive(item)
                                            ? 'text-sm font-medium border-b-2 border-black'
                                            : 'text-sm font-medium hover:opacity-70 transition-opacity'
                                    }
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {!loading && user && (
                                <Link
                                    href="/dabot/mypage"
                                    className={
                                        pathname.startsWith('/dabot/mypage')
                                            ? 'text-sm font-medium border-b-2 border-black'
                                            : 'text-sm font-medium hover:opacity-70 transition-opacity'
                                    }
                                >
                                    マイページ
                                </Link>
                            )}
                            {!loading && (
                                user ? (
                                    <button
                                        onClick={handleSignOut}
                                        className="text-sm font-medium hover:opacity-70 transition-opacity"
                                    >
                                        ログアウト
                                    </button>
                                ) : (
                                    <Link
                                        href="/dabot/login"
                                        className={
                                            pathname.startsWith('/dabot/login')
                                                ? 'text-sm font-medium border-b-2 border-black'
                                                : 'text-sm font-medium hover:opacity-70 transition-opacity'
                                        }
                                    >
                                        ログイン
                                    </Link>
                                )
                            )}
                        </nav>

                        {/* Hamburger button (mobile only) */}
                        <button
                            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-label="メニュー"
                        >
                            <span
                                className={`block w-6 h-0.5 bg-black transition-all duration-300 origin-center ${
                                    menuOpen ? 'rotate-45 translate-y-2' : ''
                                }`}
                            />
                            <span
                                className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
                                    menuOpen ? 'opacity-0' : ''
                                }`}
                            />
                            <span
                                className={`block w-6 h-0.5 bg-black transition-all duration-300 origin-center ${
                                    menuOpen ? '-rotate-45 -translate-y-2' : ''
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile menu overlay */}
            <div
                className={`fixed inset-0 z-40 bg-white transition-opacity duration-300 md:hidden ${
                    menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                <nav className="flex flex-col px-10 gap-8 pt-24">
                    {baseNavItems.map((item) => (
                        <Link
                            key={item.href + item.label}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`text-2xl font-black italic tracking-tight transition-opacity ${
                                isActive(item)
                                    ? 'text-black border-b-2 border-black pb-1 w-fit'
                                    : 'text-gray-400 hover:text-black'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    {!loading && user && (
                        <Link
                            href="/dabot/mypage"
                            onClick={() => setMenuOpen(false)}
                            className={`text-2xl font-black italic tracking-tight transition-opacity ${
                                pathname.startsWith('/dabot/mypage')
                                    ? 'text-black border-b-2 border-black pb-1 w-fit'
                                    : 'text-gray-400 hover:text-black'
                            }`}
                        >
                            マイページ
                        </Link>
                    )}
                    {!loading && (
                        user ? (
                            <button
                                onClick={handleSignOut}
                                className="text-2xl font-black italic tracking-tight text-gray-400 hover:text-black transition-opacity text-left"
                            >
                                ログアウト
                            </button>
                        ) : (
                            <Link
                                href="/dabot/login"
                                onClick={() => setMenuOpen(false)}
                                className={`text-2xl font-black italic tracking-tight transition-opacity ${
                                    pathname.startsWith('/dabot/login')
                                        ? 'text-black border-b-2 border-black pb-1 w-fit'
                                        : 'text-gray-400 hover:text-black'
                                }`}
                            >
                                ログイン
                            </Link>
                        )
                    )}
                </nav>
            </div>
        </>
    );
}
