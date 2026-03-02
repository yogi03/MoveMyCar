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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                console.log("Firebase user logged in:", firebaseUser.uid);
                console.log("Supabase URL present:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
                console.log("Supabase Anon Key present:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

                setUser(firebaseUser);

                // Sync with Supabase
                const { data, error } = await supabase
                    .from("users")
                    .upsert({
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName,
                    }, { onConflict: "id" })
                    .select()
                    .single();

                if (error) {
                    console.error("Supabase sync error (full):", JSON.stringify(error, Object.getOwnPropertyNames(error)));
                } else {
                    console.log("User successfully synced to Supabase:", data);
                }
            } else {
                console.log("No Firebase user found.");
                setUser(null);
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

    return { user, loading, loginWithGoogle, logout };
}
