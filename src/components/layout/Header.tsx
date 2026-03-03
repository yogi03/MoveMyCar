"use client";

import { useAuth } from "@/hooks/use-auth";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const { user, loading, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Logo />

                <div className="flex items-center gap-4">
                    {!loading && (
                        <>
                            {!user ? (
                                <Link href="/login">
                                    <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900 px-6">
                                        Login
                                    </Button>
                                </Link>
                            ) : (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center gap-2 group focus:outline-none"
                                    >
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-yellow-500 transition-colors">
                                            {user.photoURL ? (
                                                <Image
                                                    src={user.photoURL}
                                                    alt={user.displayName || "User"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                    <UserIcon className="w-6 h-6 text-zinc-400" />
                                                </div>
                                            )}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-zinc-500 group-hover:text-white transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-2 overflow-hidden"
                                            >
                                                <div className="px-3 py-2 border-b border-zinc-900 mb-1">
                                                    <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                                                    <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors group"
                                                >
                                                    <LogOut className="w-4 h-4 group-hover:text-yellow-500" />
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
