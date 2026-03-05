import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { adminMessaging } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const { qr_code_id } = await req.json();

        if (!qr_code_id) {
            return NextResponse.json({ error: "Missing QR ID" }, { status: 400 });
        }

        // 1. Fetch vehicle and owner's last app opening status
        const { data: vehicle, error: vError } = await supabase
            .from("vehicles")
            .select(`
                id, 
                user_id, 
                last_alert_at, 
                active_alert_count,
                vehicle_number,
                users (last_app_opened_at)
            `)
            .eq("qr_code_id", qr_code_id)
            .single();

        if (vError || !vehicle) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        const ownerData = vehicle.users as any;
        const lastAppOpened = ownerData?.last_app_opened_at ? new Date(ownerData.last_app_opened_at).getTime() : 0;
        const lastAlert = vehicle.last_alert_at ? new Date(vehicle.last_alert_at).getTime() : 0;

        let currentCount = vehicle.active_alert_count || 0;

        // Reset counter if owner opened the app after the last alert
        if (lastAppOpened > lastAlert) {
            currentCount = 0;
        }

        // Anti-spam: 15 seconds cooldown
        const now = new Date().getTime();
        const diffSeconds = (now - lastAlert) / 1000;

        if (diffSeconds < 15) {
            return NextResponse.json(
                { error: "Please wait 15 seconds between alerts." },
                { status: 429 }
            );
        }

        // Check limit: 5 alerts
        if (currentCount >= 5) {
            return NextResponse.json(
                { error: "Maximum alerts reached (5/5). Please wait for the owner to arrive." },
                { status: 429 }
            );
        }

        // 2. Fetch owner tokens
        const { data: tokens, error: tError } = await supabase
            .from("user_tokens")
            .select("fcm_token")
            .eq("user_id", vehicle.user_id);

        if (tError || !tokens || tokens.length === 0) {
            await logAlert(vehicle.id);
            return NextResponse.json({ message: "Alert logged, but owner hasn't enabled notifications yet." });
        }

        // 3. Send Notifications
        const nextCount = currentCount + 1;
        const fcmTokens = tokens.map(t => t.fcm_token);
        const message = {
            notification: {
                title: `🚗 Parking Alert (${nextCount} requests)`,
                body: `Someone is waiting for you to move your ${vehicle.vehicle_number}.`,
            },
            tokens: fcmTokens,
        };

        const response = await adminMessaging.sendEachForMulticast(message);

        // 4. Log alert and update vehicle status
        await logAlert(vehicle.id);
        await supabase
            .from("vehicles")
            .update({
                last_alert_at: new Date().toISOString(),
                active_alert_count: nextCount
            })
            .eq("id", vehicle.id);

        return NextResponse.json({
            success: true,
            sentCount: response.successCount,
            alertCount: nextCount
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
