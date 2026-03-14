// src/app/page.tsx
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
  Phone,
  MessageCircle,
  Droplet,
  Quote
} from "lucide-react";

// ── Dynamic client imports ────────────────────────────────────────────────────
const DonorSearch = nextDynamic(() => import("./DonorSearch"), { ssr: false });
const DonorRegistrationForm = nextDynamic(() => import("./DonorRegistrationForm"), { ssr: false });
const BloodRequestForm = nextDynamic(() => import("./BloodRequestForm"), { ssr: false });
const DarkModeToggle = nextDynamic(() => import("./DarkModeToggle"), { ssr: false });
const MobileMenu = nextDynamic(() => import("./MobileMenu"), { ssr: false });

export const revalidate = 0;

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
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* বর্তমান লোগো সেটিংস থেকে আসছে */}
          {settings.logo_url ? (
            <Image 
              src={settings.logo_url} 
              alt={settings.site_name} 
              width={36} 
              height={36} 
              className="rounded-lg object-contain" 
            />
          ) : (
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-600 shadow-lg shadow-red-500/20">
              <Droplet className="w-5 h-5 text-white" />
            </div>
          )}
          <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {settings.site_name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {settings.show_dark_mode_toggle === "true" && <DarkModeToggle />}
          <MobileMenu />
          <a href="/admin" className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-500/10">
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero({ settings }: { settings: SettingsMap }) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-white dark:bg-gray-900 text-center">
      <div className="absolute inset-0 opacity-[0.03] bg-red-600 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-900/20 mb-8 border border-red-100 dark:border-red-900/30">
          <Droplet className="w-4 h-4 animate-pulse" />
          {settings.site_tagline}
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
          {settings.hero_headline}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          {settings.hero_subheadline}
        </p>
        
        {/* Emergency Contact Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mb-14 max-w-lg mx-auto">
          {[
            { name: "Tanvir", phone: "01403520600" },
            { name: "Akash", phone: "01619720600" }
          ].map((c) => (
            <div key={c.phone} className="flex-1 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-gray-900 dark:text-white">{c.name}</span>
                <span className="text-xs font-medium text-gray-500">{c.phone}</span>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${c.phone}`} className="p-2.5 bg-white dark:bg-gray-700 text-red-600 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-transform">
                  <Phone className="w-5 h-5" />
                </a>
                <a href={`https://wa.me/88${c.phone}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white dark:bg-gray-700 text-green-500 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#donor-form" className="px-10 py-4 rounded-2xl text-white font-bold bg-red-600 shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 hover:bg-red-700 transition-all hover:-translate-y-0.5">
            <Heart className="w-5 h-5" /> {settings.hero_btn1_label}
          </a>
          <a href="#request-form" className="px-10 py-4 rounded-2xl font-bold border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <Phone className="w-5 h-5" /> {settings.hero_btn2_label}
          </a>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [settings, counters] = await Promise.all([getSettings(), getLiveCounters()]);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <Navbar settings={settings} />
      
      <main>
        <Hero settings={settings} />
        
        {/* Live Counters */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-6 md:gap-12">
              {[
                { label: "নিবন্ধিত দাতা", value: counters.totalDonors, icon: Heart, color: "text-red-500" },
                { label: "পূর্ণ অনুরোধ", value: counters.fulfilledRequests, icon: MessageCircle, color: "text-blue-500" },
                { label: "জেলা কভারেজ", value: counters.districtsCount, icon: Users, color: "text-green-500" }
              ].map((st) => (
                <div key={st.label} className="flex flex-col items-center group">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform ${st.color}`}>
                    <st.icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl md:text-4xl font-black dark:text-white mb-1 tracking-tight">
                    {st.value.toLocaleString("bn-BD")}
                  </div>
                  <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] text-center">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="search" className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black dark:text-white tracking-tight">{settings.search_section_title}</h2>
              <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
            </div>
            <DonorSearch districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>

        <section id="donor-form" className="py-24 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black dark:text-white tracking-tight">{settings.donor_form_title}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium">{settings.donor_form_desc}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
              <DonorRegistrationForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
            </div>
          </div>
        </section>

        <section id="request-form" className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black dark:text-white tracking-tight">{settings.request_form_title}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium">{settings.request_form_desc}</p>
            </div>
            <div className="bg-red-600 p-10 rounded-[3rem] shadow-2xl shadow-red-500/20">
              <div className="bg-white dark:bg-gray-950 p-8 rounded-[2rem]">
                <BloodRequestForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
              </div>
            </div>
          </section>
      </main>

      {/* Floating Button for Mobile */}
      <a href="#request-form" className="md:hidden fixed bottom-8 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-red-600 text-white rounded-2xl shadow-2xl font-black hover:scale-105 active:scale-95 transition-all animate-bounce">
        <Droplet className="w-6 h-6" />
        <span>রক্ত চাই</span>
      </a>

      <footer className="bg-gray-950 text-gray-400 py-20 border-t border-gray-900 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-2xl font-black text-white mb-4 tracking-tighter">{settings.site_name}</div>
          <p className="text-sm max-w-sm mx-auto mb-10 leading-relaxed">{settings.footer_tagline}</p>
          <div className="pt-10 border-t border-gray-900 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
            {settings.footer_copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
