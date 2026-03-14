'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Schema } from '@/amplify/data/resource';

type Brand = Schema['Brands']['type'];

export type StoreFormData = {
    name: string;
    address: string;
    area: string;
    is_open_now: boolean;
    phone_number: string;
    display_brand_ids: string[];
    description: string;
    site_url: string;
    business_hours: string;
};

export const initialFormData: StoreFormData = {
    name: '',
    address: '',
    area: '',
    is_open_now: true,
    phone_number: '',
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

type StoreFormProps = {
    initialData?: StoreFormData;
    onSubmit: (data: StoreFormData) => Promise<void>;
    submitLabel: string;
    loadingLabel: string;
    cancelHref: string;
};

export function StoreForm({ initialData, onSubmit, submitLabel, loadingLabel, cancelHref }: StoreFormProps) {
    const [formData, setFormData] = useState<StoreFormData>(initialData ?? initialFormData);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch('/api/brands');
                if (res.ok) {
                    const data = await res.json();
                    setBrands(data.brands || []);
                }
            } catch (err) {
                console.error('Error fetching brands:', err);
            }
        };
        fetchBrands();
    }, []);

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
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
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

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        取扱ブランド ({formData.display_brand_ids.length}件選択中)
                    </label>

                    {/* 選択済みブランド */}
                    {formData.display_brand_ids.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.display_brand_ids.map((id) => {
                                const brand = brands.find(b => b.id === id);
                                if (!brand) return null;
                                return (
                                    <span
                                        key={id}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-sm font-medium"
                                    >
                                        {brand.name}
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                display_brand_ids: prev.display_brand_ids.filter(bid => bid !== id),
                                            }))}
                                            className="ml-1 hover:text-gray-300"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* ドロップダウン */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setBrandDropdownOpen(prev => !prev)}
                            className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors text-left flex items-center justify-between"
                        >
                            <span className="text-gray-500">ブランドを選択...</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                className={`transition-transform ${brandDropdownOpen ? 'rotate-180' : ''}`}>
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {brandDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 max-h-60 overflow-y-auto shadow-lg">
                                {brands.length === 0 ? (
                                    <p className="px-4 py-3 text-sm text-gray-500">登録されているブランドがありません</p>
                                ) : (
                                    brands.map((brand) => {
                                        const isSelected = formData.display_brand_ids.includes(brand.id);
                                        return (
                                            <button
                                                key={brand.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        display_brand_ids: isSelected
                                                            ? prev.display_brand_ids.filter(id => id !== brand.id)
                                                            : [...prev.display_brand_ids, brand.id],
                                                    }));
                                                }}
                                                className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-100' : ''}`}
                                            >
                                                <span className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-black bg-black text-white' : 'border-gray-300'}`}>
                                                    {isSelected && (
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    )}
                                                </span>
                                                <span className="font-medium">{brand.name}</span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-8 py-4 bg-black text-white font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                        }`}
                >
                    {loading ? loadingLabel : submitLabel}
                </button>
                <Link
                    href={cancelHref}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium hover:border-black hover:text-black transition-colors text-center"
                >
                    キャンセル
                </Link>
            </div>
        </form>
    );
}
