"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DonorSearch from "../DonorSearch"; 
import { getSettings } from "@/lib/settings";
import { DISTRICTS, BLOOD_GROUPS } from "@/lib/geodata";
import { ArrowLeft } from "lucide-react";

export default function SearchPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  if (!settings) return <div className="p-10 text-center">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-red-600 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </Link>
        <h2 className="text-3xl font-bold mb-8 dark:text-white text-center">রক্তদাতা খুঁজুন</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl">
          <DonorSearch districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
        </div>
      </div>
    </div>
  );
}
