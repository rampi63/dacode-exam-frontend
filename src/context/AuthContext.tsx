"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, gql } from "@apollo/client";

const GET_ME = gql`
    query GetMe {
        me {
            id
            email
        }
    }
`;

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const router = useRouter();

    useQuery(GET_ME, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            if (data?.me) {
                setUser(data.me);
            } else {
                setUser(null);
            }
            setInitialLoading(false);
        },
        onError: () => {
            setUser(null);
            setInitialLoading(false);
        },
    });

    const logout = async () => {

        try {
            await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `mutation { logout }`,
                }),
            });
        } catch (err) {
            console.error("❌ Error al cerrar sesión:", err);
        }

        document.cookie = 'accessToken=; Max-Age=0; path=/';
        document.cookie = 'refreshToken=; Max-Age=0; path=/';

        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading: initialLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("error useAuth");
    return context;
};