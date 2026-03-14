"use client";
import BloodRequestForm from "../BloodRequestForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { districts, bloodGroups } from "@/lib/geodata";

export default function RequestPage() {
  const settings = {
    request_success_msg: "অনুরোধ পাঠানো হয়েছে।",
    field_patientname: "রোগীর নাম", field_bloodgroup: "রক্তের গ্রুপ",
    field_units: "ব্যাগ", field_hospital: "হাসপাতাল",
    field_district: "জেলা", field_contact: "ফোন নম্বর",
    field_urgency: "জরুরিতা", field_note: "নোট",
    urgency_critical: "জরুরি", urgency_moderate: "মাঝারি", urgency_normal: "স্বাভাবিক",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 mb-6"><ArrowLeft className="w-4 h-4" /> ফিরে যান</Link>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-black mb-6">রক্তের অনুরোধ</h1>
        <BloodRequestForm districts={districts} bloodGroups={bloodGroups} settings={settings} />
      </div>
    </div>
  );
}
