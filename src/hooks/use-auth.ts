"use client";

import { useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    User
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userPlan, setUserPlan] = useState<{ plan: string, subscription_end: string | null }>({ plan: 'FREE', subscription_end: null });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                // Sync with Supabase and get plan info
                const { data, error } = await supabase
                    .from("users")
                    .upsert({
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName,
                    }, { onConflict: "id" })
                    .select("plan, subscription_end")
                    .single();

                if (error) {
                    console.error("Supabase sync error:", error);
                } else if (data) {
                    setUserPlan({
                        plan: data.plan || 'FREE',
                        subscription_end: data.subscription_end
                    });
                }
            } else {
                setUser(null);
                setUserPlan({ plan: 'FREE', subscription_end: null });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return { user, loading, loginWithGoogle, logout, userPlan };
}
