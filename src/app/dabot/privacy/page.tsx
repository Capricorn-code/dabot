import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-3xl">
                    {/* Page Title */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            PRIVACY POLICY
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            プライバシーポリシー
                        </p>
                    </div>

                    <div className="space-y-10 text-gray-800 leading-relaxed">
                        {/* 第1条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第1条（個人情報の収集方法）
                            </h2>
                            <p className="text-sm">
                                本サービスでは、ユーザーが「お問い合わせフォーム」を利用する際、または「ユーザー投稿」を行う際に、氏名（ハンドルネーム含む）やメールアドレス等の個人情報を収集する場合があります。
                            </p>
                        </section>

                        {/* 第2条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第2条（個人情報を収集・利用する目的）
                            </h2>
                            <p className="text-sm mb-3">
                                収集した個人情報は、以下の目的で利用いたします。
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm pl-2">
                                <li>ユーザーからの問い合わせ、掲載内容の修正・削除依頼への回答。</li>
                                <li>本サービスの円滑な運営、維持、改善。</li>
                                <li>利用規約に違反する行為、または不正な利用の防止。</li>
                            </ul>
                        </section>

                        {/* 第3条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第3条（個人情報の第三者提供）
                            </h2>
                            <p className="text-sm">
                                運営者は、法令に基づき開示が必要な場合を除き、ユーザーの同意を得ることなく第三者に個人情報を提供することはありません。
                            </p>
                        </section>

                        {/* 第4条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第4条（アクセス解析ツールについて）
                            </h2>
                            <ol className="list-decimal list-inside space-y-3 text-sm">
                                <li>
                                    本サービスでは、サイトの利用状況を把握するために「Google Analytics」等のアクセス解析ツールを利用しています。
                                </li>
                                <li>
                                    これらのツールは情報の収集のために「Cookie（クッキー）」を使用していますが、データは匿名で収集されており、個人を特定するものではありません。
                                </li>
                                <li>
                                    ユーザーはブラウザの設定でCookieを無効にすることにより、この収集を拒否することができます。
                                </li>
                            </ol>
                        </section>

                        {/* 第5条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第5条（広告の配信について）
                            </h2>
                            <ol className="list-decimal list-inside space-y-3 text-sm">
                                <li>
                                    本サービスでは、第三者配信の広告サービスを利用し、ユーザーの興味に応じた広告（パーソナライズ広告）を表示する場合があります。
                                </li>
                                <li>
                                    これに伴い、Cookieを利用してユーザーのサイト訪問履歴等の情報を取得することがあります。
                                </li>
                            </ol>
                        </section>

                        {/* 第6条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第6条（プライバシーポリシーの変更）
                            </h2>
                            <p className="text-sm">
                                本ポリシーの内容は、法令の変更やサービス内容の更新に伴い、適宜変更することができるものとします。変更後の内容は、本サイトに掲載した時点から効力を生じるものとします。
                            </p>
                        </section>

                        {/* 第7条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第7条（お問い合わせ窓口）
                            </h2>
                            <p className="text-sm">
                                個人情報の取り扱いに関するご質問、または情報の修正・削除の依頼については、本サイト内の「<Link href="/dabot/contact" className="underline underline-offset-4 hover:text-black transition-colors">お問い合わせフォーム</Link>」よりご連絡ください。
                            </p>
                        </section>
                    </div>

                    {/* Back link */}
                    <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                        <Link
                            href="/dabot"
                            className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            ホームに戻る
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
