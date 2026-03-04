"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black flex flex-col">
            <Header />

            <main className="flex-grow pt-20 pb-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                            Terms of <span className="text-yellow-500">Service</span>
                        </h1>
                        <p className="text-zinc-500 text-sm">Last updated: March 04, 2026</p>

                        <div className="max-w-none space-y-12">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    By accessing or using MoveMyCar, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">2. Description of Service</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    MoveMyCar provides a platform for vehicle owners to receive anonymous notifications via QR codes scanned by third parties.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">3. User Responsibilities</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    As a user, you agree to:
                                </p>
                                <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                                    <li>Provide accurate information during registration.</li>
                                    <li>Use the service only for its intended purpose of parking notifications.</li>
                                    <li>Not harass or abuse other users through the platform.</li>
                                    <li>Maintain the security of your account.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">4. Intellectual Property</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    All content, logos, and technology on MoveMyCar are the property of MoveMyCar and protected by copyright and other intellectual property laws.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">5. Limitation of Liability</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    MoveMyCar is provided "as is" without any warranties. We are not liable for any damages arising from the use or inability to use our service.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">6. Termination</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms of Service.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">7. Changes to Terms</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    We may update these Terms of Service from time to time. Your continued use of the service after such changes constitutes acceptance of the new terms.
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
