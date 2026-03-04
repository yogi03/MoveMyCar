"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, MessageSquare, MapPin, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || "Failed to send message");

            setSent(true);
            toast.success("Message sent successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black flex flex-col">
            <Header />

            <main className="flex-grow pt-20 pb-32">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center space-y-6 mb-20">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                            Get in <span className="text-yellow-500">Touch</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Have questions or feedback? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold">Contact Information</h2>
                                <p className="text-zinc-500 leading-relaxed">
                                    Fill out the form and our team will get back to you within 24 hours.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <ContactItem
                                    icon={<Mail className="w-6 h-6 text-yellow-500" />}
                                    title="Email"
                                    detail="yogendrachaurasiya30@gmail.com"
                                />
                                <ContactItem
                                    icon={<MessageSquare className="w-6 h-6 text-yellow-500" />}
                                    title="Support"
                                    detail="Available 24/7"
                                />
                                <ContactItem
                                    icon={<MapPin className="w-6 h-6 text-yellow-500" />}
                                    title="Location"
                                    detail="New Delhi, India"
                                />
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-12 rounded-3xl relative overflow-hidden">
                            {!sent ? (
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Message</label>
                                        <textarea
                                            rows={4}
                                            name="message"
                                            required
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                                            placeholder="How can we help?"
                                        ></textarea>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-14 rounded-xl text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            ) : (
                                <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto border border-yellow-500/20">
                                        <Send className="w-10 h-10 text-yellow-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-bold text-white">Message Sent!</h3>
                                        <p className="text-zinc-500">
                                            Thank you for reaching out. We'll get back to you soon.
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-zinc-800 text-zinc-400 hover:text-white"
                                        onClick={() => setSent(false)}
                                    >
                                        Send another message
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ContactItem({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: string }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-white">{title}</h4>
                <p className="text-zinc-500">{detail}</p>
            </div>
        </div>
    );
}
