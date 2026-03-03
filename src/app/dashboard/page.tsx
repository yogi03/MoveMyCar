"use client";

import { useAuth } from "@/hooks/use-auth";
import { useFCM } from "@/hooks/use-fcm";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import VehicleForm from "@/components/vehicle-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { QrCode, Car, Bike, Plus } from "lucide-react";
import Header from "@/components/layout/Header";

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    useFCM(user?.uid);
    const [vehicle, setVehicle] = useState<any>(null);
    const [fetching, setFetching] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }

        if (user) {
            fetchVehicle();
        }
    }, [user, loading, router]);

    const fetchVehicle = async () => {
        const { data } = await supabase
            .from("vehicles")
            .select("*")
            .eq("user_id", user?.uid)
            .single();

        if (data) setVehicle(data);
        setFetching(false);
    };

    if (loading || fetching) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header />
            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <header>
                        <h1 className="text-3xl font-bold text-yellow-500">Dashboard</h1>
                        <p className="text-zinc-400">Welcome, {user?.displayName}</p>
                    </header>

                    {!vehicle ? (
                        <div className="space-y-6">
                            <div className="p-8 border-2 border-dashed border-zinc-800 rounded-xl text-center space-y-4">
                                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                                    <Plus className="h-8 w-8 text-yellow-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">No vehicle registered</h3>
                                    <p className="text-zinc-400">Register your vehicle to generate a QR code for parking alerts.</p>
                                </div>
                            </div>
                            <VehicleForm userId={user!.uid} />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-zinc-950 border-yellow-500/20 text-white">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">My Vehicle</CardTitle>
                                    {vehicle.vehicle_type === 'Car' ? <Car className="h-4 w-4 text-yellow-500" /> : <Bike className="h-4 w-4 text-yellow-500" />}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-500">{vehicle.vehicle_number}</div>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        {vehicle.nickname || vehicle.vehicle_type}
                                    </p>
                                    <div className="mt-6">
                                        <Button
                                            variant="outline"
                                            className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                                            onClick={() => router.push(`/qr/${vehicle.qr_code_id}`)}
                                        >
                                            <QrCode className="mr-2 h-4 w-4" />
                                            View QR Code
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-950 border-zinc-800 text-white">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Total Alerts</span>
                                        <span className="font-semibold text-yellow-500">0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Account Type</span>
                                        <span className="font-semibold">Free MVP</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
