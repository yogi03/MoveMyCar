"use client";

import { useAuth } from "@/hooks/use-auth";
import { useFCM } from "@/hooks/use-fcm";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import VehicleForm from "@/components/vehicle-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { QrCode, Car, Bike, Plus, Trash2, Edit2, ArrowLeft, Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";
import PricingModal from "@/components/pricing-modal";

export default function Dashboard() {
    const { user, loading, logout, userPlan } = useAuth();
    useFCM(user?.uid);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const [isEditing, setIsEditing] = useState<any>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [showPricing, setShowPricing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }

        if (user) {
            fetchVehicles();

            // Real-time alerts
            const channel = supabase
                .channel('realtime_alerts')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'alert_logs'
                    },
                    (payload) => {
                        const newAlert = payload.new;
                        setVehicles(prev => prev.map(v =>
                            v.id === newAlert.vehicle_id
                                ? { ...v, alert_count: (v.alert_count || 0) + 1 }
                                : v
                        ));
                        toast("🚨 New alert received!", { icon: "🔔" });
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user, loading, router]);

    const fetchVehicles = async () => {
        if (!user) return;
        setFetching(true);
        try {
            // 1. Fetch vehicles
            const { data: vehicleData, error: vError } = await supabase
                .from("vehicles")
                .select("*")
                .eq("user_id", user.uid)
                .order('created_at', { ascending: true });

            if (vError) throw vError;

            // 2. Fetch alert counts for these vehicles
            const vehicleIds = vehicleData?.map(v => v.id) || [];
            const { data: alertCounts, error: aError } = await supabase
                .from("alert_logs")
                .select("vehicle_id")
                .in("vehicle_id", vehicleIds);

            if (aError) throw aError;

            // Count alerts per vehicle
            const countsMap = (alertCounts || []).reduce((acc: any, curr: any) => {
                acc[curr.vehicle_id] = (acc[curr.vehicle_id] || 0) + 1;
                return acc;
            }, {});

            const vehiclesWithCounts = vehicleData?.map(v => ({
                ...v,
                alert_count: countsMap[v.id] || 0
            })) || [];

            setVehicles(vehiclesWithCounts);
        } catch (error: any) {
            console.error("Error fetching vehicles/alerts:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setFetching(false);
        }
    };

    const handleDelete = async (vehicleId: string) => {
        if (!confirm("Are you sure you want to delete this vehicle registration? This will permanently disable your QR code.")) return;

        setDeleting(vehicleId);
        try {
            const { error } = await supabase
                .from("vehicles")
                .delete()
                .eq("id", vehicleId);

            if (error) throw error;

            toast.success("Vehicle deleted successfully");
            fetchVehicles();
            if (isEditing?.id === vehicleId) setIsEditing(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete vehicle");
        } finally {
            setDeleting(null);
        }
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
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-yellow-500">Dashboard</h1>
                            <p className="text-zinc-400">Welcome, {user?.displayName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${userPlan.plan === 'FREE' ? 'border-zinc-800 text-zinc-500' : userPlan.plan === 'BASIC' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5' : 'border-purple-500/50 text-purple-500 bg-purple-500/5'}`}>
                                {userPlan.plan} Plan
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-zinc-500 hover:text-white hover:bg-yellow-500 text-xs h-7"
                                onClick={() => setShowPricing(true)}
                            >
                                Manage
                            </Button>
                        </div>
                    </header>

                    {isEditing || (vehicles.length === 0 && !fetching) ? (
                        <div className="space-y-6">
                            {(isEditing || (vehicles.length === 0 && vehicles[0])) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsEditing(null)}
                                    className="text-zinc-400 hover:text-black hover:bg-yellow-500 mb-4"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Button>
                            )}
                            <VehicleForm
                                userId={user!.uid}
                                initialData={isEditing && typeof isEditing === 'object' ? isEditing : null}
                                onSuccess={() => {
                                    fetchVehicles();
                                    setIsEditing(null);
                                }}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vehicles.map((v, index) => (
                                <Card key={v.id} className="bg-zinc-950 border-yellow-500/20 text-white relative group overflow-hidden">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium truncate pr-4">
                                            {v.nickname || `My Vehicle ${index + 1}`}
                                        </CardTitle>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-zinc-500 hover:text-yellow-500 transition-colors"
                                                onClick={() => setIsEditing(v)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-zinc-500 hover:text-red-500 transition-colors"
                                                onClick={() => handleDelete(v.id)}
                                                disabled={deleting === v.id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-zinc-900 rounded-xl">
                                                {v.vehicle_type === 'Car' ? (
                                                    <Car className="h-6 w-6 text-yellow-500" />
                                                ) : v.vehicle_type === 'Bike' ? (
                                                    <Bike className="h-6 w-6 text-yellow-500" />
                                                ) : v.vehicle_type === 'Truck' ? (
                                                    <Truck className="h-6 w-6 text-yellow-500" />
                                                ) : (
                                                    <Car className="h-6 w-6 text-yellow-500" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-yellow-500 leading-none">{v.vehicle_number}</div>
                                                <p className="text-xs text-zinc-400 mt-1 uppercase tracking-tight">
                                                    {v.vehicle_type}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-900">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Total Alerts</p>
                                                <p className="text-lg font-bold text-white">{v.alert_count || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Account Type</p>
                                                <p className="text-sm font-semibold text-zinc-300">Free MVP</p>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                variant="outline"
                                                className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold h-12 transition-all"
                                                onClick={() => router.push(`/qr/${v.qr_code_id}`)}
                                            >
                                                <QrCode className="mr-2 h-5 w-5" />
                                                View QR Code
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Add New Vehicle Card */}
                            <button
                                onClick={() => {
                                    const limit = userPlan.plan === 'FREE' ? 1 : userPlan.plan === 'BASIC' ? 5 : 20;
                                    if (vehicles.length >= limit) {
                                        setShowPricing(true);
                                        toast.error(`You have reached the limit for your ${userPlan.plan} plan.`);
                                    } else {
                                        setIsEditing('new');
                                    }
                                }}
                                className="h-full min-h-[300px] border-2 border-dashed border-zinc-800 rounded-xl hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group flex flex-col items-center justify-center space-y-4"
                            >
                                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors">
                                    <Plus className="h-6 h-6 text-zinc-500 group-hover:text-yellow-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-zinc-400 group-hover:text-yellow-500">Add New Vehicle</p>
                                    <p className="text-xs text-zinc-600">Register another vehicle</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                userId={user!.uid}
                userName={user?.displayName}
                userEmail={user?.email}
                currentPlan={userPlan.plan}
                subscriptionEnd={userPlan.subscription_end}
                onSuccess={() => {
                    // Logic to refresh plan data if needed, but useAuth does it on mount/sync
                }}
            />

            <Footer />
        </div>
    );
}
