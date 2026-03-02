"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { AlertTriangle, CheckCircle2, Info, Car, Bike, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function PublicScanPage({ params }: { params: Promise<{ qr_code_id: string }> }) {
    const { qr_code_id } = use(params);
    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVehicle();
    }, [qr_code_id]);

    const fetchVehicle = async () => {
        try {
            console.log("Fetching vehicle with QR ID:", qr_code_id);
            const { data, error } = await supabase
                .from("vehicles")
                .select("vehicle_number, vehicle_type, nickname")
                .eq("qr_code_id", qr_code_id)
                .single();

            if (error) {
                console.error("Supabase error fetching vehicle:", error);
                throw error;
            }
            console.log("Vehicle data found:", data);
            setVehicle(data);
        } catch (err: any) {
            console.error("Catch block error:", err);
            setError("Vehicle not found or invalid QR code.");
        } finally {
            setLoading(false);
        }
    };

    const handleNotify = async () => {
        setSending(true);
        try {
            const res = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qr_code_id: qr_code_id }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to notify owner");
            }

            setSent(true);
            toast.success("Owner notified!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-500"></div>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Invalid QR Code</h2>
                <p className="text-zinc-400 max-w-xs">{error || "This vehicle link is no longer active."}</p>
                <Button className="mt-8 bg-yellow-500 text-black font-bold" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <header className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-6">
                        <span className="text-black font-bold text-2xl">M</span>
                    </div>
                    <h1 className="text-3xl font-bold text-yellow-500">MoveMyCar</h1>
                    <p className="text-zinc-400">Owner Notification System</p>
                </header>

                <Card className="border-yellow-500/20 bg-zinc-950 text-white shadow-xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto p-4 bg-zinc-900 rounded-full w-fit mb-4">
                            {vehicle.vehicle_type === "Car" ? (
                                <Car className="h-10 w-10 text-yellow-500" />
                            ) : (
                                <Bike className="h-10 w-10 text-yellow-500" />
                            )}
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-widest text-white">
                            {vehicle.vehicle_number}
                        </CardTitle>
                        <CardDescription className="text-zinc-500 font-medium">
                            {vehicle.nickname || vehicle.vehicle_type}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        {!sent ? (
                            <>
                                <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-lg flex gap-3 items-start">
                                    <Info className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        By clicking below, the owner will receive a push notification on their device to move this vehicle.
                                    </p>
                                </div>

                                <Button
                                    onClick={handleNotify}
                                    disabled={sending}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-black font-bold py-8 transition-all duration-200"
                                >
                                    <AlertTriangle className="mr-2 h-6 w-6" />
                                    🚨 Request to Move Vehicle
                                </Button>
                            </>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-lg text-center space-y-4">
                                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">Owner Notified!</h3>
                                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                                        Your request has been sent. Please wait for the owner to arrive.
                                    </p>
                                </div>
                            </div>
                        )}

                        <p className="text-[10px] text-center text-zinc-600">
                            Your personal information is not shared with the owner.
                        </p>
                    </CardContent>
                </Card>

                {sent && (
                    <Button
                        variant="ghost"
                        className="w-full text-zinc-500 hover:text-white"
                        onClick={() => setSent(false)}
                    >
                        Send another request
                    </Button>
                )}
            </div>
        </div>
    );
}
