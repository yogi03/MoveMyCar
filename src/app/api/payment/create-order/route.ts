import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
    try {
        const { plan, cycle } = await req.json();

        let amount = 0;
        if (plan === 'BASIC') {
            amount = cycle === 'monthly' ? 5 : 49;
        } else if (plan === 'ADVANCED') {
            amount = cycle === 'monthly' ? 8 : 79;
        }

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
