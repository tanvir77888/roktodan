"use client";
import { useState } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { Phone, MessageCircle, Search } from "lucide-react";
import type { District } from "@/lib/geodata";
import SearchableSelect from "./SearchableSelect";
interface DonorSearchSettings {
  availability_days: string;
  show_whatsapp_btn: string;
  show_call_btn: string;
  empty_state_message: string;
  field_bloodgroup: string;
  field_district: string;
  field_upazila: string;
}
interface Donor {
  id: number;
  full_name: string;
  blood_group: string;
  district: string;
  upazila: string;
  phone: string;
  last_donation_date: string | null;
  image_url: string | null;
  status: string;
}
const BLOOD_GROUP_COLORS: Record<string, string> = {
  "A+": "bg-red-100 text-red-700",
  "A-": "bg-red-100 text-red-700",
  "B+": "bg-blue-100 text-blue-700",
  "B-": "bg-blue-100 text-blue-700",
  "AB+": "bg-purple-100 text-purple-700",
  "AB-": "bg-purple-100 text-purple-700",
  "O+": "bg-green-100 text-green-700",
  "O-": "bg-green-100 text-green-700",
};
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
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const upazilas = districts.find((d) => d.name === district)?.upazilas ?? [];
  const availabilityDays = parseInt(settings.availability_days, 10) || 90;
  function isAvailable(lastDonationDate: string | null): boolean {
    if (!lastDonationDate) return true;
    const days = differenceInDays(new Date(), parseISO(lastDonationDate));
    return days >= availabilityDays;
  }
  async function handleSearch() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "approved", limit: "50" });
      if (bloodGroup) params.set("bloodGroup", bloodGroup);
      if (district) params.set("district", district);
      if (upazila) params.set("upazila", upazila);
  const res = await fetch(`/api/donors?${params.toString()}`);
  const data = await res.json();
  setDonors(data.data?.donors ?? []);
} catch {
  setDonors([]);
} finally {
  setLoading(false);
  setSearched(true);
}

  }
  return (
    
      {/* Filters */}
      
              {settings.field_bloodgroup}
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
            >
              {bloodGroups.map((g) => (
              ))}
            
                          সব গ্রুপ                {g}          
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {settings.field_district}
        </label>
        <SearchableSelect
          value={district}
          onChange={(val) => { setDistrict(val); setUpazila(""); }}
          options={districts.map((d) => ({ value: d.name, label: d.name }))}
          placeholder="সব জেলা"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {settings.field_upazila}
        </label>
        <SearchableSelect
          value={upazila}
          onChange={setUpazila}
          options={upazilas.map((u) => ({ value: u, label: u }))}
          placeholder="সব উপজেলা"
          disabled={!district}
        />
      </div>
    </div>

    <button
      onClick={handleSearch}
      disabled={loading}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <Search className="w-4 h-4" />
      {loading ? "খোঁজা হচ্ছে..." : "খুঁজুন"}
    </button>
  </div>

  {/* Results */}
  {searched && (
    donors.length === 0 ? (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {settings.empty_state_message}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {donors.map((donor) => {
          const available = isAvailable(donor.last_donation_date);
          return (
            <div
              key={donor.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {donor.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={donor.image_url}
                      alt={donor.full_name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <span className="text-gray-400 text-lg font-semibold">
                        {donor.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                      {donor.full_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {donor.district}
                      {donor.upazila ? ` · ${donor.upazila}` : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    BLOOD_GROUP_COLORS[donor.blood_group] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {donor.blood_group}
                </span>
              </div>

              <div className="mb-4">
                {available ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    পাওয়া যাবে
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">
                    সম্প্রতি দান করেছেন
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {settings.show_call_btn === "true" && (
                  <a
                    href={`tel:${donor.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <Phone className="w-4 h-4" />
                    কল করুন
                  </a>
                )}
                {settings.show_whatsapp_btn === "true" && (
                  <a
                    href={`https://wa.me/880${donor.phone.replace(/\D/g, "").replace(/^880/, "").replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-green-600 text-white transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )
  )}
</div>

  );
}
