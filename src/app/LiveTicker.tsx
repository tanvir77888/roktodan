// src/app/LiveTicker.tsx
import { sql } from "@/lib/db";

interface TickerDonor {
  full_name: string;
  blood_group: string;
  district: string;
}

interface TickerRequest {
  patient_name: string;
  blood_group: string;
  hospital_name: string;
  status: string;
}

export default async function LiveTicker() {
  let donors: TickerDonor[] = [];
  let requests: TickerRequest[] = [];
  try {
    donors = (await sql`
      SELECT full_name, blood_group, district FROM donors
      WHERE status = 'approved'
      ORDER BY id DESC LIMIT 6
    `) as unknown as TickerDonor[];
    requests = (await sql`
      SELECT patient_name, blood_group, hospital_name, status FROM blood_requests
      WHERE status IN ('approved', 'fulfilled')
      ORDER BY id DESC LIMIT 6
    `) as unknown as TickerRequest[];
  } catch {
    return null;
  }

  const items: string[] = [
    ...donors.map(
      (d) => `🩸 ${d.full_name} (${d.blood_group}) — ${d.district} থেকে নতুন ডোনার হিসেবে যোগ দিয়েছেন`
    ),
    ...requests.map((r) =>
      r.status === "fulfilled"
        ? `✅ ${r.hospital_name}-এ ${r.blood_group} রক্তের ব্যবস্থা হয়েছে, আলহামদুলিল্লাহ`
        : `🔴 জরুরি: ${r.hospital_name}-এ ${r.blood_group} রক্ত প্রয়োজন`
    ),
  ];

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div className="bg-gray-900 text-white overflow-hidden py-2.5 relative">
      <style>{`
        @keyframes rb-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .rb-ticker-track { animation: rb-ticker 45s linear infinite; }
        .rb-ticker-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="rb-ticker-track flex whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span key={i} className="mx-8 text-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
