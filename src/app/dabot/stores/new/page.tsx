'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { StoreForm, type StoreFormData } from '@/components/StoreForm';

export default function NewStorePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        router.replace('/dabot/login');
        return null;
    }

    const handleSubmit = async (formData: StoreFormData) => {
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
                throw new Error(data.error || '店舗の登録に失敗しました');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dabot/stores');
            }, 2000);
        } catch (err) {
            console.error('Error creating store:', err);
            setError(err instanceof Error ? err.message : '店舗の登録に失敗しました');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

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

                    <StoreForm
                        onSubmit={handleSubmit}
                        submitLabel="店舗を登録する"
                        loadingLabel="登録中..."
                        cancelHref="/dabot/stores"
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
