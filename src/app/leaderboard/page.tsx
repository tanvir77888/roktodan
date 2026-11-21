// src/app/leaderboard/page.tsx
import { sql } from "@/lib/db";
import { Trophy, Droplet, BadgeCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface LeaderRow {
  id: number;
  full_name: string;
  blood_group: string;
  district: string;
  upazila: string;
  last_donation_date: string;
  image_url: string | null;
}

export default async function LeaderboardPage() {
  let rows: LeaderRow[] = [];
  try {
    rows = (await sql`
      SELECT id, full_name, blood_group, district, upazila,
             last_donation_date::text AS last_donation_date, image_url
      FROM donors
      WHERE status = 'approved' AND last_donation_date IS NOT NULL
      ORDER BY last_donation_date DESC
      LIMIT 50
    `) as unknown as LeaderRow[];
  } catch {
    rows = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            🏆 আমাদের গর্ব — সাম্প্রতিক রক্তদাতারা
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            যারা সম্প্রতি রক্ত দিয়ে মানুষের জীবন বাঁচিয়েছেন। আপনাদের প্রতি কৃতজ্ঞতা ❤️
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500">
            এখনো তালিকা তৈরি হয়নি।
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((d, i) => (
              <div
                key={d.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 shadow-sm"
              >
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    i === 0
                      ? "bg-amber-100 text-amber-700"
                      : i === 1
                        ? "bg-gray-200 text-gray-600"
                        : i === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {i + 1}
                </span>
                {d.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={d.image_url}
                    alt={d.full_name}
                    className="h-11 w-11 rounded-full object-cover border border-gray-100 shrink-0"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <Droplet className="w-5 h-5 text-red-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                    {d.full_name}
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                      <BadgeCheck className="w-3 h-3" /> নিয়মিত দাতা
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {d.district} · {d.upazila}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-red-600">{d.blood_group}</div>
                  <div className="text-[11px] text-gray-400">
                    শেষ দান: {new Date(d.last_donation_date).toLocaleDateString("bn-BD")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
