"use client";

import { useRef, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";
import Script from "next/script";

export default function GoogleOneTap() {
    const { user, loading } = useAuth();
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const isInitialized = useRef(false);

    useEffect(() => {
        if (loading || user || !clientId || isInitialized.current) return;

        const handleCredentialResponse = async (response: any) => {
            try {
                const credential = GoogleAuthProvider.credential(response.credential);
                await signInWithCredential(auth, credential);
                console.log("Successfully signed in with Google One Tap");
            } catch (error) {
                console.error("Error signing in with Google One Tap:", error);
            }
        };

        const initializeOneTap = () => {
            if (typeof window !== "undefined" && window.google && !isInitialized.current) {
                isInitialized.current = true;
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: true,
                });

                window.google.accounts.id.prompt((notification: any) => {
                    if (notification.isNotDisplayed()) {
                        console.log("One Tap not displayed:", notification.getNotDisplayedReason());
                        isInitialized.current = false; // Allow retry if not displayed
                    }
                });
            }
        };

        // Attempt initialization if script is already present
        if (window.google) {
            initializeOneTap();
        }

    }, [user, loading, clientId]);

    if (user || !clientId) return null;

    return (
        <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
            onLoad={() => {
                // The useEffect will handle initialization if window.google is present, 
                // but this acts as an extra trigger when the script finishes loading.
                if (typeof window !== "undefined" && window.google && !isInitialized.current) {
                    // We don't call it here directly to avoid race conditions with useEffect,
                    // but we can check if it's already done.
                    console.log("Google One Tap script loaded");
                }
            }}
        />
    );
}

// Declare the google global variable for TypeScript
declare global {
    interface Window {
        google: any;
    }
}
