"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Github, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6 col-span-1 md:col-span-1">
                        <Logo />
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                            The smartest way to handle parking blocks. Just one scan, one alert, and no phone numbers exposed.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon href="#" icon={<Twitter className="w-5 h-5" />} />
                            <SocialIcon href="#" icon={<Instagram className="w-5 h-5" />} />
                            <SocialIcon href="#" icon={<Github className="w-5 h-5" />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg">Product</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/#how-it-works">How it Works</FooterLink>
                            <FooterLink href="/login">Get Started</FooterLink>
                            <FooterLink href="/dashboard">Dashboard</FooterLink>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg">Company</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg">Support</h4>
                        <div className="flex items-center gap-3 text-zinc-500 hover:text-yellow-500 transition-colors cursor-pointer group">
                            <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-yellow-500/10 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span className="text-sm">yogendrachaurasiya30@gmail.com</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-xs">
                        © 2026 Move My Car. All rights reserved.
                    </p>
                    <p className="text-zinc-600 text-xs">
                        Built with <span className="text-yellow-500 font-bold">Premium Aesthetics</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="text-zinc-500 hover:text-yellow-500 transition-colors text-sm"
            >
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="p-2 bg-zinc-900 rounded-xl text-zinc-500 hover:text-yellow-500 hover:bg-zinc-800 transition-all"
        >
            {icon}
        </a>
    );
}
