"use client";

import { useState } from "react";
import SearchableSelect from "./SearchableSelect";

export default function BloodRequestForm({ districts, bloodGroups, settings }: any) {
  const [form, setForm] = useState({ district: "", bloodGroup: "" });

  return (
    <div className="space-y-4">
      <SearchableSelect
        options={bloodGroups?.map((bg: string) => ({ value: bg, label: bg })) || []}
        onChange={(val: string) => setForm({ ...form, bloodGroup: val })}
        placeholder={settings.field_bloodgroup}
      />
      <SearchableSelect
        options={districts?.map((d: any) => ({ value: d.name, label: d.name })) || []}
        onChange={(val: string) => setForm({ ...form, district: val })}
        placeholder={settings.field_district}
      />
      <button className="w-full py-4 bg-black text-white rounded-2xl font-bold">অনুরোধ পাঠান</button>
    </div>
  );
}
