"use client";

import { useState } from "react";
import { Phone, MessageCircle, Search, Loader2 } from "lucide-react";

interface Donor {
  id: number;
  full_name: string;
  blood_group: string;
  district: string;
  upazila: string;
  phone: string;
  image_url: string | null;
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

export default function HeroNameSearch() {
  const [query, setQuery] = useState("");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ search: q, limit: "50" });
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
    <div className="max-w-xl mx-auto mb-8">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 border-2 border-red-100 dark:border-red-900/30 rounded-2xl p-2 shadow-sm focus-within:border-red-300 transition-colors"
      >
        <Search className="w-5 h-5 text-gray-400 ml-2 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="রক্তদাতার নাম দিয়ে খুঁজুন"
          aria-label="রক্তদাতার নাম দিয়ে খুঁজুন"
          className="flex-1 min-w-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 px-1 py-2 text-base focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-semibold bg-red-600 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "খোঁজা হচ্ছে..." : "খুঁজুন"}
        </button>
      </form>

      {searched && (
        donors.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            এই নামে কোনো রক্তদাতা পাওয়া যায়নি
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-left">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {donor.full_name}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      BLOOD_GROUP_COLORS[donor.blood_group] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {donor.blood_group}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {donor.district}
                  {donor.upazila ? ` · ${donor.upazila}` : ""}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">
                  {donor.phone}
                </p>
                <div className="flex gap-2 mt-3">
                  <a
                    href={`tel:${donor.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600 transition-opacity hover:opacity-90"
                  >
                    <Phone className="w-4 h-4" />
                    কল করুন
                  </a>
                  <a
                    href={`https://wa.me/880${donor.phone.replace(/\D/g, "").replace(/^880/, "").replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-green-600 text-white transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
