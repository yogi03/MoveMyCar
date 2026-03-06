"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ArrowRight, ShieldCheck, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, differenceInDays } from "date-fns";

interface SubscriptionStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    userPlan: {
        plan: string;
        subscription_end: string | null;
        upcoming_subscriptions?: any[];
    };
    onManage: () => void;
}

export default function SubscriptionStatusModal({ isOpen, onClose, userPlan, onManage }: SubscriptionStatusModalProps) {
    if (!isOpen) return null;

    const expiryDate = userPlan.subscription_end ? new Date(userPlan.subscription_end) : null;
    const daysRemaining = expiryDate ? differenceInDays(expiryDate, new Date()) : 0;
    const isExpiringSoon = daysRemaining >= 0 && daysRemaining < 10;
    const queue = Array.isArray(userPlan.upcoming_subscriptions) ? userPlan.upcoming_subscriptions : [];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-zinc-950 border border-zinc-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Plan Status</h2>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Current Plan */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Current Plan</span>
                                <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${userPlan.plan === 'FREE' ? 'border-zinc-800 text-zinc-500' : userPlan.plan === 'BASIC' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5' : 'border-purple-500/50 text-purple-500 bg-purple-500/5'}`}>
                                    {userPlan.plan}
                                </div>
                            </div>

                            <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-900 flex items-start gap-4">
                                <div className="p-3 bg-zinc-900 rounded-xl">
                                    <ShieldCheck className={`w-6 h-6 ${userPlan.plan === 'FREE' ? 'text-zinc-500' : userPlan.plan === 'BASIC' ? 'text-yellow-500' : 'text-purple-500'}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{userPlan.plan} Plan</h3>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {userPlan.plan === 'FREE'
                                            ? "Basic access for individuals"
                                            : `Active ${userPlan.plan.toLowerCase()} features`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Expiry Info */}
                        {expiryDate && userPlan.plan !== 'FREE' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Expiry Date</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className={`text-lg font-black ${isExpiringSoon ? 'text-red-500' : 'text-white'}`}>
                                        {format(expiryDate, "MMMM d, yyyy")}
                                    </p>
                                    <p className={`text-xs font-medium ${isExpiringSoon ? 'text-red-500/80' : 'text-zinc-500'}`}>
                                        {daysRemaining > 0
                                            ? `Expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
                                            : daysRemaining === 0 ? "Expires today" : "Expired"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Upcoming Subscriptions Queue */}
                        {queue.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-yellow-500">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Upcoming Subscriptions ({queue.length})</span>
                                </div>
                                <div className="space-y-3">
                                    {queue.map((sub: any, index: number) => (
                                        <div key={index} className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-600 group-hover:text-yellow-500 transition-colors">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{sub.plan} ({sub.cycle})</p>
                                                    <p className="text-[10px] text-zinc-600 uppercase tracking-tighter tracker-white">Purchased {format(new Date(sub.purchased_at), "MMM d")}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-zinc-800" />
                                        </div>
                                    ))}
                                    <p className="text-[10px] text-zinc-500 italic text-center px-4">Plans will activate sequentially as each current plan expires.</p>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={() => {
                                onManage();
                                onClose();
                            }}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black h-12 rounded-xl"
                        >
                            Manage Subscription
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
