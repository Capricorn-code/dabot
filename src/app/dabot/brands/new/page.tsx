'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

type BrandFormData = {
    name: string;
    name_kana: string;
    description: string;
    birth_place: string;
    found_year: string;
};

const initialFormData: BrandFormData = {
    name: '',
    name_kana: '',
    description: '',
    birth_place: '',
    found_year: '',
};

export default function NewBrandPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<BrandFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/brands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    name_kana: formData.name_kana || null,
                    description: formData.description || null,
                    birth_place: formData.birth_place || null,
                    found_year: formData.found_year || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'ブランドの登録に失敗しました');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dabot/brands');
            }, 2000);
        } catch (err) {
            console.error('Error creating brand:', err);
            setError(err instanceof Error ? err.message : 'ブランドの登録に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-2xl">
                    {/* ページタイトル */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            NEW BRAND
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            新規ブランド登録（管理者専用）
                        </p>
                    </div>

                    {/* 成功メッセージ */}
                    {success && (
                        <div className="mb-8 p-4 bg-green-50 border-2 border-green-500 text-green-700">
                            ブランドを登録しました。ブランド一覧ページに移動します...
                        </div>
                    )}

                    {/* エラーメッセージ */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border-2 border-red-500 text-red-700">
                            {error}
                        </div>
                    )}

                    {/* フォーム */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 基本情報セクション */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-bold mb-4">基本情報</h2>

                            {/* ブランド名 */}
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    ブランド名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="例: THRASHER"
                                />
                            </div>

                            {/* ブランド名（かな） */}
                            <div className="mb-4">
                                <label htmlFor="name_kana" className="block text-sm font-medium text-gray-700 mb-2">
                                    ブランド名（よみがな）
                                </label>
                                <input
                                    type="text"
                                    id="name_kana"
                                    name="name_kana"
                                    value={formData.name_kana}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="例: スラッシャー"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    ※ カタカナまたはひらがなで入力してください（検索・並び替えに使用）
                                </p>
                            </div>

                            {/* 説明 */}
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    ブランド説明
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="ブランドの説明を入力"
                                />
                            </div>
                        </div>

                        {/* 詳細情報セクション */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-bold mb-4">詳細情報</h2>

                            {/* 発祥地 */}
                            <div className="mb-4">
                                <label htmlFor="birth_place" className="block text-sm font-medium text-gray-700 mb-2">
                                    発祥地
                                </label>
                                <input
                                    type="text"
                                    id="birth_place"
                                    name="birth_place"
                                    value={formData.birth_place}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="例: San Francisco, CA, USA"
                                />
                            </div>

                            {/* 設立年 */}
                            <div className="mb-4">
                                <label htmlFor="found_year" className="block text-sm font-medium text-gray-700 mb-2">
                                    設立年
                                </label>
                                <input
                                    type="number"
                                    id="found_year"
                                    name="found_year"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    value={formData.found_year}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="例: 1981"
                                />
                            </div>
                        </div>

                        {/* 送信ボタン */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 px-8 py-4 bg-black text-white font-medium transition-colors ${
                                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                                }`}
                            >
                                {loading ? '登録中...' : 'ブランドを登録する'}
                            </button>
                            <Link
                                href="/dabot/brands"
                                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium hover:border-black hover:text-black transition-colors text-center"
                            >
                                キャンセル
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
