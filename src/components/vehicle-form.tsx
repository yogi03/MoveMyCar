"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { generateQrId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface VehicleFormProps {
    userId: string;
    currentPlan?: string;
    initialData?: any;
    onSuccess?: () => void;
}

export default function VehicleForm({ userId, currentPlan, initialData, onSuccess }: VehicleFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const isEdit = !!initialData;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const vehicleNumber = formData.get("vehicleNumber") as string;
        const vehicleType = formData.get("vehicleType") as string;
        let nickname = formData.get("nickname") as string;

        if (currentPlan === 'FREE') {
            nickname = "Vehicle 1";
        }

        const normalizedInput = vehicleNumber.replace(/\s+/g, "").toUpperCase();

        try {
            // Check for uniqueness (per user as requested)
            const { data: existing, error: fetchError } = await supabase
                .from("vehicles")
                .select("id, vehicle_number")
                .eq("user_id", userId);

            if (fetchError) throw fetchError;

            const isDuplicate = existing?.some(v =>
                v.vehicle_number.replace(/\s+/g, "").toUpperCase() === normalizedInput &&
                v.id !== initialData?.id
            );

            if (isDuplicate) {
                toast.error("You have already registered this vehicle number.");
                setLoading(false);
                return;
            }

            const qrCodeId = isEdit ? initialData.qr_code_id : generateQrId();
            if (isEdit) {
                const { error } = await supabase
                    .from("vehicles")
                    .update({
                        vehicle_number: vehicleNumber.toUpperCase(),
                        vehicle_type: vehicleType,
                        nickname: nickname,
                    })
                    .eq("id", initialData.id);
                if (error) throw error;
                toast.success("Vehicle updated successfully!");
            } else {
                const { error } = await supabase.from("vehicles").insert({
                    user_id: userId,
                    vehicle_number: vehicleNumber.toUpperCase(),
                    vehicle_type: vehicleType,
                    nickname: nickname,
                    qr_code_id: qrCodeId,
                });
                if (error) throw error;
                toast.success("Vehicle registered successfully!");
            }

            if (onSuccess) onSuccess();
            if (!isEdit) router.push(`/qr/${qrCodeId}`);
        } catch (error: any) {
            toast.error(error.message || `Failed to ${isEdit ? 'update' : 'register'} vehicle`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-yellow-500/20 bg-zinc-950 text-white">
            <CardHeader>
                <CardTitle className="text-xl text-yellow-500">
                    {isEdit ? "Update Vehicle Details" : "Register Your Vehicle"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="vehicleNumber" className="text-zinc-400">Vehicle Number (e.g., MH12AB1234)</Label>
                        <Input
                            id="vehicleNumber"
                            name="vehicleNumber"
                            placeholder="Enter number"
                            required
                            defaultValue={initialData?.vehicle_number}
                            className="bg-black border-zinc-800 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vehicleType" className="text-zinc-400">Vehicle Type</Label>
                        <Select name="vehicleType" required defaultValue={initialData?.vehicle_type || "Car"}>
                            <SelectTrigger className="bg-black border-zinc-800 text-white">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="Car">Car</SelectItem>
                                <SelectItem value="Bike">Bike</SelectItem>
                                <SelectItem value="Truck">Truck</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="nickname" className="text-zinc-400">Nickname</Label>
                            {currentPlan === 'FREE' && (
                                <span className="text-[10px] text-yellow-500 font-bold uppercase">Premium Feature</span>
                            )}
                        </div>
                        <Input
                            id="nickname"
                            name="nickname"
                            placeholder={currentPlan === 'FREE' ? "Vehicle 1" : "e.g., My Beast"}
                            defaultValue={currentPlan === 'FREE' ? "Vehicle 1" : initialData?.nickname}
                            disabled={currentPlan === 'FREE'}
                            className={`bg-black border-zinc-800 text-white ${currentPlan === 'FREE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        {currentPlan === 'FREE' && (
                            <p className="text-[10px] text-zinc-500 italic">Upgrade to basic or advanced plan to set custom nicknames.</p>
                        )}
                    </div>

                    <Button
                        disabled={loading}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12"
                    >
                        {loading ? (isEdit ? "Updating..." : "Registering...") : (isEdit ? "Update Details" : "Generate QR Code")}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
