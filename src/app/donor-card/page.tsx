// src/app/donor-card/page.tsx
"use client";

import { useState } from "react";
import { Droplet, Printer, Search } from "lucide-react";

interface DonorCard {
  id: number;
  full_name: string;
  blood_group: string;
  district: string;
  upazila: string;
  phone: string;
  last_donation_date: string | null;
  image_url: string | null;
  created_at: string;
}

function fmt(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function nextEligible(last: string | null): string {
  if (!last) return "এখনই দিতে পারবেন";
  const d = new Date(last);
  d.setDate(d.getDate() + 90);
  if (d.getTime() <= Date.now()) return "এখনই দিতে পারবেন";
  return fmt(d.toISOString());
}

export default function DonorCardPage() {
  const [phone, setPhone] = useState("");
  const [donor, setDonor] = useState<DonorCard | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFind(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 11) {
      setError("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।");
      return;
    }
    setLoading(true);
    setError("");
    setDonor(null);
    try {
      const res = await fetch(`/api/donors?search=${digits}&limit=10`);
      const data = await res.json();
      const list: DonorCard[] = data.data?.donors ?? [];
      const found = list.find((d) => d.phone.replace(/\D/g, "") === digits);
      if (found) setDonor(found);
      else setError("এই নম্বরে কোনো অনুমোদিত ডোনার পাওয়া যায়নি। আগে ডোনার হিসেবে নিবন্ধন করুন।");
    } catch {
      setError("সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  const waLink = donor
    ? `https://wa.me/880${donor.phone.replace(/\D/g, "").replace(/^880/, "").replace(/^0/, "")}`
    : "";
  const qrUrl = donor
    ? `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=8&data=${encodeURIComponent(waLink)}`
    : "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
            <Droplet className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ডোনার আইডি কার্ড</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            আপনার নিবন্ধিত মোবাইল নম্বর দিলেই ডিজিটাল আইডি কার্ড তৈরি হয়ে যাবে।
          </p>
        </div>

        <form onSubmit={handleFind} className="flex gap-2 mb-6 print:hidden">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            {loading ? "খোঁজা হচ্ছে..." : "কার্ড দেখুন"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {donor && (
          <div>
            <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-red-200">Roktho Bondhon</div>
                  <div className="text-lg font-bold">রক্তদাতা আইডি কার্ড</div>
                </div>
                <span className="bg-white text-red-700 font-black text-xl px-3 py-1 rounded-lg">
                  {donor.blood_group}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-5">
                {donor.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={donor.image_url}
                    alt={donor.full_name}
                    className="h-20 w-20 rounded-xl object-cover border-2 border-white/40"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-xl bg-white/15 flex items-center justify-center text-3xl font-bold">
                    {donor.full_name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-bold text-lg leading-tight">{donor.full_name}</div>
                  <div className="text-red-100 text-sm">{donor.district} · {donor.upazila}</div>
                  <div className="text-red-100 text-sm">📱 {donor.phone}</div>
                  <div className="text-red-200 text-xs mt-1">সদস্য: {fmt(donor.created_at)}</div>
                </div>
                <div className="ml-auto bg-white rounded-lg p-1 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="WhatsApp QR" className="h-[76px] w-[76px]" />
                </div>
              </div>
              <div className="text-[11px] text-red-200 mt-4">
                QR স্ক্যান করলে WhatsApp-এ যোগাযোগ করা যাবে · রক্ত দিন, জীবন বাঁচান ✊
              </div>
            </div>

            {/* Donation timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mt-4">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">🩸 দানের ইতিহাস</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">ডোনার হিসেবে নিবন্ধন</div>
                    <div className="text-xs text-gray-400">{fmt(donor.created_at)}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">সর্বশেষ রক্তদান</div>
                    <div className="text-xs text-gray-400">{fmt(donor.last_donation_date)}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">পরবর্তী দানের যোগ্য তারিখ</div>
                    <div className="text-xs text-gray-400">{nextEligible(donor.last_donation_date)}</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-600 text-red-600 font-semibold print:hidden"
            >
              <Printer className="w-4 h-4" /> কার্ড প্রিন্ট / সেভ করুন
            </button>
          </div>
        )}

        <div className="text-center mt-8 print:hidden">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
