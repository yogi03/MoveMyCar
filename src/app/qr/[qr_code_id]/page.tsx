"use client";

import { useEffect, useState, useRef, use, useCallback } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toPng } from "html-to-image";
import Image from "next/image";

export default function QRPage({ params }: { params: Promise<{ qr_code_id: string }> }) {
    const { qr_code_id } = use(params);
    const [qrUrl, setQrUrl] = useState<string>("");
    const cardRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const url = `${window.location.origin}/v/${qr_code_id}`;
        let ignore = false;

        const generate = async () => {
            try {
                const qrDataUrl = await QRCode.toDataURL(url, {
                    width: 400,
                    margin: 2,
                    errorCorrectionLevel: 'H',
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF",
                    },
                });
                if (!ignore) setQrUrl(qrDataUrl);
            } catch (err) {
                console.error(err);
                if (!ignore) toast.error("Failed to generate QR code");
            }
        };

        generate();

        return () => {
            ignore = true;
        };
    }, [qr_code_id]);

    const downloadQR = async () => {
        if (!cardRef.current) return;

        const toastId = toast.loading("Preparing your QR Card...");
        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                skipFonts: true,
                fontEmbedCSS: '',
                filter: (node: HTMLElement) => {
                    return !node.classList?.contains("exclude-from-download");
                },
                backgroundColor: "#FFFFFF",
                style: {
                    borderRadius: '0',
                }
            });

            const link = document.createElement("a");
            link.download = `move-my-car-qr.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Downloaded successfully!", { id: toastId });
        } catch (err) {
            console.error("Failed to generate download:", err);
            toast.error("Failed to download. Please try again.", { id: toastId });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header />
            <div className="flex-1 p-4 md:p-8 flex flex-col items-center gap-8">
                <div className="w-full max-w-md space-y-6">
                    <Button
                        variant="ghost"
                        className="text-zinc-400 hover:text-black hover:bg-yellow-600 mb-2 p-0 h-auto"
                        onClick={() => router.push("/dashboard")}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>

                    <div ref={cardRef} className="w-full">
                        <Card className="bg-white border-none shadow-2xl overflow-hidden print:shadow-none print:m-0">
                            <CardHeader className="bg-yellow-500 text-black text-center py-6">
                                <CardTitle className="text-2xl font-bold uppercase tracking-widest text-[#000000]">Move <span className="text-white">My</span> Car</CardTitle>
                                <CardDescription className="text-black/70 font-medium">SCAN TO NOTIFY OWNER</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center p-8 bg-white">
                                {qrUrl && (
                                    <div className="p-2 border-4 border-black bg-white relative">
                                        <Image
                                            src={qrUrl}
                                            alt="Vehicle QR Code"
                                            width={280}
                                            height={280}
                                            className="w-full h-auto"
                                            unoptimized
                                        />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#191919] p-1 rounded-lg">
                                            <div className="w-20 h-16 relative">
                                                <Image
                                                    src="/logo-home.png"
                                                    alt="MoveMyCar Logo"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-6 text-center text-black space-y-1">
                                    <p className="font-bold text-lg exclude-from-download">ID: {qr_code_id}</p>
                                    <p className="text-xs text-zinc-500">Keep this card in your vehicle&apos;s windshield</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

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
                            <li>When someone scans it, you&apos;ll get a push alert</li>
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
            <Footer />
        </div>
    );
}
