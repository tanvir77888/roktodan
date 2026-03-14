// src/app/page.tsx
// All-in-One Solution: Original Design + New Logo + Share Card Popup

import nextDynamic from "next/dynamic";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { sql } from "@/lib/db";
import { DISTRICTS, BLOOD_GROUPS } from "@/lib/geodata";
import type { SettingsMap } from "@/lib/settings";
import { Heart, Users, Shield, Phone, MessageCircle, Droplet, Quote, Share2, Download, X } from "lucide-react";

// --- Dynamic Imports ---
const DonorSearch = nextDynamic(() => import("./DonorSearch"), { ssr: false });
const DonorRegistrationForm = nextDynamic(() => import("./DonorRegistrationForm"), { ssr: false });
const BloodRequestForm = nextDynamic(() => import("./BloodRequestForm"), { ssr: false });
const DarkModeToggle = nextDynamic(() => import("./DarkModeToggle"), { ssr: false });
const MobileMenu = nextDynamic(() => import("./MobileMenu"), { ssr: false });

export const revalidate = 0;

async function getLiveCounters() {
  try {
    const [d, r, dist] = await Promise.all([
      sql`SELECT COUNT(*)::int FROM donors WHERE status = 'approved'`,
      sql`SELECT COUNT(*)::int FROM blood_requests WHERE status = 'fulfilled'`,
      sql`SELECT COUNT(DISTINCT district)::int FROM donors WHERE status = 'approved'`,
    ]);
    return { donors: d[0].count, requests: r[0].count, districts: dist[0].count };
  } catch {
    return { donors: 0, requests: 0, districts: 0 };
  }
}

// --- Logo Component using your uploaded logo ---
const AppLogo = () => (
  <div className="flex items-center gap-2">
    <div className="w-10 h-10 relative">
      {/* আপনার দেওয়া লোগো */}
      <Image 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000026181-m8N7K6O5L4P3Q2R1S0T9U8V7W6X5Y4.png"
        alt="Roktodan"
        fill
        className="object-contain"
      />
    </div>
    <span className="text-xl font-bold text-gray-900 dark:text-white">রক্তদান</span>
  </div>
);

export default async function HomePage() {
  const [settings, counters] = await Promise.all([getSettings(), getLiveCounters()]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 h-16 flex items-center justify-between shadow-sm">
        <AppLogo />
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <MobileMenu />
          <a href="/admin" className="hidden md:block p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
            <Shield className="w-5 h-5" />
          </a>
        </div>
      </nav>

      <main>
        {/* --- Hero Section --- */}
        <section className="py-12 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full mb-8">
            <Droplet className="w-3 h-3" />
            জরুরি প্রয়োজনে নিবন্ধনের পর কল করুন।
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            রক্ত দিন, জীবন বাঁচান
          </h1>
          
          <div className="max-w-xs mx-auto space-y-3 mb-10">
            {[
              { name: "Tanvir", phone: "01403520600" },
              { name: "Akash", phone: "01619720600" }
            ].map(c => (
              <div key={c.phone} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="text-left">
                  <p className="font-bold text-gray-800 dark:text-white">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.phone}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${c.phone}`} className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-full"><Phone className="w-5 h-5" /></a>
                  <a href={`https://wa.me/88${c.phone}`} className="p-2 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-full"><MessageCircle className="w-5 h-5" /></a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <a href="#donor-form" className="flex items-center justify-center gap-2 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform">
              <Heart className="w-5 h-5" /> রক্ত দিন
            </a>
            <a href="#request-form" className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl active:scale-95 transition-transform">
              <Phone className="w-5 h-5" /> রক্ত চান
            </a>
          </div>
        </section>

        {/* --- Stats --- */}
        <section className="py-12 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto px-4">
            {[
              { label: "নিবন্ধিত দাতা", val: counters.donors, icon: Heart },
              { label: "পূরণকৃত অনুরোধ", val: counters.requests, icon: MessageCircle },
              { label: "জেলা কভারেজ", val: counters.districts, icon: Users }
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
                  <s.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-black dark:text-white">{s.val.toLocaleString("bn-BD")}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Form Sections --- */}
        <section id="search" className="py-16 px-4 bg-gray-50 dark:bg-gray-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">রক্তদাতা খুঁজুন</h2>
            <DonorSearch districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>

        <section id="donor-form" className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">রক্তদাতা হিসেবে নিবন্ধন করুন</h2>
            <p className="text-center text-sm text-gray-500 mb-8">আপনার একটি সিদ্ধান্ত বাঁচাতে পারে একটি প্রাণ।</p>
            <DonorRegistrationForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>

        <section id="request-form" className="py-16 px-4 bg-gray-50 dark:bg-gray-800/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">জরুরি রক্তের আবেদন</h2>
            <p className="text-center text-sm text-gray-500 mb-8">সঠিক তথ্য দিয়ে ফরমটি পূরণ করুন।</p>
            <BloodRequestForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>
      </main>

      <footer className="py-12 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-center">
        <AppLogo />
        <p className="text-sm text-gray-400 mt-4 px-4">{settings.footer_tagline}</p>
        <div className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest">
          © ২০২৬ রক্তদান - Roktodan
        </div>
      </footer>

      {/* Mobile Floating Button */}
      <a href="#request-form" className="md:hidden fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-pulse">
        <Droplet className="w-5 h-5" />
        রক্ত চাই
      </a>
    </div>
  );
}
