"use client";
import React from "react";
import SearchableSelect from "./SearchableSelect";

export default function BloodRequestForm({ districts, bloodGroups, settings }: any) {
  return (
    <form className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <input type="text" placeholder="রোগীর সমস্যা" className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600" />
      <div className="grid grid-cols-2 gap-4">
        <SearchableSelect label="রক্তের গ্রুপ" options={bloodGroups} onChange={() => {}} placeholder="প্রয়োজনীয় গ্রুপ" />
        <SearchableSelect label="জেলা" options={districts} onChange={() => {}} placeholder="কোথায় লাগবে" />
      </div>
      <input type="tel" placeholder="যোগাযোগের নম্বর" className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600" />
      <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold">অনুরোধ পাঠান</button>
    </form>
  );
}
