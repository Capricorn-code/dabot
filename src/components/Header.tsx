'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/dabot', label: 'ホーム' },
    { href: '/dabot/stores', label: '店舗一覧', exactMatch: true },
    { href: '/dabot/brands', label: 'ブランド一覧' },
    { href: '/dabot/stores/new', label: '店舗登録はこちら' },
    { href: '/dabot/mypage', label: 'マイページ' },
];

export function Header() {
    const pathname = usePathname();

    const isActive = (item: typeof navItems[number]) => {
        if (item.href === '/dabot') return pathname === '/dabot';
        if (item.exactMatch) return pathname === item.href;
        return pathname.startsWith(item.href);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/dabot" className="text-4xl font-black italic tracking-tight hover:opacity-70 transition-opacity">
                        DABOT
                    </Link>

                    <nav className="flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
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
                    </nav>
                </div>
            </div>
        </header>
    );
}
