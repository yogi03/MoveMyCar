import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            plan,
            cycle
        } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Check if user has an active subscription
            const { data: user } = await supabase
                .from("users")
                .select("plan, subscription_end, upcoming_subscriptions")
                .eq("id", userId)
                .single();

            const isSubscriptionActive = user?.subscription_end && new Date(user.subscription_end) > new Date() && user.plan !== 'FREE';

            if (isSubscriptionActive) {
                // Queue the new subscription in the JSONB array
                const queue = Array.isArray(user.upcoming_subscriptions) ? user.upcoming_subscriptions : [];
                const updatedQueue = [
                    ...queue,
                    { plan, cycle, purchased_at: new Date().toISOString() }
                ];

                const { error } = await supabase
                    .from("users")
                    .update({
                        upcoming_subscriptions: updatedQueue,
                    })
                    .eq("id", userId);
                if (error) throw error;
            } else {
                // Update user plan immediately
                const subscriptionEnd = new Date();
                if (cycle === 'monthly') {
                    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
                } else {
                    subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
                }

                const { error } = await supabase
                    .from("users")
                    .update({
                        plan: plan,
                        subscription_end: subscriptionEnd.toISOString(),
                        upcoming_subscriptions: [], // Reset queue if starting fresh
                    })
                    .eq("id", userId);

                if (error) throw error;
            }

            return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
