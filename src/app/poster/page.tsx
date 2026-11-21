// src/app/poster/page.tsx
import { getSettings } from "@/lib/settings";
import { Droplet, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PosterPage() {
  const settings = await getSettings();
  const siteUrl = "https://roktodan2.vercel.app";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=10&data=${encodeURIComponent(siteUrl)}`;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-[760px] mx-auto">
        <div className="bg-white rounded-none sm:rounded-2xl shadow-lg overflow-hidden print:shadow-none">
          <div className="bg-gradient-to-br from-red-700 to-red-900 text-white text-center px-6 py-10">
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
              <Droplet className="w-9 h-9" />
            </div>
            <div className="text-4xl sm:text-5xl font-black leading-tight">রক্ত দিন,</div>
            <div className="text-4xl sm:text-5xl font-black leading-tight">জীবন বাঁচান ✊</div>
            <p className="text-red-100 mt-3 text-base">
              জরুরি রক্তের প্রয়োজনে ডোনার খুঁজুন, অথবা ডোনার হিসেবে নিবন্ধন করুন — সম্পূর্ণ ফ্রি।
            </p>
          </div>

          <div className="px-6 py-8 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="ওয়েবসাইটের QR কোড" className="mx-auto h-56 w-56" />
            <div className="font-bold text-gray-900 text-lg mt-3">QR স্ক্যান করলেই ওয়েবসাইট খুলবে</div>
            <div className="text-gray-500 text-sm">{siteUrl}</div>

            <div className="grid grid-cols-3 gap-3 mt-8 text-center">
              {["A+", "B+", "O+"].map((g) => (
                <div key={g} className="bg-red-50 rounded-xl py-3">
                  <div className="font-black text-red-600 text-xl">{g}</div>
                  <div className="text-[11px] text-gray-500">সহ সব গ্রুপ</div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-1.5 text-gray-800">
              <div className="flex items-center justify-center gap-2 font-semibold">
                <Phone className="w-4 h-4 text-red-600" />
                হেল্পলাইন: {settings.helpline_1_name} — {settings.helpline_1_phone}
              </div>
              <div className="flex items-center justify-center gap-2 font-semibold">
                <Phone className="w-4 h-4 text-red-600" />
                {settings.helpline_2_name} — {settings.helpline_2_phone}
              </div>
              <div className="text-sm text-gray-500 mt-2">{settings.site_name}</div>
            </div>
          </div>
        </div>

        <p className="print:hidden text-center text-sm text-gray-500 mt-5">
          প্রিন্ট করতে কীবোর্ডে <strong>Ctrl + P</strong> চাপুন (মোবাইলে ব্রাউজার মেনু → Share → Print)।
          মসজিদ, দোকান বা হাসপাতালের নোটিশ বোর্ডে লাগানোর জন্য এই পোস্টার।
        </p>

        <div className="text-center mt-6 print:hidden">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
