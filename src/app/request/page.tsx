"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BloodRequestForm from "../BloodRequestForm";
import { getSettings } from "@/lib/settings";
import { DISTRICTS, BLOOD_GROUPS } from "@/lib/geodata";

export default function RequestPage() {
  const [settings, setSettings] = useState<any>(null);
  useEffect(() => { 
    getSettings().then(setSettings); 
  }, []);
  
  if (!settings) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-10 px-4">
      <Link href="/" className="inline-flex items-center gap-2 text-red-600 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> ফিরে যান
      </Link>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 dark:text-white text-center text-red-600">রক্তের অনুরোধ</h2>
        <BloodRequestForm districts={DISTRICTS} bloodGroups={BLOOD_GROUPS} settings={settings} />
      </div>
    </div>
  );
}
