"use client";

import DonorRegistrationForm from "../DonorRegistrationForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { districts, bloodGroups } from "@/lib/geodata";

export default function DonatePage() {
  const settings = {
    donor_success_msg: "অভিনন্দন! নিবন্ধন সফল হয়েছে।",
    field_fullname: "আপনার পূর্ণ নাম",
    field_bloodgroup: "রক্তের গ্রুপ",
    field_district: "জেলা",
    field_upazila: "উপজেলা",
    field_phone: "ফোন নম্বর",
    field_lastdonation: "সর্বশেষ রক্তদানের তারিখ",
    field_gender: "লিঙ্গ",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-6">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 mb-8">
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </Link>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-8">রক্তদাতা নিবন্ধন</h1>
        <DonorRegistrationForm districts={districts} bloodGroups={bloodGroups} settings={settings} />
      </div>
    </div>
  );
}
