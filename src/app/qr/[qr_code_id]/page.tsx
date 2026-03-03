"use client";

import { useEffect, useState, useRef, use } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function QRPage({ params }: { params: Promise<{ qr_code_id: string }> }) {
    const { qr_code_id } = use(params);
    const [qrUrl, setQrUrl] = useState<string>("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();

    const [publicUrl, setPublicUrl] = useState<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setPublicUrl(`${window.location.origin}/v/${qr_code_id}`);
        }
    }, [qr_code_id]);

    useEffect(() => {
        if (publicUrl) {
            generateQR();
        }
    }, [publicUrl]);

    const generateQR = async () => {
        if (!publicUrl) return;
        try {
            const url = await QRCode.toDataURL(publicUrl, {
                width: 400,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                },
            });
            setQrUrl(url);
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate QR code");
        }
    };

    const downloadQR = () => {
        const link = document.createElement("a");
        link.href = qrUrl;
        link.download = `move-my-car-${qr_code_id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Downloading QR Code");
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center">
            <div className="w-full max-w-md space-y-6">
                <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-black hover:bg-yellow-600 mb-2 p-0 h-auto"
                    onClick={() => router.push("/dashboard")}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>

                <Card className="bg-white border-none shadow-2xl overflow-hidden print:shadow-none print:m-0">
                    <CardHeader className="bg-yellow-500 text-black text-center py-6">
                        <CardTitle className="text-2xl font-bold uppercase tracking-widest">MoveMyCar</CardTitle>
                        <CardDescription className="text-black/70 font-medium">SCAN TO NOTIFY OWNER</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center p-8 bg-white">
                        {qrUrl && (
                            <img
                                src={qrUrl}
                                alt="Vehicle QR Code"
                                className="w-full max-w-[280px] h-auto border-4 border-black"
                            />
                        )}
                        <div className="mt-6 text-center text-black space-y-1">
                            <p className="font-bold text-lg">ID: {qr_code_id}</p>
                            <p className="text-xs text-zinc-500">Keep this card in your vehicle's windshield</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="no-print print:hidden">
                    <Button
                        onClick={downloadQR}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                    </Button>
                </div>

                <div className="bg-zinc-950 border border-yellow-500/10 p-4 rounded-lg space-y-2 no-print print:hidden">
                    <h4 className="text-yellow-500 font-semibold text-sm">Instructions:</h4>
                    <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
                        <li>Download this QR card</li>
                        <li>Place it on your dashboard or window</li>
                        <li>When someone scans it, you'll get a push alert</li>
                    </ol>
                </div>
            </div>

            <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .min-h-screen { min-height: auto !important; padding: 0 !important; }
        }
      `}</style>
        </div>
    );
}
