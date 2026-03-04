"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black flex flex-col">
            <Header />

            <main className="flex-grow pt-20 pb-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                            Privacy <span className="text-yellow-500">Policy</span>
                        </h1>
                        <p className="text-zinc-500 text-sm">Last updated: March 04, 2026</p>

                        <div className="max-w-none space-y-12">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Welcome to MoveMyCar. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    We collect minimal information necessary to provide our service:
                                </p>
                                <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                                    <li>Account Information: Name, email, and profile picture (via Google Authentication).</li>
                                    <li>Vehicle Information: License plate number and vehicle description.</li>
                                    <li>Usage Data: Information on how you interact with our platform.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">3. How We Use Your Information</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Your information is used to:
                                </p>
                                <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                                    <li>Facilitate anonymous alerts between users.</li>
                                    <li>Personalize your dashboard experience.</li>
                                    <li>Improve our service and user interface.</li>
                                    <li>Send important service-related notifications.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">5. Third-Party Services</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    We use Firebase for authentication and database management, and Supabase for real-time synchronization. These services have their own privacy policies.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    If you have any questions about this Privacy Policy, please contact us at yogendrachaurasiya30@gmail.com.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
