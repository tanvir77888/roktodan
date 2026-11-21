// src/app/page.tsx
import nextDynamic from "next/dynamic";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { sql } from "@/lib/db";
import { DISTRICTS, BLOOD_GROUPS } from "@/lib/geodata";
import LiveTicker from "./LiveTicker";
import { cookies } from "next/headers";
import { EN_SETTINGS, type Lang } from "@/lib/i18n";
import type { SettingsMap } from "@/lib/settings";
import {
  Heart,
  Users,
  Shield,
  Phone,
  MessageCircle,
  Droplet,
  Quote,
  Search
} from "lucide-react";

// ── Dynamic client imports ────────────────────────────────────────────────────
const DonorSearch = nextDynamic(() => import("./DonorSearch"), { ssr: false });
const LiveBoard = nextDynamic(() => import("./LiveBoard"), { ssr: false });
const HeroNameSearch = nextDynamic(() => import("./HeroNameSearch"), { ssr: false });
const DonorRegistrationForm = nextDynamic(() => import("./DonorRegistrationForm"), { ssr: false });
const BloodRequestForm = nextDynamic(() => import("./BloodRequestForm"), { ssr: false });
const DarkModeToggle = nextDynamic(() => import("./DarkModeToggle"), { ssr: false });
const MobileMenu = nextDynamic(() => import("./MobileMenu"), { ssr: false });
const PushSubscribe = nextDynamic(() => import("./PushSubscribe"), { ssr: false });
const LangToggle = nextDynamic(() => import("./LangToggle"), { ssr: false });

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
          {settings.logo_url ? (
            <Image src={settings.logo_url} alt={settings.site_name} width={36} height={36} className="rounded-full object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-red-600">
              <Droplet className="w-5 h-5 text-white" />
            </div>
          )}
          <span className="text-lg font-bold text-gray-900 dark:text-white">{settings.site_name}</span>
        </div>
        <div className="flex items-center gap-2">
          {settings.show_dark_mode_toggle === "true" && <DarkModeToggle />}
          <LangToggle />
          <MobileMenu />
          <a href="/admin" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero({ settings }: { settings: SettingsMap }) {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20 bg-white dark:bg-gray-900 text-center">
      <div className="absolute inset-0 opacity-5 bg-red-600 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white mb-6 bg-red-600">
          <Droplet className="w-4 h-4" />
          {settings.site_tagline}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{settings.hero_headline}</h1>
        <HeroNameSearch />
        
        {/* Contact Cards */}
        <div className="flex flex-col gap-3 mb-10 max-w-xs mx-auto">
          {[
            { name: settings.helpline_1_name || "Tanvir", phone: settings.helpline_1_phone || "01403520600" },
            { name: settings.helpline_2_name || "Akash", phone: settings.helpline_2_phone || "01619720600" }
          ].map((c) => (
            <div key={c.phone} className="flex items-center justify-between bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/30 p-3 rounded-2xl shadow-sm">
              <div className="flex flex-col text-left">
                <span className="font-bold text-gray-800 dark:text-gray-100">{c.name}</span>
                <span className="text-xs text-gray-500">{c.phone}</span>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${c.phone}`} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full hover:bg-red-100 transition-colors"><Phone className="w-5 h-5" /></a>
                <a href={`https://wa.me/88${c.phone}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full hover:bg-green-100 transition-colors"><MessageCircle className="w-5 h-5" /></a>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          {/* New Search Button (Primary) */}
          <a href="#search" className="w-full px-8 py-4 rounded-2xl text-white font-bold bg-red-600 shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
            <Search className="w-5 h-5" /> রক্তদাতা খুঁজুন
          </a>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#donor-form" className="flex-1 px-8 py-3.5 rounded-xl text-white font-semibold bg-red-600 shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <Heart className="w-5 h-5" /> {settings.hero_btn1_label}
            </a>
            <a href="#request-form" className="flex-1 px-8 py-3.5 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Phone className="w-5 h-5" /> {settings.hero_btn2_label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StoryItem { name: string; location: string; text: string }

const DEFAULT_STORIES: StoryItem[] = [
  { name: "রাহাত ইসলাম", location: "ঢাকা", text: "এই সাইটের মাধ্যমে খুব দ্রুত ও+ রক্ত পেয়েছি। যারা এই উদ্যোগ নিয়েছেন তাদের ধন্যবাদ।" },
  { name: "শরিফুল আলম", location: "চট্টগ্রাম", text: "আমি নিয়মিত রক্ত দান করি। এখানে নিবন্ধন করা খুব সহজ এবং নিরাপদ।" }
];

function parseStories(json: string): StoryItem[] {
  if (!json) return DEFAULT_STORIES;
  try {
    const parsed = JSON.parse(json) as StoryItem[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter((x) => x && x.name && x.text);
    }
  } catch { /* fall through */ }
  return DEFAULT_STORIES;
}

function Testimonials({ stories }: { stories: StoryItem[] }) {
  return (
    <section className="py-16 bg-red-50/30 dark:bg-gray-800/20 border-t border-red-50 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-10 dark:text-white">ডোনার ও গ্রহীতাদের অভিজ্ঞতা</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {stories.map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-red-100 dark:border-gray-700 shadow-sm relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-red-100 dark:text-gray-700 opacity-50" />
              <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{s.text}"</p>
              <div className="font-bold dark:text-white">{s.name}</div>
              <div className="text-xs text-gray-500">{s.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [rawSettings, counters] = await Promise.all([getSettings(), getLiveCounters()]);
  const langCookie = (await cookies()).get("rb_lang")?.value;
  const lang: Lang = langCookie === "en" ? "en" : "bn";
  const settings = lang === "en" ? { ...rawSettings, ...EN_SETTINGS } : rawSettings;
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar settings={settings} />
      {settings.announcement_enabled === "true" && settings.announcement_text && (
        <div className="bg-amber-400 text-gray-900 text-center text-sm font-semibold px-4 py-2.5">
          📢 {settings.announcement_text}
        </div>
      )}
      <main>
        <LiveTicker />
        <Hero settings={settings} />
        
        {/* Live Counters */}
        <section className="py-10 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "নিবন্ধিত দাতা", value: counters.totalDonors, icon: Heart },
                { label: "পূরণকৃত অনুরোধ", value: counters.fulfilledRequests, icon: MessageCircle },
                { label: "জেলা কভারেজ", value: counters.districtsCount, icon: Users }
              ].map((st) => (
                <div key={st.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 bg-red-50 dark:bg-red-900/20 text-red-600"><st.icon className="w-5 h-5" /></div>
                  <div className="text-xl font-bold dark:text-white">{st.value.toLocaleString("bn-BD")}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LiveBoard lang={lang} />

        <section id="search" className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10 dark:text-white">{settings.search_section_title}</h2>
            <DonorSearch districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>

        <section id="donor-form" className="py-16 bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center dark:text-white">{settings.donor_form_title}</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10">{settings.donor_form_desc}</p>
            <DonorRegistrationForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>

        <section id="request-form" className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center dark:text-white">{settings.request_form_title}</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10">{settings.request_form_desc}</p>
            <BloodRequestForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
          </div>
        </section>

        <Testimonials stories={parseStories(settings.stories_json)} />
      </main>

      {/* Floating Button */}
      <a href="#request-form" className="md:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-full shadow-2xl font-bold hover:scale-105 active:scale-95 transition-transform">
        <Droplet className="w-5 h-5" />
        <span>রক্ত চাই</span>
      </a>

      <section className="max-w-6xl mx-auto px-4 pb-10">
        <PushSubscribe />
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 pb-24 md:pb-12 border-t border-gray-800 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="font-bold text-white text-lg mb-2">{settings.site_name}</div>
          <p className="text-sm text-gray-400 mb-6">{settings.footer_tagline}</p>
          {(settings.whatsapp_url || settings.facebook_url) && (
            <div className="flex justify-center gap-3 mb-6">
              {settings.whatsapp_url && (
                <a href={settings.whatsapp_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-green-600 text-white hover:opacity-90">
                  <MessageCircle className="w-4 h-4" /> WhatsApp-এ যোগাযোগ
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:opacity-90">
                  Facebook পেজ
                </a>
              )}
            </div>
          )}
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-6 text-sm">
            <a href="/leaderboard" className="hover:text-white">🏆 শীর্ষ দাতা</a>
            <a href="/donor-card" className="hover:text-white">🪪 ডোনার কার্ড</a>
            <a href="/eligibility" className="hover:text-white">✅ যোগ্যতা যাচাই</a>
            <a href="/compatibility" className="hover:text-white">🩸 গ্রুপ চার্ট</a>
            <a href="/hospitals" className="hover:text-white">🏥 হাসপাতাল ও ব্লাড ব্যাংক</a>
            <a href="/ambulance" className="hover:text-white">🚑 অ্যাম্বুলেন্স</a>
            <a href="/faq" className="hover:text-white">❓ ভুল ধারণা ও সত্য</a>
            <a href="/thank-you" className="hover:text-white">💌 ধন্যবাদ কার্ড</a>
            <a href="/poster" className="hover:text-white">🖨️ পোস্টার</a>
            <a href="/about" className="hover:text-white">আমাদের সম্পর্কে</a>
            <a href="/privacy" className="hover:text-white">গোপনীয়তা নীতি</a>
          </nav>
          <div className="pt-6 border-t border-gray-800 text-sm text-gray-500">{settings.footer_copyright}</div>
        </div>
      </footer>
    </div>
  );
}
