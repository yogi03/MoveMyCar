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

export default function VehicleForm({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const vehicleNumber = formData.get("vehicleNumber") as string;
        const vehicleType = formData.get("vehicleType") as string;
        const nickname = formData.get("nickname") as string;
        const qrCodeId = generateQrId();

        try {
            const { error } = await supabase.from("vehicles").insert({
                user_id: userId,
                vehicle_number: vehicleNumber.toUpperCase(),
                vehicle_type: vehicleType,
                nickname: nickname,
                qr_code_id: qrCodeId,
            });

            if (error) throw error;

            toast.success("Vehicle registered successfully!");
            router.push(`/qr/${qrCodeId}`);
        } catch (error: any) {
            toast.error(error.message || "Failed to register vehicle");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-yellow-500/20 bg-zinc-950 text-white">
            <CardHeader>
                <CardTitle className="text-xl text-yellow-500">Register Your Vehicle</CardTitle>
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
                            className="bg-black border-zinc-800 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vehicleType" className="text-zinc-400">Vehicle Type</Label>
                        <Select name="vehicleType" required defaultValue="Car">
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
                        <Label htmlFor="nickname" className="text-zinc-400">Nickname (Optional)</Label>
                        <Input
                            id="nickname"
                            name="nickname"
                            placeholder="e.g., My Beast"
                            className="bg-black border-zinc-800 text-white"
                        />
                    </div>

                    <Button
                        disabled={loading}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                    >
                        {loading ? "Registering..." : "Generate QR Code"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
