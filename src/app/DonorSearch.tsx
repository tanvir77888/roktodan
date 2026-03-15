"use client";
import React, { useState } from "react";
import SearchableSelect from "./SearchableSelect";

export default function DonorSearch({ districts, bloodGroups, settings }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchableSelect label="রক্তের গ্রুপ" options={bloodGroups} onChange={() => {}} placeholder="গ্রুপ বাছুন" />
        <SearchableSelect label="জেলা" options={districts} onChange={() => {}} placeholder="জেলা বাছুন" />
      </div>
      <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
        খুঁজুন
      </button>
    </div>
  );
}
