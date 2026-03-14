// src/app/page.tsx
// Update Name: Roktodan Image Engine & Brand Identity

import nextDynamic from "next/dynamic";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { sql } from "@/lib/db";
import { DISTRICTS, BLOOD_GROUPS } from "@/lib/geodata";
import type { SettingsMap } from "@/lib/settings";
import {
  Heart,
  Users,
  Shield,
  Award,
  Phone,
  MessageCircle,
  Droplet,
  Quote,
  Share2,
  Download,
  X
} from "lucide-react";

// ── Dynamic client imports ────────────────────────────────────────────────────
const DonorSearch = nextDynamic(() => import("./DonorSearch"), { ssr: false });
const DonorRegistrationForm = nextDynamic(() => import("./DonorRegistrationForm"), { ssr: false });
const BloodRequestForm = nextDynamic(() => import("./BloodRequestForm"), { ssr: false });
const DarkModeToggle = nextDynamic(() => import("./DarkModeToggle"), { ssr: false });
const MobileMenu = nextDynamic(() => import("./MobileMenu"), { ssr: false });

export const revalidate = 0;

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Heart, Users, Shield, Award, Phone, MessageCircle, Droplet,
};

// ── Data Fetching ────────────────────────────────

async function getLiveCounters() {
  try {
    const [donorRows, requestRows, districtRows] = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM donors WHERE status = 'approved'`,
      sql`SELECT COUNT(*)::int AS count FROM blood_requests WHERE status = 'fulfilled'`,
      sql`SELECT COUNT(DISTINCT district)::int AS count FROM donors WHERE status = 'approved'`,
    ]);
    return {
      totalDonors: donorRows[0]?.count ?? 0,
      fulfilledRequests: requestRows[0]?.count ?? 0,
      districtsCount: districtRows[0]?.count ?? 0,
    };
  } catch (e) {
    return { totalDonors: 0, fulfilledRequests: 0, districtsCount: 0 };
  }
}

// ── Components ────────────────────────────────

function Navbar({ settings }: { settings: SettingsMap }) {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000026181-m8N7K6O5L4P3Q2R1S0T9U8V7W6X5Y4.png" 
            alt="Roktodan Logo" 
            width={40} 
            height={40} 
            className="object-contain"
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Roktodan</span>
        </div>
        <div className="flex items-center gap-2">
          {settings.show_dark_mode_toggle === "true" && <DarkModeToggle />}
          <MobileMenu />
          <a href="/admin" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
            <Shield className="w-4 h-4" />
            Admin
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero({ settings }: { settings: SettingsMap }) {
  return (
    <section className="relative py-16 sm:py-24 bg-white dark:bg-gray-900 text-center overflow-hidden">
      <div className="absolute inset-0 bg-red-600/[0.03] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white mb-8 bg-red-600 animate-pulse">
          <Droplet className="w-4 h-4" />
          জরুরি প্রয়োজনে কল করুন
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          রক্ত দিন, <span className="text-red-600">জীবন বাঁচান</span>
        </h1>
        
        {/* Contact Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-12">
          {[
            { name: "Tanvir", phone: "01403520600" },
            { name: "Akash", phone: "01619720600" }
          ].map((c) => (
            <div key={c.phone} className="flex items-center justify-between bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-left">
                <p className="font-bold text-gray-800 dark:text-gray-100">{c.name}</p>
                <p className="text-sm text-gray-500">{c.phone}</p>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${c.phone}`} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full"><Phone className="w-5 h-5" /></a>
                <a href={`https://wa.me/88${c.phone}`} target="_blank" className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full"><MessageCircle className="w-5 h-5" /></a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#donor-form" className="px-10 py-4 rounded-2xl text-white font-bold bg-red-600 shadow-xl shadow-red-600/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
            <Heart className="w-6 h-6" /> রক্ত দিন
          </a>
          <a href="#request-form" className="px-10 py-4 rounded-2xl font-bold border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <Phone className="w-6 h-6" /> রক্ত চান
          </a>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const stories = [
    { name: "রাহাত ইসলাম", location: "ঢাকা", text: "এই সাইটের মাধ্যমে খুব দ্রুত ও+ রক্ত পেয়েছি। যারা এই উদ্যোগ নিয়েছেন তাদের ধন্যবাদ।" },
    { name: "শরিফুল আলম", location: "চট্টগ্রাম", text: "আমি নিয়মিত রক্ত দান করি। এখানে নিবন্ধন করা খুব সহজ এবং নিরাপদ।" }
  ];
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">ডোনার ও গ্রহীতাদের অভিজ্ঞতা</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative">
              <Quote className="absolute top-6 right-8 w-10 h-10 text-red-50 dark:text-gray-700" />
              <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-6 leading-relaxed">"{s.text}"</p>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{s.name}</p>
                <p className="text-sm text-red-500">{s.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [settings, counters] = await Promise.all([getSettings(), getLiveCounters()]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 selection:bg-red-100 selection:text-red-600">
      <Navbar settings={settings} />
      
      <main>
        <Hero settings={settings} />
        
        {/* Live Counter Section */}
        <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8">
              {[
                { label: "নিবন্ধিত দাতা", value: counters.totalDonors, icon: Heart, color: "text-red-600" },
                { label: "সফল অনুরোধ", value: counters.fulfilledRequests, icon: MessageCircle, color: "text-blue-600" },
                { label: "জেলা কভারেজ", value: counters.districtsCount, icon: Users, color: "text-green-600" }
              ].map((item) => (
                <div key={item.label} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gray-50 dark:bg-gray-800 transition-transform group-hover:scale-110 ${item.color}`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <p className="text-3xl font-black dark:text-white mb-1">{item.value.toLocaleString("bn-BD")}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="search" className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold dark:text-white mb-4">ডোনার খুঁজুন</h2>
              <div className="h-1.5 w-20 bg-red-600 mx-auto rounded-full" />
            </div>
            <DonorSearch districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>

        <section id="donor-form" className="py-20 bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold dark:text-white mb-4">ডোনার হিসেবে নিবন্ধন</h2>
              <p className="text-gray-600 dark:text-gray-400">আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি প্রাণ।</p>
            </div>
            <DonorRegistrationForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>

        <section id="request-form" className="py-20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold dark:text-white mb-4">রক্তের অনুরোধ করুন</h2>
              <p className="text-gray-600 dark:text-gray-400">সঠিক তথ্য দিয়ে ফরমটি পূরণ করুন যেন ডোনাররা দ্রুত যোগাযোগ করতে পারে।</p>
            </div>
            <BloodRequestForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>

        <Testimonials />
      </main>

      {/* Floating Call-to-Action */}
      <a href="#request-form" className="md:hidden fixed bottom-8 right-6 z-50 flex items-center gap-2 px-6 py-4 bg-red-600 text-white rounded-full shadow-2xl font-black animate-bounce ring-4 ring-red-600/20">
        <Droplet className="w-6 h-6" />
        রক্ত চাই
      </a>

      <footer className="bg-gray-900 text-gray-400 py-16 pb-28 md:pb-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000026181-m8N7K6O5L4P3Q2R1S0T9U8V7W6X5Y4.png" 
            alt="Roktodan Footer Logo" 
            width={50} 
            height={50} 
            className="mx-auto mb-6 grayscale opacity-50"
          />
          <p className="text-lg font-bold text-white mb-2">Roktodan - রক্তদান</p>
          <p className="text-sm mb-8">মানবতার সেবায় আমরা আপনার পাশে।</p>
          <div className="pt-8 border-t border-gray-800 text-xs tracking-widest uppercase">
            © ২০২৬ Roktodan. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
