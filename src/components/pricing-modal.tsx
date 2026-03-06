"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName?: string | null;
    userEmail?: string | null;
    currentPlan: string;
    subscriptionEnd?: string | null;
    onSuccess: () => void;
}

const PLANS = [
    {
        id: 'FREE',
        name: 'Free',
        price: 0,
        monthlyPrice: 0,
        yearlyPrice: 0,
        limit: 1,
        features: ['1 Vehicle Registration', 'Basic QR Alerts', 'Push Notifications'],
        icon: <Zap className="w-5 h-5 text-zinc-400" />,
        color: "zinc"
    },
    {
        id: 'BASIC',
        name: 'Basic',
        monthlyPrice: 5,
        yearlyPrice: 49,
        limit: 5,
        features: ['Up to 5 Vehicles', 'Priority Support', 'Custom Nicknames', 'Push Notifications'],
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        color: "yellow",
        popular: true
    },
    {
        id: 'ADVANCED',
        name: 'Advanced',
        monthlyPrice: 8,
        yearlyPrice: 79,
        limit: 20, // Example limit
        features: ['Up to 20 Vehicles', 'Advanced Fleet View', 'Push Notifications', 'Priority Escalation'],
        icon: <Crown className="w-5 h-5 text-purple-500" />,
        color: "purple"
    }
];

export default function PricingModal({ isOpen, onClose, userId, userName, userEmail, currentPlan, subscriptionEnd, onSuccess }: PricingModalProps) {
    const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState<string | null>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleSubscribe = async (planId: string) => {
        if (planId === 'FREE') return;
        setLoading(planId);

        try {
            const res = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId, cycle, currentPlan }),
            });

            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "Move My Car",
                description: `${planId} ${cycle} subscription`,
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...response,
                            userId,
                            plan: planId,
                            cycle
                        }),
                    });

                    if (verifyRes.ok) {
                        toast.success("Subscription activated!");
                        onSuccess();
                        onClose();
                    } else {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: userName || "",
                    email: userEmail || "",
                    contact: "",
                },
                theme: {
                    color: "#EAB308",
                },
                config: {
                    display: {
                        blocks: {
                            upi: {
                                name: "Pay via UPI",
                                instruments: [
                                    {
                                        method: "upi",
                                    },
                                ],
                            },
                        },
                        sequence: ["block.upi"],
                        preferences: {
                            show_default_blocks: true,
                        },
                    },
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Failed to initiate payment");
        } finally {
            setLoading(null);
        }
    };

    const isSubscriptionActive = () => {
        if (!subscriptionEnd) return false;
        return new Date(subscriptionEnd) > new Date();
    };

    const isPlanDisabled = (planId: string) => {
        return false; // All plans can be purchased and queued
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-zinc-950 border border-zinc-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                >
                    <div className="p-6 md:p-8 flex justify-between items-center border-b border-zinc-900 shrink-0">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">Choose Your Plan</h2>
                            <p className="text-sm md:text-base text-zinc-500">Upgrade to add more vehicles and unlock premium features.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
                        {/* Billing Toggle */}
                        <div className="flex justify-center">
                            <div className="bg-zinc-900 p-1 rounded-xl flex items-center gap-1">
                                <button
                                    onClick={() => setCycle('monthly')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${cycle === 'monthly' ? 'bg-yellow-500 text-black' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setCycle('yearly')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${cycle === 'yearly' ? 'bg-yellow-500 text-black' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Yearly <span className="text-[10px] ml-1 opacity-70">(Save ~20%)</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {PLANS.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`relative p-6 rounded-2xl border transition-all ${plan.popular ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-zinc-900 bg-zinc-900/20'}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-tighter">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2 rounded-lg ${plan.id === 'FREE' ? 'bg-zinc-800' : plan.id === 'BASIC' ? 'bg-yellow-500/10' : 'bg-purple-500/10'}`}>
                                            {plan.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    </div>

                                    <div className="mb-6">
                                        <span className="text-3xl md:text-4xl font-black text-white">
                                            ₹{cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                                        </span>
                                        <span className="text-zinc-500 text-sm ml-1">/{cycle === 'monthly' ? 'mo' : 'yr'}</span>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                                                <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.id !== 'FREE' ? 'text-yellow-500' : 'text-zinc-600'}`} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        disabled={loading === plan.id}
                                        onClick={() => handleSubscribe(plan.id)}
                                        className={`w-full h-12 font-bold rounded-xl transition-all ${plan.id === 'FREE' ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}
                                    >
                                        {loading === plan.id ? 'Processing...' : plan.id === 'FREE' ? 'Basic Access' : 'Get Started'}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Payment Methods Info */}
                        <div className="pt-4 border-t border-zinc-900 flex flex-col items-center gap-4 text-center">
                            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Secure payments via Razorpay</p>
                            <div className="flex flex-wrap justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-xs font-black italic tracking-tighter">UPI</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-[10px] font-bold uppercase">Cards</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-[10px] font-bold uppercase">NetBanking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-[10px] font-bold uppercase">Wallet</span>
                                </div>
                            </div>
                            <p className="text-zinc-600 text-[10px]">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
