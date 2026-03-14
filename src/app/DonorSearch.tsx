"use client";

import { useState } from "react";
import type { District } from "@/lib/geodata";
import SearchableSelect from "./SearchableSelect";
import { Search, Phone } from "lucide-react";

interface Donor {
  id: string;
  name: string;
  blood_group: string;
  district: string;
  upazila: string;
  phone: string;
  last_donation: string;
}

interface DonorSearchSettings {
  availability_days: string;
  show_whatsapp_btn: string;
  show_call_btn: string;
  empty_state_message: string;
  field_bloodgroup: string;
  field_district: string;
  field_upazila: string;
}

export default function DonorSearch({
  districts,
  bloodGroups,
  settings,
}: {
  districts: District[];
  bloodGroups: string[];
  settings: DonorSearchSettings;
}) {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const activeUpazilas = districts.find((d) => d.name === district)?.upazilas ?? [];

  async function handleSearch() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "approved", limit: "50" });
      if (bloodGroup) params.set("blood_group", bloodGroup);
      if (district) params.set("district", district);
      if (upazila) params.set("upazila", upazila);

      const res = await fetch(`/api/donors?${params.toString()}`);
      const data = await res.json();
      setDonors(data.donors ?? []);
    } catch (error) {
      setDonors([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">{settings.field_bloodgroup}</option>
            {bloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
          </select>

          <SearchableSelect
            options={districts.map((d) => ({ value: d.name, label: d.name }))}
            onChange={(val: string) => { setDistrict(val); setUpazila(""); }}
            placeholder={settings.field_district}
          />

          <select
            value={upazila}
            onChange={(e) => setUpazila(e.target.value)}
            disabled={!district}
            className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50"
          >
            <option value="">{settings.field_upazila}</option>
            {activeUpazilas.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
        >
          <Search className="w-5 h-5" />
          {loading ? "অনুসন্ধান করা হচ্ছে..." : "রক্তদাতা খুঁজুন"}
        </button>
      </div>

      {searched && (
        <div className="space-y-4">
          {donors.length > 0 ? (
            donors.map((donor) => (
              <div key={donor.id} className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{donor.name}</h3>
                  <p className="text-xs text-gray-500">{donor.district}, {donor.upazila}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-xs font-bold">
                    {donor.blood_group}
                  </span>
                </div>
                <div className="flex gap-2">
                  {settings.show_call_btn === "true" && (
                    <a href={`tel:${donor.phone}`} className="p-3 bg-green-500 text-white rounded-xl">
                      <Phone className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">{settings.empty_state_message}</div>
          )}
        </div>
      )}
    </div>
  );
}
