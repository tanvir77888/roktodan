// src/app/page.tsx
import nextDynamic from "next/dynamic";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { sql } from "@/lib/db";
import { DISTRICTS, BLOOD_GROUPS } from "@/lib/geodata"; // বড় হাতের নাম ব্যবহার করা হয়েছে
import type { SettingsMap } from "@/lib/settings";
import {
  Heart,
  Shield,
  Phone,
  MessageCircle,
  Droplet,
  Quote,
  Search,
  Users,
  Bell
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

// ── UI Components ────────────────────────────────

function Navbar({ settings }: { settings: SettingsMap }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {settings.logo_url ? (
            <Image src={settings.logo_url} alt="Logo" width={42} height={42} className="rounded-2xl object-cover shadow-inner" />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Droplet className="w-6 h-6 text-white" />
            </div>
          )}
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500 tracking-tight">
            {settings.site_name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {settings.show_dark_mode_toggle === "true" && <DarkModeToggle />}
          <div className="hidden md:block h-6 w-[1px] bg-gray-100 dark:bg-gray-800" />
          <a href="/admin" className="p-2.5 rounded-2xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Shield className="w-5.5 h-5.5" />
          </a>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

function Hero({ settings }: { settings: SettingsMap }) {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden bg-white dark:bg-gray-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center z-10">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-sm font-bold mb-10 shadow-inner">
          <Droplet className="w-4.5 h-4.5" />
          {settings.site_tagline}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-950 dark:text-white mb-8 leading-[1.05] tracking-tighter">
          {settings.hero_headline}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
          "{settings.hero_subheadline}"
        </p>

        {/* Premium Emergency Contact Cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 max-w-2xl mx-auto">
          {[
            { name: "Tanvir", phone: "01403520600" },
            { name: "Akash", phone: "01619720600" }
          ].map((c) => (
            <div key={c.phone} className="flex-1 min-w-[280px] flex items-center gap-5 bg-gray-50 dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-red-500/10 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg shadow-gray-200/50 dark:shadow-none text-red-600 transition-colors font-black text-2xl group-hover:bg-red-600 group-hover:text-white">
                {c.name[0]}
              </div>
              <div className="text-left flex-1">
                <p className="font-extrabold text-lg text-gray-950 dark:text-white leading-none mb-1.5">{c.name}</p>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-500">{c.phone}</p>
              </div>
              <div className="flex gap-2.5">
                <a href={`tel:${c.phone}`} className="p-3 bg-white dark:bg-gray-800 text-red-600 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-transform"><Phone className="w-5 h-5" /></a>
                <a href={`https://wa.me/88${c.phone}`} target="_blank" className="p-3 bg-white dark:bg-gray-800 text-green-500 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-transform"><MessageCircle className="w-5 h-5" /></a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <a href="#donor-form" className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-lg shadow-xl shadow-red-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2.5">
            <Heart className="w-6 h-6" /> {settings.hero_btn1_label}
          </a>
          <a href="#request-form" className="w-full sm:w-auto px-10 py-4.5 rounded-2xl border-2 border-gray-200 dark:border-gray-800 text-gray-950 dark:text-white font-extrabold text-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-center gap-2.5">
            <Bell className="w-6 h-6" /> {settings.hero_btn2_label}
          </a>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [settings, counters] = await Promise.all([getSettings(), getLiveCounters()]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500 font-sans">
      <Navbar settings={settings} />
      
      <main className="pb-24">
        <Hero settings={settings} />
        
        {/* Stats Section with Glassmorphism */}
        <section className="relative z-10 -mt-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-5 md:gap-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-800 text-center">
            {[
              { label: "নিবন্ধিত দাতা", value: counters.totalDonors, icon: Heart, color: "text-red-500" },
              { label: "পূরণকৃত অনুরোধ", value: counters.fulfilledRequests, icon: Droplet, color: "text-blue-500" },
              { label: "জেলা coverage", value: counters.districtsCount, icon: Shield, color: "text-green-500" }
            ].map((st) => (
              <div key={st.label} className="group flex flex-col items-center">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 bg-gray-50 dark:bg-gray-800 group-hover:scale-110 transition-transform ${st.color}`}>
                  <st.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl md:text-5xl font-black text-gray-950 dark:text-white leading-none mb-1.5">
                  {st.value.toLocaleString("bn-BD")}
                </div>
                <div className="text-[11px] md:text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">{st.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Sections with subtle Dividers */}
        <div className="space-y-36 mt-32 max-w-7xl mx-auto px-4 sm:px-6">
          
          <section id="search" className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-red-600 font-extrabold uppercase tracking-[0.25em] text-sm">Search Panel</span>
              <h2 className="text-4xl md:text-5xl font-black mt-3 text-gray-950 dark:text-white tracking-tighter">{settings.search_section_title}</h2>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
              <DonorSearch districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
            </div>
          </section>

          <section id="donor-form" className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-[3rem] p-8 md:p-14 text-white shadow-3xl shadow-red-500/25 relative overflow-hidden">
              <div className="relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tighter">{settings.donor_form_title}</h2>
                <p className="text-red-100 mb-12 text-lg md:text-xl font-medium opacity-90">{settings.donor_form_desc}</p>
                <div className="bg-white dark:bg-gray-950 p-8 md:p-12 rounded-[2.5rem] shadow-inner text-gray-950">
                  <DonorRegistrationForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
                </div>
              </div>
            </div>
          </section>

          <section id="request-form" className="max-w-4xl mx-auto pb-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tighter">{settings.request_form_title}</h2>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mt-3 font-medium">{settings.request_form_desc}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border-4 border-gray-100 dark:border-gray-800 p-10 md:p-16 rounded-[3rem] shadow-sm">
              <BloodRequestForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 py-24 px-4 sm:px-6 border-t border-gray-100 dark:border-gray-800 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="text-3xl font-black text-gray-950 dark:text-white tracking-tight mb-5">{settings.site_name}</div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto">{settings.footer_tagline}</p>
          <div className="flex justify-center gap-10 mb-14 text-gray-400 dark:text-gray-600">
             <MessageCircle className="w-7 h-7 hover:text-green-500 cursor-pointer transition-colors" />
             <Heart className="w-7 h-7 hover:text-red-500 cursor-pointer transition-colors" />
          </div>
          <div className="text-xs font-bold text-gray-400 dark:text-gray-700 uppercase tracking-[0.25em]">{settings.footer_copyright}</div>
        </div>
      </footer>
    </div>
  );
}
