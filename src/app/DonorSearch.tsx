"use client";

import DonorSearch from "../DonorSearch";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { districts, bloodGroups } from "@/lib/geodata";

export default function SearchPage() {
  // আপনার ডিফল্ট সেটিংস
  const settings = {
    availability_days: "90",
    show_whatsapp_btn: "true",
    show_call_btn: "true",
    empty_state_message: "দুঃখিত, এই এলাকায় কোনো রক্তদাতা পাওয়া যায়নি।",
    field_bloodgroup: "রক্তের গ্রুপ",
    field_district: "জেলা",
    field_upazila: "উপজেলা",
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] p-6 transition-colors duration-500 font-sans">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ফিরে যান
        </Link>
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">রক্তদাতা খুঁজুন</h1>
          <p className="text-sm text-gray-500 font-medium">সঠিক গ্রুপ এবং এলাকা নির্বাচন করে সার্চ করুন।</p>
        </div>

        <DonorSearch 
          districts={districts} 
          bloodGroups={bloodGroups} 
          settings={settings} 
        />
      </div>
    </div>
  );
        }
