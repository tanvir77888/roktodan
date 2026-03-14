"use client";

import DonorRegistrationForm from "../DonorRegistrationForm";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { districts, bloodGroups } from "@/lib/geodata";

export default function DonatePage() {
  const settings = {
    donor_success_msg: "অভিনন্দন! রক্তদাতা হিসেবে আপনার নিবন্ধন সফল হয়েছে।",
    field_fullname: "আপনার পূর্ণ নাম",
    field_bloodgroup: "রক্তের গ্রুপ",
    field_district: "জেলা",
    field_upazila: "উপজেলা",
    field_phone: "ফোন নম্বর",
    field_lastdonation: "সর্বশেষ রক্তদানের তারিখ",
    field_gender: "লিঙ্গ",
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] p-6 transition-colors duration-500 font-sans">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ফিরে যান
        </Link>

        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">রক্তদাতা নিবন্ধন</h1>
            <p className="text-sm text-gray-500 font-medium italic">আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি প্রাণ।</p>
          </div>
        </div>

        <DonorRegistrationForm 
          districts={districts} 
          bloodGroups={bloodGroups} 
          settings={settings} 
        />
      </div>
    </div>
  );
}
