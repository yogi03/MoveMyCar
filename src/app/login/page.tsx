"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogIn } from "lucide-react";
import Header from "@/components/layout/Header";

export default function LoginPage() {
    const { user, loginWithGoogle, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            // Error is handled in hook
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-yellow-500/20 bg-zinc-950 text-white">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold tracking-tight text-yellow-500">
                            MoveMyCar
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Smart QR Parking Alert System
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-6 transition-all duration-200"
                        >
                            <LogIn className="mr-2 h-5 w-5" />
                            Continue with Google
                        </Button>
                        <p className="text-xs text-center mt-6 text-zinc-500">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
