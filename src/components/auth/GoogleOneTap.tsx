"use client";

import { useRef, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";
import Script from "next/script";

export default function GoogleOneTap() {
    const { user, loading } = useAuth();
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const isInitialized = useRef(false);

    const initializeOneTap = useCallback(() => {
        if (typeof window !== "undefined" && window.google && !isInitialized.current && clientId) {
            isInitialized.current = true;
            console.log("Initializing Google One Tap...");

            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: async (response: { credential: string }) => {
                    try {
                        const credential = GoogleAuthProvider.credential(response.credential);
                        await signInWithCredential(auth, credential);
                        console.log("Successfully signed in with Google One Tap");
                    } catch (error) {
                        console.error("Error signing in with Google One Tap:", error);
                    }
                },
                auto_select: false,
                use_fedcm_for_prompt: true,
                itp_support: true,
            });

            window.google.accounts.id.prompt((notification: {
                isNotDisplayed: () => boolean;
                getNotDisplayedReason: () => string;
                isSkippedMoment: () => boolean;
                getSkippedReason: () => string;
                isDismissedMoment: () => boolean;
                getDismissedReason: () => string;
            }) => {
                if (notification.isNotDisplayed()) {
                    const reason = notification.getNotDisplayedReason();
                    console.warn("One Tap not displayed:", reason);

                    if (reason === "skipped_moment" || reason === "suppressed_by_user") {
                        console.log("One Tap was recently dismissed by the user. It will reappear after a cooling period.");
                    }

                    isInitialized.current = false;
                } else if (notification.isSkippedMoment()) {
                    console.log("One Tap skipped moment:", notification.getSkippedReason());
                    isInitialized.current = false;
                } else if (notification.isDismissedMoment()) {
                    console.log("One Tap dismissed moment:", notification.getDismissedReason());
                    isInitialized.current = false;
                }
            });
        }
    }, [clientId]);

    useEffect(() => {
        if (loading || user || !clientId || isInitialized.current) return;

        if (window.google) {
            initializeOneTap();
        }
    }, [user, loading, clientId, initializeOneTap]);

    if (user || !clientId) return null;

    return (
        <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
            onLoad={() => {
                console.log("Google One Tap script loaded from onLoad");
                initializeOneTap();
            }}
        />
    );
}

// Declare the google global variable for TypeScript
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => Promise<void> | void;
                        auto_select?: boolean;
                        use_fedcm_for_prompt?: boolean;
                        itp_support?: boolean;
                    }) => void;
                    prompt: (callback: (notification: {
                        isNotDisplayed: () => boolean;
                        getNotDisplayedReason: () => string;
                        isSkippedMoment: () => boolean;
                        getSkippedReason: () => string;
                        isDismissedMoment: () => boolean;
                        getDismissedReason: () => string;
                    }) => void) => void;
                };
            };
        };
    }
}
