'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { StoreForm, type StoreFormData } from '@/components/StoreForm';

export default function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const storeId = resolvedParams.id;
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [initialData, setInitialData] = useState<StoreFormData | null>(null);
    const [storeName, setStoreName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const res = await fetch(`/api/stores/${storeId}`);
                if (!res.ok) {
                    setError('店舗データの取得に失敗しました');
                    return;
                }
                const data = await res.json();
                const store = data.store;
                setStoreName(store.name);
                setInitialData({
                    name: store.name,
                    address: store.address,
                    area: store.area,
                    is_open_now: store.is_open_now ?? true,
                    phone_number: store.phone_number || '',
                    display_brand_ids: store.display_brand_ids || [],
                    description: store.description || '',
                    site_url: store.site_url || '',
                    business_hours: store.business_hours || '',
                });
            } catch (err) {
                console.error('Error fetching store:', err);
                setError('店舗データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [storeId]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 pb-20 text-center">
                    <p className="text-gray-500 text-lg">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        router.replace('/dabot/login');
        return null;
    }

    if (error && !initialData) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 pb-20 text-center">
                    <p className="text-red-500 text-lg mb-8">{error}</p>
                    <Link
                        href={`/dabot/stores/${storeId}`}
                        className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                    >
                        店舗詳細に戻る
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (formData: StoreFormData) => {
        setError(null);

        try {
            const response = await fetch(`/api/stores/${storeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    address: formData.address,
                    area: formData.area,
                    is_open_now: formData.is_open_now,
                    phone_number: formData.phone_number || null,
                    brand_number: formData.display_brand_ids.length,
                    display_brand_ids: formData.display_brand_ids,
                    description: formData.description || null,
                    site_url: formData.site_url || null,
                    business_hours: formData.business_hours || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || '店舗の更新に失敗しました');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push(`/dabot/stores/${storeId}`);
            }, 2000);
        } catch (err) {
            console.error('Error updating store:', err);
            setError(err instanceof Error ? err.message : '店舗の更新に失敗しました');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-2xl">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/dabot" className="hover:text-black transition-colors">ホーム</Link>
                        <span>/</span>
                        <Link href="/dabot/stores" className="hover:text-black transition-colors">店舗一覧</Link>
                        <span>/</span>
                        <Link href={`/dabot/stores/${storeId}`} className="hover:text-black transition-colors">{storeName}</Link>
                        <span>/</span>
                        <span className="text-black font-medium">編集</span>
                    </div>

                    {/* Page Title */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            EDIT STORE
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            店舗情報編集
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-8 p-4 bg-green-50 border-2 border-green-500 text-green-700">
                            店舗情報を更新しました。店舗詳細ページに移動します...
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border-2 border-red-500 text-red-700">
                            {error}
                        </div>
                    )}

                    {initialData && (
                        <StoreForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            submitLabel="更新する"
                            loadingLabel="更新中..."
                            cancelHref={`/dabot/stores/${storeId}`}
                        />
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
