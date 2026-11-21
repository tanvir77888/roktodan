// src/app/admin/reminders/page.tsx
import { sql } from "@/lib/db";
import { BellRing, RefreshCcw, Cake } from "lucide-react";

export const dynamic = "force-dynamic";

interface DonorRow {
  id: number;
  full_name: string;
  blood_group: string;
  district: string;
  phone: string;
  last_donation_date: string | null;
  created_at: string;
}

function waNumber(phone: string): string {
  return `880${phone.replace(/\D/g, "").replace(/^880/, "").replace(/^0/, "")}`;
}

function waLink(phone: string, text: string): string {
  return `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(text)}`;
}

async function safeRows(promise: Promise<unknown>): Promise<DonorRow[]> {
  try {
    return (await promise) as DonorRow[];
  } catch {
    return [];
  }
}

export default async function AdminRemindersPage() {
  // Donors eligible again: last donation 90+ days ago (remind within a 120-day window)
  const eligibleAgain = await safeRows(sql`
    SELECT id, full_name, blood_group, district, phone,
           last_donation_date::text AS last_donation_date, created_at::text AS created_at
    FROM donors
    WHERE status = 'approved' AND last_donation_date IS NOT NULL
      AND last_donation_date <= CURRENT_DATE - INTERVAL '90 days'
      AND last_donation_date > CURRENT_DATE - INTERVAL '240 days'
    ORDER BY last_donation_date ASC
    LIMIT 100
  `);

  // Re-confirmation: registered 180+ days ago and no donation recorded in last 180 days
  const reconfirm = await safeRows(sql`
    SELECT id, full_name, blood_group, district, phone,
           last_donation_date::text AS last_donation_date, created_at::text AS created_at
    FROM donors
    WHERE status = 'approved'
      AND created_at <= NOW() - INTERVAL '180 days'
      AND (last_donation_date IS NULL OR last_donation_date <= CURRENT_DATE - INTERVAL '180 days')
    ORDER BY created_at ASC
    LIMIT 100
  `);

  // Membership anniversary this month
  const anniversary = await safeRows(sql`
    SELECT id, full_name, blood_group, district, phone,
           last_donation_date::text AS last_donation_date, created_at::text AS created_at
    FROM donors
    WHERE status = 'approved'
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW())
      AND created_at <= NOW() - INTERVAL '11 months'
    ORDER BY created_at ASC
    LIMIT 100
  `);

  const section = (
    title: string,
    icon: React.ReactNode,
    desc: string,
    rows: DonorRow[],
    message: (d: DonorRow) => string,
    buttonLabel: string
  ) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-1">
        {icon} {title}
        <span className="text-sm font-normal text-gray-400">({rows.length} জন)</span>
      </h2>
      <p className="text-sm text-gray-500 mb-4">{desc}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">এই তালিকায় এখন কেউ নেই।</p>
      ) : (
        <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
          {rows.map((d) => (
            <div key={d.id} className="py-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-medium text-gray-800">{d.full_name}</span>
              <span className="font-bold text-red-600">{d.blood_group}</span>
              <span className="text-gray-500">{d.district}</span>
              <span className="text-gray-400">📱 {d.phone}</span>
              {d.last_donation_date && (
                <span className="text-gray-400 text-xs">
                  শেষ দান: {new Date(d.last_donation_date).toLocaleDateString("bn-BD")}
                </span>
              )}
              <a
                href={waLink(d.phone, message(d))}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:opacity-90"
              >
                {buttonLabel}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">রিমাইন্ডার ও শুভেচ্ছা</h1>
        <p className="text-sm text-gray-500 mt-1">
          সব মেসেজ আপনার নিজের WhatsApp থেকে যাবে — সম্পূর্ণ ফ্রি। বাটনে চাপ দিলেই লেখা তৈরি অবস্থায়
          WhatsApp খুলবে, আপনি শুধু Send চাপবেন।
        </p>
      </div>

      {section(
        "আবার রক্ত দেওয়ার সময় হয়েছে",
        <BellRing size={18} className="text-green-600" />,
        "যাদের শেষ দানের ৯০ দিন পেরিয়ে গেছে — তাদের জানিয়ে দিন তারা আবার দান করতে পারবেন।",
        eligibleAgain,
        (d) =>
          `আসসালামু আলাইকুম ${d.full_name}, Roktho Bondhon থেকে বলছি। আপনার শেষ রক্তদানের ৯০ দিন পেরিয়ে গেছে — আপনি আবার রক্ত দিতে পারবেন। জরুরি প্রয়োজনে আমরা আপনাকে কল করতে পারি তো? ধন্যবাদ ❤️`,
        "WhatsApp রিমাইন্ডার"
      )}

      {section(
        "তথ্য পুনঃনিশ্চিত করুন (রি-কনফার্ম)",
        <RefreshCcw size={18} className="text-blue-600" />,
        "৬ মাসের বেশি আগে নিবন্ধন করা ডোনার — এখনো আগ্রহী ও একই এলাকায় আছেন কিনা যাচাই করুন।",
        reconfirm,
        (d) =>
          `আসসালামু আলাইকুম ${d.full_name}, Roktho Bondhon থেকে বলছি। আপনি আমাদের রক্তদাতা তালিকায় আছেন (${d.blood_group}, ${d.district})। আপনি কি এখনো রক্ত দিতে আগ্রহী? উত্তর 'হ্যাঁ' লিখে পাঠালেই আপনার তথ্য নিশ্চিত হয়ে যাবে। ধন্যবাদ ❤️`,
        "WhatsApp যাচাই"
      )}

      {section(
        "সদস্য বার্ষিকীর শুভেচ্ছা",
        <Cake size={18} className="text-pink-600" />,
        "এই মাসে যাদের Roktho Bondhon-এ যোগ দেওয়ার এক বছর (বা বেশি) পূর্ণ হলো।",
        anniversary,
        (d) =>
          `শুভ বার্ষিকী ${d.full_name}! 🎉 Roktho Bondhon পরিবারে আপনার এক বছর পূর্ণ হলো। আপনার মতো ডোনারদের জন্যই মানুষের জীবন বাঁচে। পাশে থাকার জন্য ধন্যবাদ ❤️`,
        "WhatsApp শুভেচ্ছা"
      )}
    </div>
  );
}
