"use client";

import BloodRequestForm from "../BloodRequestForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { districts, bloodGroups } from "@/lib/geodata";

export default function RequestPage() {
  const settings = {
    request_success_msg: "অনুরোধ সফলভাবে পাঠানো হয়েছে।",
    field_patientname: "রোগীর নাম",
    field_bloodgroup: "রক্তের গ্রুপ",
    field_units: "রক্তের পরিমাণ",
    field_hospital: "হাসপাতালের নাম",
    field_district: "জেলা",
    field_contact: "যোগাযোগের নম্বর",
    field_urgency: "জরুরিতা",
    field_note: "অতিরিক্ত তথ্য",
    urgency_critical: "জরুরি",
    urgency_moderate: "মাঝারি",
    urgency_normal: "স্বাভাবিক",
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] p-6">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 mb-8">
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </Link>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">রক্তের অনুরোধ</h1>
        <BloodRequestForm districts={districts} bloodGroups={bloodGroups} settings={settings} />
      </div>
    </div>
  );
}
