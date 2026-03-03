"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            <Image
                src="/logo.png"
                alt="MoveMyCar Logo"
                width={150}
                height={60}
                className="rounded-lg object-contain w-auto h-auto max-h-[60px]"
                priority
            />
            {/* <span className="text-xl font-bold tracking-tight text-white">MoveMyCar</span> */}
        </Link>
    );
}
