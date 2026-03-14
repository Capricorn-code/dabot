'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';

type AuthStep = 'signIn' | 'signUp' | 'confirmSignUp';

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState<AuthStep>('signIn');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Already logged in -> redirect
    if (user) {
        router.replace('/dabot/mypage');
        return null;
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await signIn({ username: email, password });
            if (result.isSignedIn) {
                router.replace('/dabot/mypage');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'サインインに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await signUp({
                username: email,
                password,
            });
            if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                setStep('confirmSignUp');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'サインアップに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await confirmSignUp({ username: email, confirmationCode: confirmCode });
            // Auto sign in after confirmation
            const result = await signIn({ username: email, password });
            if (result.isSignedIn) {
                router.replace('/dabot/mypage');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '確認に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-md">
                    <div className="mb-12">
                        <h1 className="text-5xl font-black italic tracking-tight mb-4">
                            {step === 'signIn' ? 'SIGN IN' : step === 'signUp' ? 'SIGN UP' : 'VERIFY'}
                        </h1>
                        <p className="text-gray-600 text-sm tracking-wide">
                            {step === 'signIn'
                                ? 'アカウントにサインイン'
                                : step === 'signUp'
                                    ? '新規アカウント作成'
                                    : '確認コードを入力してください'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {step === 'signIn' && (
                        <form onSubmit={handleSignIn} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    メールアドレス
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="example@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    パスワード
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="8文字以上（大文字・小文字・数字・記号）"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-8 py-4 bg-black text-white font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                            >
                                {loading ? 'サインイン中...' : 'サインイン'}
                            </button>
                            <p className="text-center text-sm text-gray-600">
                                アカウントをお持ちでない方は{' '}
                                <button
                                    type="button"
                                    onClick={() => { setStep('signUp'); setError(null); }}
                                    className="font-bold underline hover:text-black"
                                >
                                    新規登録
                                </button>
                            </p>
                        </form>
                    )}

                    {step === 'signUp' && (
                        <form onSubmit={handleSignUp} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    メールアドレス
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="example@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    パスワード
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="8文字以上（大文字・小文字・数字・記号）"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    8文字以上、大文字・小文字・数字・記号を含む
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-8 py-4 bg-black text-white font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                            >
                                {loading ? '登録中...' : 'アカウント作成'}
                            </button>
                            <p className="text-center text-sm text-gray-600">
                                アカウントをお持ちの方は{' '}
                                <button
                                    type="button"
                                    onClick={() => { setStep('signIn'); setError(null); }}
                                    className="font-bold underline hover:text-black"
                                >
                                    サインイン
                                </button>
                            </p>
                        </form>
                    )}

                    {step === 'confirmSignUp' && (
                        <form onSubmit={handleConfirmSignUp} className="space-y-6">
                            <p className="text-sm text-gray-600">
                                <span className="font-bold">{email}</span> に確認コードを送信しました。
                            </p>
                            <div>
                                <label htmlFor="confirmCode" className="block text-sm font-medium text-gray-700 mb-2">
                                    確認コード
                                </label>
                                <input
                                    type="text"
                                    id="confirmCode"
                                    required
                                    value={confirmCode}
                                    onChange={(e) => setConfirmCode(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-8 py-4 bg-black text-white font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                            >
                                {loading ? '確認中...' : '確認する'}
                            </button>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
