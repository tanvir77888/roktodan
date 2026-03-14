"use client";

import DonorSearch from "../DonorSearch";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { districts, bloodGroups } from "@/lib/geodata";

export default function SearchPage() {
  const settings = {
    availability_days: "90",
    show_whatsapp_btn: "true",
    show_call_btn: "true",
    empty_state_message: "দুঃখিত, কোনো রক্তদাতা পাওয়া যায়নি।",
    field_bloodgroup: "রক্তের গ্রুপ",
    field_district: "জেলা",
    field_upazila: "উপজেলা",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-6">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 mb-8">
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </Link>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-8">রক্তদাতা খুঁজুন</h1>
        <DonorSearch districts={districts} bloodGroups={bloodGroups} settings={settings} />
      </div>
    </div>
  );
}
