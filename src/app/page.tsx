import nextDynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { sql } from "@/lib/db";
import type { SettingsMap } from "@/lib/settings";
import {
  Heart,
  Users,
  Shield,
  Phone,
  MessageCircle,
  Droplet,
  Search
} from "lucide-react";

// ── Client Components ────────────────────────────────────────────────────────
const DarkModeToggle = nextDynamic(() => import("./DarkModeToggle"), { ssr: false });
const MobileMenu = nextDynamic(() => import("./MobileMenu"), { ssr: false });

const TestimonialsSlider = nextDynamic(() => import("./TestimonialsSlider"), { 
  ssr: false,
  loading: () => <div className="h-40 flex items-center justify-center text-gray-400">অপেক্ষা করুন...</div>
});

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
    // এখানে এনিমেশন ক্লাস (animate-in) যোগ করা হয়েছে
    <section className="relative overflow-hidden py-12 sm:py-20 bg-white dark:bg-gray-900 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="absolute inset-0 opacity-5 bg-red-600 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white mb-6 bg-red-600">
          <Droplet className="w-4 h-4" />
          {settings.site_tagline}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{settings.hero_headline}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">{settings.hero_subheadline}</p>
        
        {/* Contact Cards */}
        <div className="flex flex-col gap-3 mb-10 max-w-xs mx-auto">
          {[
            { name: "Tanvir", phone: "01403520600" },
            { name: "Akash", phone: "01619720600" }
          ].map((c) => (
            <div key={c.phone} className="flex items-center justify-between bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/30 p-3 rounded-2xl shadow-sm hover:scale-105 transition-transform duration-300">
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
          <Link href="/search" className="w-full px-8 py-4 rounded-2xl text-white font-bold bg-red-600 shadow-lg flex items-center justify-center gap-2 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95">
            <Search className="w-5 h-5" /> রক্তদাতা খুঁজুন
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="flex-1 px-8 py-3.5 rounded-xl text-white font-semibold bg-red-600 shadow-md flex items-center justify-center gap-2 hover:bg-red-700 transition-all">
              <Heart className="w-5 h-5" /> রক্ত দিন
            </Link>
            <Link href="/request" className="flex-1 px-8 py-3.5 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <Phone className="w-5 h-5" /> রক্ত চান
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [settings, counters] = await Promise.all([getSettings(), getLiveCounters()]);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar settings={settings} />
      <main>
        <Hero settings={settings} />
        
        {/* Live Counters */}
        <section className="py-10 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 animate-in fade-in duration-1000 delay-300">
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

        <TestimonialsSlider />
      </main>

      {/* Floating Button Animation */}
      <Link href="/request" className="md:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-full shadow-2xl font-bold animate-bounce hover:animate-none transition-transform">
        <Droplet className="w-5 h-5" />
        <span>রক্ত চাই</span>
      </Link>

      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="font-bold text-white text-lg mb-2">{settings.site_name}</div>
          <p className="text-sm text-gray-400 mb-6">{settings.footer_tagline}</p>
          <div className="pt-6 border-t border-gray-800 text-sm text-gray-500">{settings.footer_copyright}</div>
        </div>
      </footer>
    </div>
  );
}
