// src/app/page.tsx
import nextDynamic from "next/dynamic";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { sql } from "@/lib/db";
import { districts, bloodGroups } from "@/lib/geodata"; // ছোট হাতের এক্সপোর্ট ব্যবহার নিশ্চিত করুন
import type { SettingsMap } from "@/lib/settings";
import {
  Heart,
  Shield,
  Phone,
  MessageCircle,
  Droplet,
  Quote,
  Search,
  UserPlus,
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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500">
            {settings.site_name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {settings.show_dark_mode_toggle === "true" && <DarkModeToggle />}
          <div className="hidden md:block h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2" />
          <a href="/admin" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Shield className="w-5 h-5" />
          </a>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

function Hero({ settings }: { settings: SettingsMap }) {
  return (
    <section className="relative pt-16 pb-12 overflow-hidden bg-white dark:bg-gray-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          {settings.site_tagline}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
          {settings.hero_headline.split(' ').map((word, i) => 
            word.includes('রক্ত') ? <span key={i} className="text-red-600"> {word} </span> : word + ' '
          )}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed italic">
          "{settings.hero_subheadline}"
        </p>

        {/* Improved Emergency Contact Cards */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { name: "Tanvir", phone: "01403520600" },
            { name: "Akash", phone: "01619720600" }
          ].map((c) => (
            <div key={c.phone} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors font-bold">
                {c.name[0]}
              </div>
              <div className="text-left">
                <p className="font-bold dark:text-white">{c.name}</p>
                <div className="flex gap-3 mt-1">
                  <a href={`tel:${c.phone}`} className="text-gray-400 hover:text-red-600 transition-colors"><Phone className="w-4 h-4" /></a>
                  <a href={`https://wa.me/88${c.phone}`} className="text-gray-400 hover:text-green-500 transition-colors"><MessageCircle className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#donor-form" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5" /> {settings.hero_btn1_label}
          </a>
          <a href="#request-form" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Bell className="w-5 h-5" /> {settings.hero_btn2_label}
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
      
      <main className="pb-20">
        <Hero settings={settings} />
        
        {/* Stats Section with Glassmorphism */}
        <section className="relative z-10 -mt-8 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 md:gap-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-800">
            {[
              { label: "নিবন্ধিত দাতা", value: counters.totalDonors, icon: Heart, color: "text-red-500" },
              { label: "পূরণকৃত অনুরোধ", value: counters.fulfilledRequests, icon: Droplet, color: "text-blue-500" },
              { label: "জেলা কভারেজ", value: counters.districtsCount, icon: Shield, color: "text-green-500" }
            ].map((st) => (
              <div key={st.label} className="text-center group">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 bg-gray-50 dark:bg-gray-800 group-hover:scale-110 transition-transform ${st.color}`}>
                  <st.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl md:text-4xl font-black dark:text-white mb-1">
                  {st.value.toLocaleString("bn-BD")}
                </div>
                <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{st.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Sections with subtle Dividers */}
        <div className="space-y-32 mt-24">
          
          <section id="search" className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs">Search Engine</span>
              <h2 className="text-3xl font-black mt-2 dark:text-white">{settings.search_section_title}</h2>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
              <DonorSearch districts={districts} bloodGroups={bloodGroups} settings={settings} />
            </div>
          </section>

          <section id="donor-form" className="max-w-3xl mx-auto px-4">
            <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-red-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-black mb-4">{settings.donor_form_title}</h2>
                <p className="text-red-100 mb-10 text-lg opacity-90">{settings.donor_form_desc}</p>
                <div className="bg-white dark:bg-gray-950 p-6 md:p-10 rounded-[2rem] shadow-inner text-gray-900">
                  <DonorRegistrationForm districts={districts} bloodGroups={bloodGroups} settings={settings} />
                </div>
              </div>
            </div>
          </section>

          <section id="request-form" className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black dark:text-white">{settings.request_form_title}</h2>
              <p className="text-gray-500 mt-2">{settings.request_form_desc}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 md:p-12 rounded-[3rem] shadow-sm">
              <BloodRequestForm districts={districts} bloodGroups={bloodGroups} settings={settings} />
            </div>
          </section>
        </div>
      </main>

      {/* Floating Call-to-Action */}
      <a href="#request-form" className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all group">
        <Droplet className="w-8 h-8 group-hover:animate-bounce" />
      </a>

      <footer className="bg-gray-50 dark:bg-gray-900 py-20 px-4 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl font-black text-gray-900 dark:text-white mb-4">{settings.site_name}</div>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">{settings.footer_tagline}</p>
          <div className="flex justify-center gap-8 mb-12 text-gray-400">
             <Facebook className="w-6 h-6 hover:text-blue-600 cursor-pointer transition-colors" />
             <MessageCircle className="w-6 h-6 hover:text-green-500 cursor-pointer transition-colors" />
             <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer transition-colors" />
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{settings.footer_copyright}</div>
        </div>
      </footer>
    </div>
  );
}
