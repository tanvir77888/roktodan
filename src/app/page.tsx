import nextDynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { sql } from "@/lib/db";
import type { SettingsMap } from "@/lib/settings";
import {
  Heart,
  Users,
  Phone,
  MessageCircle,
  Droplet,
  Search,
  Shield
} from "lucide-react";

// ডাইনামিক ইমপোর্ট (স্লাইডার ফাইলটি থাকতে হবে)
const DarkModeToggle = nextDynamic(() => import("./DarkModeToggle"), { ssr: false });
const MobileMenu = nextDynamic(() => import("./MobileMenu"), { ssr: false });
const TestimonialsSlider = nextDynamic(() => import("./TestimonialsSlider"), { ssr: false });

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

// ── CSS এনিমেশন (সাদা পেজ হওয়ার ঝামেলা নেই) ──────────────────
const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-reveal {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  .hover-pop {
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .hover-pop:active {
    transform: scale(0.95);
  }
`;

function Navbar({ settings }: { settings: SettingsMap }) {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm font-bengali">
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
          <Link href="/admin" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero({ settings }: { settings: SettingsMap }) {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20 bg-white dark:bg-gray-900 text-center animate-reveal font-bengali">
      <style>{animationStyles}</style>
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white mb-6 bg-red-600 shadow-md">
          <Droplet className="w-4 h-4 animate-bounce" />
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
            <div key={c.phone} className="hover-pop flex items-center justify-between bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/30 p-3 rounded-2xl shadow-sm">
              <div className="flex flex-col text-left">
                <span className="font-bold text-gray-800 dark:text-gray-100">{c.name}</span>
                <span className="text-xs text-gray-500 font-sans">{c.phone}</span>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${c.phone}`} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"><Phone className="w-5 h-5" /></a>
                <a href={`https://wa.me/88${c.phone}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all"><MessageCircle className="w-5 h-5" /></a>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons - Linking to Separate Pages */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Link href="/search" className="hover-pop w-full px-8 py-4 rounded-2xl text-white font-bold bg-red-600 shadow-xl flex items-center justify-center gap-2">
            <Search className="w-5 h-5" /> রক্তদাতা খুঁজুন
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="hover-pop flex-1 px-8 py-3.5 rounded-xl text-white font-semibold bg-red-500 shadow-md flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" /> রক্ত দিন
            </Link>
            <Link href="/request" className="hover-pop flex-1 px-8 py-3.5 rounded-xl font-semibold border-2 border-red-600 text-red-600 dark:text-red-500 flex items-center justify-center gap-2">
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
      <main className="animate-reveal" style={{ animationDelay: '0.2s' }}>
        <Hero settings={settings} />
        
        {/* Live Counters */}
        <section className="py-10 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 font-bengali">
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

        {/* স্লাইডার সেকশন */}
        <TestimonialsSlider />
      </main>

      {/* Floating Request Button for Mobile */}
      <Link href="/request" className="md:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-full shadow-2xl font-bold hover:scale-105 active:scale-95 transition-transform font-bengali">
        <Droplet className="w-5 h-5" />
        <span>রক্ত চাই</span>
      </Link>

      <footer className="bg-gray-900 text-gray-300 py-12 pb-24 md:pb-12 border-t border-gray-800 text-center font-bengali">
        <div className="max-w-6xl mx-auto px-4">
          <div className="font-bold text-white text-lg mb-2">{settings.site_name}</div>
          <p className="text-sm text-gray-400 mb-6">{settings.footer_tagline}</p>
          <div className="pt-6 border-t border-gray-800 text-sm text-gray-500 font-sans">{settings.footer_copyright}</div>
        </div>
      </footer>
    </div>
  );
}
