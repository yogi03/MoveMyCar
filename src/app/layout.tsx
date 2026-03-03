import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"
import GoogleOneTap from "@/components/auth/GoogleOneTap";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoveMyCar - QR Parking Alerts",
  description: "Get notified when someone needs you to move your vehicle.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#EAB308",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white antialiased`}
        suppressHydrationWarning
      >
        <GoogleOneTap />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid #eab308'
            }
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
