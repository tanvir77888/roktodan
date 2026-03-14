// src/app/page.tsx
import nextDynamic from "next/dynamic";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { sql } from "@/lib/db";
import { DISTRICTS, BLOOD_GROUPS } from "@/lib/geodata"; 
import type { SettingsMap } from "@/lib/settings";
import {
  Heart,
  Shield,
  Phone,
  MessageCircle,
  Droplet,
  Quote,
  UserPlus,
  Bell,
  Search,
  Users
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

export default async function HomePage() {
  const [settings, counters] = await Promise.all([getSettings(), getLiveCounters()]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logo_url ? (
              <Image src={settings.logo_url} alt="Logo" width={40} height={40} className="rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" />
              </div>
            )}
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              {settings.site_name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {settings.show_dark_mode_toggle === "true" && <DarkModeToggle />}
            <a href="/admin" className="p-2 text-gray-400 hover:text-red-600 transition-colors">
              <Shield className="w-5 h-5" />
            </a>
            <MobileMenu />
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero Section ── */}
        <section className="relative pt-16 pb-24 overflow-hidden text-center bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold mb-8">
              <Droplet className="w-4 h-4" />
              {settings.site_tagline}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              {settings.hero_headline}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {settings.hero_subheadline}
            </p>

            {/* Emergency Contacts */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 max-w-lg mx-auto">
              {[
                { name: "Tanvir", phone: "01403520600" },
                { name: "Akash", phone: "01619720600" }
              ].map((c) => (
                <div key={c.phone} className="flex-1 flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="text-left">
                    <p className="font-bold text-sm dark:text-white">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${c.phone}`} className="p-2 bg-white dark:bg-gray-700 text-red-600 rounded-full shadow-sm">
                      <Phone className="w-4 h-4" />
                    </a>
                    <a href={`https://wa.me/88${c.phone}`} className="p-2 bg-white dark:bg-gray-700 text-green-500 rounded-full shadow-sm">
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#donor-form" className="px-8 py-4 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 hover:bg-red-700 transition-all">
                <Heart className="w-5 h-5" /> {settings.hero_btn1_label}
              </a>
              <a href="#request-form" className="px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <Droplet className="w-5 h-5" /> {settings.hero_btn2_label}
              </a>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "নিবন্ধিত দাতা", value: counters.totalDonors, icon: Heart, color: "text-red-600" },
                { label: "পূর্ণ অনুরোধ", value: counters.fulfilledRequests, icon: Droplet, color: "text-blue-500" },
                { label: "জেলা", value: counters.districtsCount, icon: Users, color: "text-green-500" }
              ].map((st) => (
                <div key={st.label} className="text-center">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 bg-white dark:bg-gray-800 shadow-sm ${st.color}`}>
                    <st.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black dark:text-white leading-none mb-1">
                    {st.value.toLocaleString("bn-BD")}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Search ── */}
        <section id="search" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-center mb-10 dark:text-white flex items-center justify-center gap-3">
              <Search className="text-red-600" /> {settings.search_section_title}
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
              <DonorSearch districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
            </div>
          </div>
        </section>

        {/* ── Forms ── */}
        <div className="space-y-20 py-10">
          <section id="donor-form" className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black dark:text-white mb-3">{settings.donor_form_title}</h2>
              <p className="text-gray-500 text-sm">{settings.donor_form_desc}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2rem] shadow-xl">
              <DonorRegistrationForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
            </div>
          </section>

          <section id="request-form" className="max-w-2xl mx-auto px-4 pb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black dark:text-white mb-3">{settings.request_form_title}</h2>
              <p className="text-gray-500 text-sm">{settings.request_form_desc}</p>
            </div>
            <div className="bg-red-600 p-8 rounded-[2.5rem] shadow-2xl shadow-red-500/20">
              <div className="bg-white p-6 rounded-[1.5rem]">
                <BloodRequestForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-16 border-t border-gray-100 dark:border-gray-800 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-xl font-black text-gray-900 dark:text-white mb-3">{settings.site_name}</div>
          <p className="text-gray-500 text-sm mb-8">{settings.footer_tagline}</p>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            {settings.footer_copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
