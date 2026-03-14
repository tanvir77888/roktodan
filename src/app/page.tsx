"use client";

import DonorSearch from "./DonorSearch";
import DonorRegistrationForm from "./DonorRegistrationForm";
import BloodRequestForm from "./BloodRequestForm";
import { districts, bloodGroups } from "@/lib/geodata";

export default function HomePage() {
  const settings = {
    availability_days: "90",
    show_whatsapp_btn: "true",
    show_call_btn: "true",
    empty_state_message: "দুঃখিত, কোনো রক্তদাতা পাওয়া যায়নি।",
    donor_success_msg: "অভিনন্দন! নিবন্ধন সফল হয়েছে।",
    request_success_msg: "আপনার অনুরোধটি সফলভাবে পাঠানো হয়েছে।",
    field_fullname: "পূর্ণ নাম",
    field_bloodgroup: "রক্তের গ্রুপ",
    field_district: "জেলা",
    field_upazila: "উপজেলা",
    field_phone: "ফোন নম্বর",
    field_lastdonation: "শেষ রক্তদানের তারিখ",
    field_gender: "লিঙ্গ",
    field_patientname: "রোগীর নাম",
    field_units: "রক্তের পরিমাণ (ব্যাগ)",
    field_hospital: "হাসপাতালের নাম",
    field_contact: "যোগাযোগ নম্বর",
    field_urgency: "জরুরিতা",
    field_note: "অতিরিক্ত তথ্য",
    urgency_critical: "খুবই জরুরি",
    urgency_moderate: "মাঝারি",
    urgency_normal: "স্বাভাবিক",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <nav className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black">R</div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">রক্তদান</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-6 py-12 space-y-16">
        {/* Search Section */}
        <section id="search">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">রক্তদাতা খুঁজুন</h2>
          <DonorSearch districts={districts} bloodGroups={bloodGroups} settings={settings} />
        </section>

        {/* Donate Section */}
        <section id="donate" className="pt-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">রক্তদাতা নিবন্ধন</h2>
          <DonorRegistrationForm districts={districts} bloodGroups={bloodGroups} settings={settings} />
        </section>

        {/* Request Section */}
        <section id="request" className="pt-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">রক্তের অনুরোধ</h2>
          <BloodRequestForm districts={districts} bloodGroups={bloodGroups} settings={settings} />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-400 text-sm">
        <p>© ২০২৬ রক্তদান প্ল্যাটফর্ম। সকল অধিকার সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
