'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getCurrentUser, signOut as amplifySignOut, type AuthUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const checkUser = useCallback(async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    useEffect(() => {
        const hubListener = Hub.listen('auth', ({ payload }) => {
            if (payload.event === 'signedIn') {
                checkUser();
            } else if (payload.event === 'signedOut') {
                setUser(null);
            }
        });
        return () => hubListener();
    }, [checkUser]);

    const handleSignOut = useCallback(async () => {
        await amplifySignOut();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
            {children}
        </AuthContext.Provider>
    );
}
