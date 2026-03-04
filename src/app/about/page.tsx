"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Car, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black flex flex-col">
            <Header />

            <main className="flex-grow pt-20 pb-32">
                <div className="max-w-4xl mx-auto px-6 space-y-16">
                    {/* Hero */}
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                            About <span className="text-yellow-500">Move My Car</span>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            We're on a mission to make urban parking less stressful and more secure through smart technology.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="grid md:grid-cols-2 gap-12 items-center py-8">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Solving the Parking Puzzle</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                How many times have you been blocked in a parking spot, or had to block someone else? MoveMyCar was born from the frustration of traditional parking notifications—either exposing your private phone number on your dashboard or having no way at all for people to reach you.
                            </p>
                            <p className="text-zinc-400 leading-relaxed">
                                Our solution is simple: a unique QR code for every vehicle that allows anyone to send an instant, anonymous alert to the owner. No apps to download for the scanner, and complete privacy for the owner.
                            </p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 flex items-center justify-center">
                            <Car className="w-32 h-32 text-yellow-500 opacity-20" />
                        </div>
                    </div>

                    {/* Values */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <ValueCard
                            icon={<ShieldCheck className="w-10 h-10 text-yellow-500" />}
                            title="Privacy First"
                            description="We never share your personal information. Communication is entirely anonymous."
                        />
                        <ValueCard
                            icon={<Zap className="w-10 h-10 text-yellow-500" />}
                            title="Instant Alerts"
                            description="Real-time push notifications ensure you're reached the moment you're needed."
                        />
                        <ValueCard
                            icon={<Car className="w-10 h-10 text-yellow-500" />}
                            title="Universal"
                            description="Works for any vehicle, anywhere. All you need is a printed QR card."
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-2xl hover:border-yellow-500/30 transition-all group">
            <div className="mb-6">{icon}</div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-500 transition-colors">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
