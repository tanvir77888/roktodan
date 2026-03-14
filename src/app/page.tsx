"use client";

import { useState } from "react";
import SearchableSelect from "./SearchableSelect";

export default function DonorSearch({ districts, bloodGroups, settings }: any) {
  const [query, setQuery] = useState({ bloodGroup: "", district: "", upazila: "" });

  const selectedDistrict = districts?.find((d: any) => d.name === query.district);
  const upazilas = selectedDistrict ? selectedDistrict.upazilas : [];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl space-y-4">
      <SearchableSelect
        options={bloodGroups?.map((bg: string) => ({ value: bg, label: bg })) || []}
        onChange={(val: string) => setQuery({ ...query, bloodGroup: val })}
        placeholder={settings.field_bloodgroup}
      />
      <SearchableSelect
        options={districts?.map((d: any) => ({ value: d.name, label: d.name })) || []}
        onChange={(val: string) => setQuery({ ...query, district: val, upazila: "" })}
        placeholder={settings.field_district}
      />
      <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold">খুঁজুন</button>
    </div>
  );
}
