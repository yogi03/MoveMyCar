"use client";

import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export function useFCM(userId: string | undefined) {
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const requestPermission = async () => {
            try {
                if (typeof window === "undefined" || !("Notification" in window)) return;

                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    const messaging = getMessaging(app);
                    const currentToken = await getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                    });

                    if (currentToken) {
                        setFcmToken(currentToken);
                        // Save to Supabase
                        await supabase.from("user_tokens").upsert({
                            user_id: userId,
                            fcm_token: currentToken,
                        }, { onConflict: "fcm_token" });
                    }
                }
            } catch (error) {
                console.error("FCM Error:", error);
            }
        };

        requestPermission();

        // Listen for foreground messages
        if (typeof window !== "undefined") {
            try {
                const messaging = getMessaging(app);
                const unsubscribe = onMessage(messaging, (payload) => {
                    toast((t) => (
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 flex-shrink-0">
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="w-full h-full object-contain rounded"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold">{payload.notification?.title}</span>
                                <span className="text-sm">{payload.notification?.body}</span>
                            </div>
                        </div>
                    ), {
                        duration: 6000,
                    });
                });
                return () => unsubscribe();
            } catch (err) {
                console.log("FCM messaging not supported in this browser");
            }
        }
    }, [userId]);

    return { fcmToken };
}
