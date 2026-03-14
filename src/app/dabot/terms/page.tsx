import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-3xl">
                    {/* Page Title */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            TERMS OF SERVICE
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            利用規約
                        </p>
                    </div>

                    <div className="space-y-10 text-gray-800 leading-relaxed">
                        {/* 第1条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第1条（目的）
                            </h2>
                            <p className="text-sm">
                                本規約は、ストリートファッション・ブランドのショップ情報共有サービス「DABOT」（以下「本サービス」）の利用条件を定めるものです。本サービスは、ユーザー間の情報共有を通じてストリートカルチャーを盛り上げることを目的としています。
                            </p>
                        </section>

                        {/* 第2条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第2条（情報の正確性と免責）
                            </h2>
                            <ol className="list-decimal list-inside space-y-3 text-sm">
                                <li>
                                    本サービスに掲載される店舗情報（店名、住所、営業時間、取り扱いブランド等）は、運営またはユーザーが投稿した時点のものです。情報の正確性、最新性を保証するものではありません。
                                </li>
                                <li>
                                    ユーザーは、実際に店舗を訪問する際は事前に各店舗の公式SNSやサイト等で最新情報を確認するものとします。
                                </li>
                                <li>
                                    本サービスの利用により生じた損害（店舗とのトラブル、商品の売買トラブル等）について、運営者は一切の責任を負いません。
                                </li>
                            </ol>
                        </section>

                        {/* 第3条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第3条（知的財産権と引用について）
                            </h2>
                            <ol className="list-decimal list-inside space-y-3 text-sm">
                                <li>
                                    本サービスに掲載される各店舗・ブランドのロゴ、商標、画像等の権利は、それぞれの権利者に帰属します。
                                </li>
                                <li>
                                    本サービスでは、各SNS（Instagram等）が提供する公式な「埋め込み機能」を利用して情報を紹介する場合があります。これは各プラットフォームの規約に基づいた引用であり、権利を侵害する意図はありません。
                                </li>
                                <li>
                                    ユーザーが投稿したコンテンツ（レビューや写真）の著作権はユーザーに帰属しますが、本サービスの運営・宣伝の範囲内において、運営者が無償で利用できるものとします。
                                </li>
                            </ol>
                        </section>

                        {/* 第4条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第4条（禁止事項）
                            </h2>
                            <p className="text-sm mb-3">
                                ユーザーは、本サービスの利用にあたり以下の行為を禁止します。
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm pl-2">
                                <li>
                                    特定の店舗、ブランド、または他ユーザーに対する誹謗中傷や営業妨害。
                                </li>
                                <li>
                                    著作権、商標権、肖像権を侵害する画像や情報の無断アップロード。
                                </li>
                                <li>
                                    虚偽の情報や、公序良俗に反する内容の投稿。
                                </li>
                            </ul>
                        </section>

                        {/* 第5条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第5条（店舗関係者様への対応）
                            </h2>
                            <ol className="list-decimal list-inside space-y-3 text-sm">
                                <li>
                                    本サービスは、ストリートファッションの利便性向上のために公開情報に基づき作成されています。
                                </li>
                                <li>
                                    掲載を希望されない店舗関係者様、または情報の修正を希望される場合は、本サービス内の「<Link href="/dabot/contact" className="underline underline-offset-4 hover:text-black transition-colors">お問い合わせ・掲載削除依頼フォーム</Link>」よりご連絡ください。正当な理由があると判断した場合、速やかに削除・修正等の対応をいたします。
                                </li>
                            </ol>
                        </section>

                        {/* 第6条 */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                                第6条（規約の変更）
                            </h2>
                            <p className="text-sm">
                                運営者は、必要と判断した場合にはいつでも本規約を変更することができるものとします。変更後の利用規約は、本サービス上に掲載した時点から効力を生じるものとし、ユーザーが変更後も本サービスを利用した場合、変更後の規約に同意したものとみなします。
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
