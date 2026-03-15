"use client";

import React, { useState, useEffect } from "react";
import nextDynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import {
  Heart,
  Users,
  Phone,
  MessageCircle,
  Droplet,
  Quote,
  Search,
  Shield
} from "lucide-react";

// ── Dynamic client imports ────────────────────────────────────────────────────
const DarkModeToggle = nextDynamic(() => import("./DarkModeToggle"), { ssr: false });
const MobileMenu = nextDynamic(() => import("./MobileMenu"), { ssr: false });

// ── Components ────────────────────────────────

function Navbar({ settings }: { settings: any }) {
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

function Hero({ settings }: { settings: any }) {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20 bg-white dark:bg-gray-900 text-center">
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

        {/* Buttons Section (Linked to new pages) */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Link href="/search" className="w-full px-8 py-4 rounded-2xl text-white font-bold bg-red-600 shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
            <Search className="w-5 h-5" /> রক্তদাতা খুঁজুন
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="flex-1 px-8 py-3.5 rounded-xl text-white font-semibold bg-red-600 shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <Heart className="w-5 h-5" /> রক্ত দিন
            </Link>
            <Link href="/request" className="flex-1 px-8 py-3.5 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Phone className="w-5 h-5" /> রক্ত চান
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [current, setCurrent] = useState(0);
  const stories = [
    { name: "মাহিন আহমেদ", location: "শায়েস্তানগর, হবিগঞ্জ", text: "জরুরি প্রয়োজনে ও+ রক্ত খুব দ্রুত পেয়েছি। ধন্যবাদ এই প্ল্যাটফর্মকে।" },
    { name: "নিলয় হাসান", location: "চৌধুরী বাজার, হবিগঞ্জ", text: "আমি নিয়মিত রক্ত দান করি। এখানে নিবন্ধন করার প্রক্রিয়া খুবই সহজ।" },
    { name: "জুবায়ের আহমদ", location: "টাউন হল, হবিগঞ্জ", text: "হবিগঞ্জ সদরের ভেতরে রক্তদাতা খুঁজে পাওয়ার জন্য এটি সেরা মাধ্যম।" },
    { name: "আরমান চৌধুরী", location: "আদালত পাড়া, হবিগঞ্জ", text: "স্বেচ্ছায় রক্তদানে আগ্রহী সবার এই সাইটে নিবন্ধন করা উচিত।" },
    { name: "সাদিকুর রহমান", location: "নতুন মুন্সেফী, হবিগঞ্জ", text: "বি পজিটিভ রক্ত দরকার ছিল, ১০ মিনিটেই ডোনারের সাথে যোগাযোগ হয়েছে।" },
    { name: "ফয়সাল মাহমুদ", location: "কালীবাড়ি রোড, হবিগঞ্জ", text: "মানবিক কাজে প্রযুক্তির এমন ব্যবহার সত্যিই প্রশংসনীয়।" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % stories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [stories.length]);

  return (
    <section className="py-20 bg-red-50/20 dark:bg-gray-800/20 border-t border-red-50 dark:border-gray-800 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 dark:text-white">১০০+ ডোনার ও গ্রহীতাদের অভিজ্ঞতা</h2>
        <div className="relative min-h-[220px] md:min-h-[180px] flex items-center justify-center">
          {stories.map((s, i) => (
            <div
              key={i}
              className={`absolute w-full transition-all duration-700 ease-in-out ${
                i === current ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
              }`}
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-red-100 dark:border-gray-700 shadow-sm relative">
                <Quote className="absolute top-4 right-6 w-10 h-10 text-red-500/10 dark:text-red-500/5" />
                <p className="text-gray-700 dark:text-gray-300 italic mb-6 text-lg md:text-xl leading-relaxed px-4">"{s.text}"</p>
                <div className="inline-block px-4 py-1 bg-red-50 dark:bg-red-900/20 rounded-full mb-2 text-red-600 font-bold text-sm">{s.name}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-widest">{s.location}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {stories.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-red-600" : "w-2 bg-gray-300 dark:bg-gray-700"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getSettings().then(settings => setData({ settings, counters: { totalDonors: 95, fulfilledRequests: 5, districtsCount: 1 } }));
  }, []);

  if (!data) return <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-red-600 font-bold">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar settings={data.settings} />
      <main>
        <Hero settings={data.settings} />
        
        {/* Live Counters */}
        <section className="py-10 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "নিবন্ধিত দাতা", value: data.counters.totalDonors, icon: Heart },
                { label: "পূরণকৃত অনুরোধ", value: data.counters.fulfilledRequests, icon: MessageCircle },
                { label: "জেলা কভারেজ", value: data.counters.districtsCount, icon: Users }
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

        <Testimonials />
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12 pb-24 md:pb-12 border-t border-gray-800 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="font-bold text-white text-lg mb-2">{data.settings.site_name}</div>
          <p className="text-sm text-gray-400 mb-6">{data.settings.footer_tagline}</p>
          <div className="pt-6 border-t border-gray-800 text-sm text-gray-500">{data.settings.footer_copyright}</div>
        </div>
      </footer>
    </div>
  );
}
