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
  Award,
  Phone,
  MessageCircle,
  Facebook,
  Droplet,
} from "lucide-react";

// ── Dynamic client imports ────────────────────────────────────────────────────

const DonorSearch = nextDynamic(() => import("./DonorSearch"), { ssr: false });
const DonorRegistrationForm = nextDynamic(() => import("./DonorRegistrationForm"), { ssr: false });
const BloodRequestForm = nextDynamic(() => import("./BloodRequestForm"), { ssr: false });
const DarkModeToggle = nextDynamic(() => import("./DarkModeToggle"), { ssr: false });
const MobileMenu = nextDynamic(() => import("./MobileMenu"), { ssr: false });

export const revalidate = 0;

// ── Icon map for WhyDonate cards ──────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Heart,
  Users,
  Shield,
  Award,
  Phone,
  MessageCircle,
  Droplet,
};

// ── Live counter data type ────────────────────────────────────────────────────

interface LiveCounters {
  totalDonors: number;
  fulfilledRequests: number;
  districtsCount: number;
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getLiveCounters(): Promise<LiveCounters> {
  const [donorRows, requestRows, districtRows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM donors WHERE status = 'approved'`,
    sql`SELECT COUNT(*)::int AS count FROM blood_requests WHERE status = 'fulfilled'`,
    sql`SELECT COUNT(DISTINCT district)::int AS count FROM donors WHERE status = 'approved'`,
  ]);

  return {
    totalDonors: parseInt(String(donorRows[0]?.count ?? 0), 10),
    fulfilledRequests: parseInt(String(requestRows[0]?.count ?? 0), 10),
    districtsCount: parseInt(String(districtRows[0]?.count ?? 0), 10),
  };
}

// ── Sub-components (server-renderable, inline) ────────────────────────────────

function Navbar({
  settings,
}: {
  settings: SettingsMap;
}) {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo / Site name */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {settings.logo_url ? (
              <Image
                src={settings.logo_url}
                alt={settings.site_name}
                width={36}
                height={36}
                className="rounded-full object-contain"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Droplet className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {settings.site_name}
            </span>
          </div>

{/* Center nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <a
              href="#search"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              রক্তদাতা খুঁজুন
            </a>
            <a
              href="#donor-form"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              নিবন্ধন করুন
            </a>
            <a
              href="#request-form"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              রক্ত চান
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {settings.show_dark_mode_toggle === "true" && (
              <DarkModeToggle />
            )}
            <MobileMenu />
            <a
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero({ settings }: { settings: SettingsMap }) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundColor: "var(--color-primary)" }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white mb-6"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Droplet className="w-4 h-4" />
          {settings.site_tagline}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {settings.hero_headline}
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          {settings.hero_subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#donor-form"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base shadow-md transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Heart className="w-5 h-5" />
            {settings.hero_btn1_label}
          </a>
          <a
            href="#request-form"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base border-2 transition-colors text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Phone className="w-5 h-5" />
            {settings.hero_btn2_label}
          </a>
        </div>
      </div>
    </section>
  );
}

function LiveCounters({
  counters,
}: {
  counters: LiveCounters;
}) {
  const stats = [
    { label: "নিবন্ধিত দাতা", value: counters.totalDonors, icon: Heart },
    { label: "পূরণকৃত অনুরোধ", value: counters.fulfilledRequests, icon: MessageCircle },
    { label: "জেলা কভারেজ", value: counters.districtsCount, icon: Users },
  ];

  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto"
                style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) 15%, transparent)` }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: "var(--color-primary)" }}
                />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {value.toLocaleString("bn-BD")}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyDonate({ settings }: { settings: SettingsMap }) {
  const cards = [
    {
      icon: settings.why_donate_1_icon,
      text: settings.why_donate_1_text,
    },
    {
      icon: settings.why_donate_2_icon,
      text: settings.why_donate_2_text,
    },
    {
      icon: settings.why_donate_3_icon,
      text: settings.why_donate_3_text,
    },
    {
      icon: settings.why_donate_4_icon,
      text: settings.why_donate_4_text,
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          {settings.why_donate_title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ icon, text }, index) => {
            const IconComponent = ICON_MAP[icon] ?? Heart;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 mx-auto"
                  style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) 15%, transparent)` }}
                >
                  <IconComponent
                    className="w-7 h-7"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  {text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer({ settings }: { settings: SettingsMap }) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Brand — always centered */}
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-white text-lg">{settings.site_name}</div>
          </div>
          {settings.footer_tagline && (
            <p className="text-sm text-gray-400">{settings.footer_tagline}</p>
          )}
        </div>

        {/* Social links — centered, only shown if any exist */}
        {(settings.facebook_url || settings.whatsapp_url || settings.email_address) && (
          <div className="flex items-center justify-center gap-5 mb-6">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.whatsapp_url && (
              <a
                href={settings.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            )}
            {settings.email_address && (
                <a
                href={`mailto:${settings.email_address}`}
                className="hover:text-white transition-colors text-sm"
              >
                {settings.email_address}
              </a>
            )}
          </div>
        )}

        {/* Copyright */}
        {settings.footer_copyright && (
          <div className="pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
            {settings.footer_copyright}
          </div>
        )}

      </div>
    </footer>
  );
}
// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [settings, counters] = await Promise.all([
    getSettings(),
    getLiveCounters(),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar settings={settings} />

      <main>
        <Hero settings={settings} />

        {settings.show_live_counters === "true" && (
          <LiveCounters counters={counters} />
        )}

        {/* Donor search — client interactive */}
        <section id="search" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
              {settings.search_section_title}
            </h2>
            <DonorSearch
              districts={DISTRICTS}
              bloodGroups={BLOOD_GROUPS}
              settings={{
                availability_days: settings.availability_days,
                show_whatsapp_btn: settings.show_whatsapp_btn,
                show_call_btn: settings.show_call_btn,
                empty_state_message: settings.empty_state_message,
                field_bloodgroup: settings.field_bloodgroup,
                field_district: settings.field_district,
                field_upazila: settings.field_upazila,
              }}
            />
          </div>
        </section>

        {/* Donor registration — client interactive */}
        <section id="donor-form" className="py-16 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {settings.donor_form_title}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {settings.donor_form_desc}
              </p>
            </div>
            <DonorRegistrationForm
              districts={DISTRICTS}
              bloodGroups={BLOOD_GROUPS}
              settings={{
                donor_success_msg: settings.donor_success_msg,
                field_fullname: settings.field_fullname,
                field_bloodgroup: settings.field_bloodgroup,
                field_district: settings.field_district,
                field_upazila: settings.field_upazila,
                field_phone: settings.field_phone,
                field_lastdonation: settings.field_lastdonation,
                field_gender: settings.field_gender,
              }}
            />
          </div>
        </section>

        {/* Blood request — client interactive */}
        <section id="request-form" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {settings.request_form_title}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {settings.request_form_desc}
              </p>
            </div>
            <BloodRequestForm
              districts={DISTRICTS}
              bloodGroups={BLOOD_GROUPS}
              settings={{
                request_success_msg: settings.request_success_msg,
                field_patientname: settings.field_patientname,
                field_bloodgroup: settings.field_bloodgroup,
                field_units: settings.field_units,
                field_hospital: settings.field_hospital,
                field_district: settings.field_district,
                field_contact: settings.field_contact,
                field_urgency: settings.field_urgency,
                field_note: settings.field_note,
                urgency_critical: settings.urgency_critical,
                urgency_moderate: settings.urgency_moderate,
                urgency_normal: settings.urgency_normal,
              }}
            />
          </div>
        </section>

        {settings.show_why_donate === "true" && (
          <WhyDonate settings={settings} />
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}