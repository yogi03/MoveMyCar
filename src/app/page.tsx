"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { QrCode, Bell, Smartphone, ShieldCheck, ChevronRight, Car } from "lucide-react";
// import Logo from "@/components/layout/Logo";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleGetStarted = () => {
    if (loading) return;
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-32 text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          Next-Gen Parking Alerts
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
          Your Vehicle, <br />
          <span className="text-yellow-500">Always Reachable.</span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The smartest way to handle parking blocks. Just one scan, one alert, and no phone numbers exposed. Built for the modern driver.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button
            onClick={handleGetStarted}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg h-14 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 min-w-[200px]"
          >
            {user ? "Go to Dashboard" : "Get Started Now"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="border-zinc-800 text-white hover:bg-zinc-900 bg-transparent h-14 px-8 rounded-xl text-lg font-semibold"
            onClick={() => {
              const element = document.getElementById('how-it-works');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            How it works
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="px-6 py-24 bg-zinc-950/50 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Simple, Safe, Smart</h2>
            <p className="text-zinc-500">Everything you need to manage your parking space peacefully.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<QrCode className="h-8 w-8 text-yellow-500" />}
              title="Unique QR Code"
              description="Register your vehicle and get a high-quality printable QR card for your dashboard."
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-yellow-500" />}
              title="Instant Push Alerts"
              description="Receive real-time notifications on your phone whenever someone needs you to move."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-yellow-500" />}
              title="Privacy First"
              description="Your phone number and email are never shared. Scanners only see an alert button."
            />
          </div>
        </div>
      </section>

      {/* Interactive Mockup Section */}
      <section className="px-6 py-32 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-4xl font-bold leading-tight">
              A premium experience <br />
              <span className="text-yellow-500">on any device.</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-zinc-300">
                <div className="bg-yellow-500/10 p-1 rounded-full"><ChevronRight className="h-4 w-4 text-yellow-500" /></div>
                Fully responsive mobile-first design
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <div className="bg-yellow-500/10 p-1 rounded-full"><ChevronRight className="h-4 w-4 text-yellow-500" /></div>
                PWA enabled - Install it on your home screen
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <div className="bg-yellow-500/10 p-1 rounded-full"><ChevronRight className="h-4 w-4 text-yellow-500" /></div>
                Dark mode by default for visual excellence
              </li>
            </ul>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <Card className="relative bg-zinc-950 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                  </div>
                  <div className="flex-1 text-center text-[10px] text-zinc-500 font-mono">movemycar.live/v/ABC123XY</div>
                </div>
                <div className="p-12 text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                    <Car className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold tracking-widest text-white uppercase">MH12-AB-1234</h4>
                    <p className="text-zinc-500 text-sm mt-1">Car • My White Beast</p>
                  </div>
                  <div className="py-2">
                    <div className="w-full bg-yellow-500 py-4 rounded-xl text-black font-bold flex items-center justify-center gap-2">
                      <Bell className="h-5 w-5" />
                      🚨 Request to Move
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-zinc-950 border-zinc-900 hover:border-yellow-500/30 transition-all duration-300 group p-2">
      <CardContent className="pt-8 space-y-4">
        <div className="mb-4 bg-zinc-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition-colors">{title}</h3>
        <p className="text-zinc-500 leading-relaxed text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
