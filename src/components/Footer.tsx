import Link from 'next/link';

const footerLinks = [
    { href: '/dabot/terms', label: '利用規約' },
    { href: '/dabot/privacy', label: 'プライバシーポリシー' },
    { href: '/dabot/contact', label: 'お問い合わせ / 掲載削除依頼' },
];

export function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col items-center gap-6">
                    <Link
                        href="/dabot"
                        className="text-2xl font-black italic tracking-tight hover:opacity-70 transition-opacity"
                    >
                        DABOT
                    </Link>

                    <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} DABOT
                    </p>
                </div>
            </div>
        </footer>
    );
}
