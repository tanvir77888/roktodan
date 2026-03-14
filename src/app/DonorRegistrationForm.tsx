"use client";

import { useState } from "react";
import SearchableSelect from "./SearchableSelect";

export default function DonorRegistrationForm({ districts, bloodGroups, settings }: any) {
  const [regForm, setRegForm] = useState({ district: "", bloodGroup: "" });

  return (
    <div className="space-y-4">
      <SearchableSelect
        options={bloodGroups?.map((bg: string) => ({ value: bg, label: bg })) || []}
        onChange={(val: string) => setRegForm({ ...regForm, bloodGroup: val })}
        placeholder={settings.field_bloodgroup}
      />
      <SearchableSelect
        options={districts?.map((d: any) => ({ value: d.name, label: d.name })) || []}
        onChange={(val: string) => setRegForm({ ...regForm, district: val })}
        placeholder={settings.field_district}
      />
      <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold">নিবন্ধন করুন</button>
    </div>
  );
}
