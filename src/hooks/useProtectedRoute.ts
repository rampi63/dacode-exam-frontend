"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const useProtectedRoute = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user === null) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    return { user, loading };
};