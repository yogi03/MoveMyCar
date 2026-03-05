import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { adminMessaging } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const { qr_code_id } = await req.json();

        if (!qr_code_id) {
            return NextResponse.json({ error: "Missing QR ID" }, { status: 400 });
        }

        // 1. Fetch vehicle and check anti-spam
        const { data: vehicle, error: vError } = await supabase
            .from("vehicles")
            .select("id, user_id, last_alert_at, vehicle_number")
            .eq("qr_code_id", qr_code_id)
            .single();

        if (vError || !vehicle) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        // Anti-spam: Max 1 alert per 2 minutes
        if (vehicle.last_alert_at) {
            const lastAlert = new Date(vehicle.last_alert_at).getTime();
            const now = new Date().getTime();
            const diffMinutes = (now - lastAlert) / (1000 * 60);

            if (diffMinutes < 2) {
                return NextResponse.json(
                    { error: "Please wait 2 minutes between alerts." },
                    { status: 429 }
                );
            }
        }

        // 2. Fetch owner tokens
        const { data: tokens, error: tError } = await supabase
            .from("user_tokens")
            .select("fcm_token")
            .eq("user_id", vehicle.user_id);

        if (tError || !tokens || tokens.length === 0) {
            // Still log the alert even if no tokens found
            await logAlert(vehicle.id);
            return NextResponse.json({ message: "Alert logged, but owner hasn't enabled notifications yet." });
        }

        // 3. Send Notifications
        const fcmTokens = tokens.map(t => t.fcm_token);
        const message = {
            notification: {
                title: "Your vehicle is blocking someone 🚗",
                body: `Someone requested you to move your ${vehicle.vehicle_number}.`,
                icon: "/logo.png",
            },
            tokens: fcmTokens,
        };

        const response = await adminMessaging.sendEachForMulticast({
            ...message,
            android: {
                notification: {
                    tag: "move-my-car-alert",
                    icon: "/logo.png",
                },
            },
            webpush: {
                notification: {
                    tag: "move-my-car-alert",
                    renotify: true,
                    icon: "/logo.png",
                },
            },
        });

        // 4. Log alert and update last_alert_at
        await logAlert(vehicle.id);
        await supabase
            .from("vehicles")
            .update({ last_alert_at: new Date().toISOString() })
            .eq("id", vehicle.id);

        return NextResponse.json({
            success: true,
            sentCount: response.successCount
        });

    } catch (error: any) {
        console.error("Notify error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

async function logAlert(vehicleId: string) {
    await supabase.from("alert_logs").insert({
        vehicle_id: vehicleId,
        alert_type: "MOVE_REQUEST"
    });
}
