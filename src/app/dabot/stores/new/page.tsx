'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type StoreFormData = {
    name: string;
    address: string;
    area: string;
    lat: string;
    long: string;
    is_open_now: boolean;
    phone_number: string;
    brand_number: string;
    display_brand_ids: string[];
    description: string;
    site_url: string;
    business_hours: string;
};

const initialFormData: StoreFormData = {
    name: '',
    address: '',
    area: '',
    lat: '',
    long: '',
    is_open_now: true,
    phone_number: '',
    brand_number: '0',
    display_brand_ids: [],
    description: '',
    site_url: '',
    business_hours: '',
};

const areaOptions = [
    '北海道',
    '東北',
    '関東',
    '東京',
    '神奈川',
    '中部',
    '関西',
    '大阪',
    '中国',
    '四国',
    '九州',
    '沖縄',
];

export default function NewStorePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<StoreFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    address: formData.address,
                    area: formData.area,
                    lat: parseFloat(formData.lat),
                    long: parseFloat(formData.long),
                    is_open_now: formData.is_open_now,
                    phone_number: formData.phone_number || null,
                    brand_number: parseInt(formData.brand_number, 10),
                    display_brand_ids: formData.display_brand_ids,
                    description: formData.description || null,
                    site_url: formData.site_url || null,
                    business_hours: formData.business_hours || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || '店舗の登録に失敗しました');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dabot/stores');
            }, 2000);
        } catch (err) {
            console.error('Error creating store:', err);
            setError(err instanceof Error ? err.message : '店舗の登録に失敗しました');
        } finally {
            setLoading(false);
        }
    };

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
                            <Link href="/dabot/brands" className="text-sm font-medium hover:opacity-70 transition-opacity">
                                ブランド一覧
                            </Link>
                            <Link href="/dabot/stores/new" className="text-sm font-medium border-b-2 border-black">
                                店舗登録はこちら
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
                <div className="container mx-auto max-w-2xl">
                    {/* Page Title */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            NEW STORE
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            新規店舗登録
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-8 p-4 bg-green-50 border-2 border-green-500 text-green-700">
                            店舗を登録しました。店舗一覧ページに移動します...
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border-2 border-red-500 text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 基本情報セクション */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-bold mb-4">基本情報</h2>

                            {/* 店舗名 */}
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    店舗名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="店舗名を入力"
                                />
                            </div>

                            {/* 説明 */}
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    店舗説明
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="店舗の説明を入力"
                                />
                            </div>
                        </div>

                        {/* 所在地セクション */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-bold mb-4">所在地情報</h2>

                            {/* エリア */}
                            <div className="mb-4">
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                                    エリア <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="area"
                                    name="area"
                                    required
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                >
                                    <option value="">エリアを選択</option>
                                    {areaOptions.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 住所 */}
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                    住所 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="例: 東京都渋谷区神宮前1-2-3"
                                />
                            </div>

                            {/* 緯度・経度 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-2">
                                        緯度 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="lat"
                                        name="lat"
                                        required
                                        step="any"
                                        value={formData.lat}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        placeholder="例: 35.6762"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="long" className="block text-sm font-medium text-gray-700 mb-2">
                                        経度 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="long"
                                        name="long"
                                        required
                                        step="any"
                                        value={formData.long}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        placeholder="例: 139.6503"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 連絡先セクション */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-bold mb-4">連絡先・営業情報</h2>

                            {/* 電話番号 */}
                            <div className="mb-4">
                                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    電話番号
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="例: 03-1234-5678"
                                />
                            </div>

                            {/* サイトURL */}
                            <div className="mb-4">
                                <label htmlFor="site_url" className="block text-sm font-medium text-gray-700 mb-2">
                                    Webサイト URL
                                </label>
                                <input
                                    type="url"
                                    id="site_url"
                                    name="site_url"
                                    value={formData.site_url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="例: https://example.com"
                                />
                            </div>

                            {/* 営業時間 */}
                            <div className="mb-4">
                                <label htmlFor="business_hours" className="block text-sm font-medium text-gray-700 mb-2">
                                    営業時間
                                </label>
                                <input
                                    type="text"
                                    id="business_hours"
                                    name="business_hours"
                                    value={formData.business_hours}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="例: 11:00-20:00"
                                />
                            </div>

                            {/* 営業中フラグ */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_open_now"
                                    name="is_open_now"
                                    checked={formData.is_open_now}
                                    onChange={handleChange}
                                    className="w-5 h-5 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <label htmlFor="is_open_now" className="text-sm font-medium text-gray-700">
                                    現在営業中
                                </label>
                            </div>
                        </div>

                        {/* ブランド情報セクション */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-bold mb-4">取扱ブランド情報</h2>

                            {/* 取扱ブランド数 */}
                            <div className="mb-4">
                                <label htmlFor="brand_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    取扱ブランド数 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="brand_number"
                                    name="brand_number"
                                    required
                                    min="0"
                                    value={formData.brand_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="例: 5"
                                />
                            </div>

                            <p className="text-sm text-gray-500">
                                ※ 取扱ブランドの詳細は登録後に編集できます
                            </p>
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
                                {loading ? '登録中...' : '店舗を登録する'}
                            </button>
                            <Link
                                href="/dabot/stores"
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
