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
    const [userPlan, setUserPlan] = useState<{
        plan: string,
        subscription_end: string | null,
        upcoming_subscriptions: any[]
    }>({ plan: 'FREE', subscription_end: null, upcoming_subscriptions: [] });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                // Sync with Supabase and get plan info
                await supabase.from("users").upsert({
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                }, { onConflict: "id" });

                await refreshPlan(firebaseUser.uid);
            } else {
                setUser(null);
                setUserPlan({ plan: 'FREE', subscription_end: null, upcoming_subscriptions: [] });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refreshPlan = async (uid?: string) => {
        const userId = uid || user?.uid;
        if (!userId) return;

        let { data, error } = await supabase
            .from("users")
            .select("plan, subscription_end, upcoming_subscriptions")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Supabase plan fetch error:", error);
            return;
        }

        if (data) {
            // Auto-activation logic for multi-queued subs
            const now = new Date();
            const hasExpired = data.subscription_end && new Date(data.subscription_end) <= now;
            const queue = Array.isArray(data.upcoming_subscriptions) ? data.upcoming_subscriptions : [];

            if (hasExpired && queue.length > 0) {
                const nextSub = queue[0];
                const newQueue = queue.slice(1);

                const newSubscriptionEnd = new Date();
                if (nextSub.cycle === 'monthly') {
                    newSubscriptionEnd.setMonth(newSubscriptionEnd.getMonth() + 1);
                } else {
                    newSubscriptionEnd.setFullYear(newSubscriptionEnd.getFullYear() + 1);
                }

                const { data: updated, error: updateError } = await supabase
                    .from("users")
                    .update({
                        plan: nextSub.plan,
                        subscription_end: newSubscriptionEnd.toISOString(),
                        upcoming_subscriptions: newQueue,
                    })
                    .eq("id", userId)
                    .select("plan, subscription_end, upcoming_subscriptions")
                    .single();

                if (!updateError && updated) {
                    data = updated;
                }
            }

            setUserPlan({
                plan: data.plan || 'FREE',
                subscription_end: data.subscription_end,
                upcoming_subscriptions: Array.isArray(data.upcoming_subscriptions) ? data.upcoming_subscriptions : []
            });
        }
    };

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

    return { user, loading, loginWithGoogle, logout, userPlan, refreshPlan };
}
