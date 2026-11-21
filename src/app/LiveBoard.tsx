"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle, Droplet, Clock, Share2, AlertTriangle } from "lucide-react";
import { BOARD_STRINGS, type Lang } from "@/lib/i18n";

interface BoardRequest {
  id: number;
  patient_name: string;
  blood_group: string;
  units: number;
  hospital_name: string;
  district: string;
  contact_number: string;
  urgency: "critical" | "moderate" | "normal";
  additional_note: string | null;
  needed_by: string | null;
  created_at: string;
}

function countdownText(neededBy: string | null, now: number): string | null {
  if (!neededBy) return null;
  const diff = new Date(neededBy).getTime() - now;
  if (Number.isNaN(diff)) return null;
  if (diff <= 0) return "প্রয়োজনের সময় পার হয়ে গেছে";
  const mins = Math.floor(diff / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `আর ${d} দিন ${h % 24} ঘণ্টা বাকি`;
  }
  if (h > 0) return `আর ${h} ঘণ্টা ${m} মিনিট বাকি`;
  return `আর ${m} মিনিট বাকি`;
}

function shareText(r: BoardRequest): string {
  return [
    "🩸 জরুরি রক্তের প্রয়োজন!",
    `রোগী: ${r.patient_name}`,
    `রক্তের গ্রুপ: ${r.blood_group} (${r.units} ব্যাগ)`,
    `হাসপাতাল: ${r.hospital_name}, ${r.district}`,
    `যোগাযোগ: ${r.contact_number}`,
    "— Roktodan (রক্তদান)",
  ].join("\n");
}

export default function LiveBoard({ lang = "bn" }: { lang?: Lang }) {
  const t = BOARD_STRINGS[lang];
  const [requests, setRequests] = useState<BoardRequest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/requests?public=1&limit=20");
        const data = await res.json();
        if (!cancelled && data.success) setRequests(data.data?.requests ?? []);
      } catch {
        /* keep previous */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    load();
    const t = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  if (!loaded || requests.length === 0) return null;

  return (
    <section className="py-12 bg-red-50/60 dark:bg-gray-800/40 border-y border-red-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-2 dark:text-white flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
          </span>
          {t.title}
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          {t.subtitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((r) => {
            const cd = countdownText(r.needed_by, now);
            const isSos = r.urgency === "critical";
            return (
              <div
                key={r.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 shadow-sm ${
                  isSos ? "border-red-400 dark:border-red-700" : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{r.patient_name}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-600 text-white shrink-0">
                    {r.blood_group}
                  </span>
                </div>
                {isSos && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> {t.sos}
                  </span>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {r.hospital_name} · {r.district}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  <Droplet className="w-3.5 h-3.5 inline mr-1" />
                  {r.units} ব্যাগ লাগবে
                </p>
                {cd && (
                  <p className="text-sm font-medium text-red-600 mt-1">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    {cd}
                  </p>
                )}
                {r.additional_note && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{r.additional_note}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <a
                    href={`tel:${r.contact_number}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:opacity-90"
                  >
                    <Phone className="w-4 h-4" /> {t.call}
                  </a>
                  <a
                    href={`https://wa.me/880${r.contact_number.replace(/\D/g, "").replace(/^880/, "").replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:opacity-90"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareText(r))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={t.share}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
