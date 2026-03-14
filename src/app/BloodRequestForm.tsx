"use client";

import BloodRequestForm from "../BloodRequestForm";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { districts, bloodGroups } from "@/lib/geodata";

export default function RequestPage() {
  const settings = {
    request_success_msg: "আপনার রক্তের অনুরোধটি সফলভাবে পোস্ট করা হয়েছে।",
    field_patientname: "রোগীর নাম",
    field_bloodgroup: "রক্তের গ্রুপ",
    field_units: "রক্তের পরিমাণ (ব্যাগ)",
    field_hospital: "হাসপাতালের নাম ও ঠিকানা",
    field_district: "জেলা",
    field_contact: "যোগাযোগের নম্বর",
    field_urgency: "জরুরিতা",
    field_note: "অতিরিক্ত তথ্য বা মেসেজ",
    urgency_critical: "খুবই জরুরি (এখনই)",
    urgency_moderate: "আজকের মধ্যে",
    urgency_normal: "সাধারণ",
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] p-6 transition-colors duration-500 font-sans">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ফিরে যান
        </Link>

        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">রক্তের অনুরোধ</h1>
            <p className="text-sm text-gray-500 font-medium">রোগীর সঠিক তথ্য প্রদান করে দ্রুত সাহায্য পান।</p>
          </div>
        </div>

        <BloodRequestForm 
          districts={districts} 
          bloodGroups={bloodGroups} 
          settings={settings} 
        />
      </div>
    </div>
  );
}
