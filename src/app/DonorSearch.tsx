"use client";

import { useState } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { Phone, MessageCircle, Search, Eye, Flag, BadgeCheck } from "lucide-react";
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
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [reportedIds, setReportedIds] = useState<Set<number>>(new Set());

  function maskPhone(phone: string): string {
    const d = phone.replace(/\D/g, "");
    if (d.length < 7) return phone;
    return `${d.slice(0, 3)}•••••${d.slice(-2)}`;
  }

  function isRegularDonor(lastDonationDate: string | null): boolean {
    if (!lastDonationDate) return false;
    return differenceInDays(new Date(), parseISO(lastDonationDate)) <= 365;
  }

  async function handleReport(donor: Donor) {
    if (reportedIds.has(donor.id)) return;
    if (!window.confirm(`"${donor.full_name}"-এর নম্বরটি ভুয়া বলে রিপোর্ট করতে চান? এডমিন যাচাই করবেন।`)) return;
    try {
      const res = await fetch("/api/donors/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donor_id: donor.id }),
      });
      if (res.ok) {
        setReportedIds((prev) => new Set(prev).add(donor.id));
      }
    } catch {
      /* silent */
    }
  }

  const upazilas = districts.find((d) => d.name === district)?.upazilas ?? [];
  const availabilityDays = parseInt(settings.availability_days, 10) || 90;

  function isAvailable(lastDonationDate: string | null): boolean {
    if (!lastDonationDate) return true;
    const days = differenceInDays(new Date(), parseISO(lastDonationDate));
    return days >= availabilityDays;
  }

  async function runSearch(pageNum: number, append: boolean, groupOverride?: string) {
    setLoading(true);
    try {
      const group = groupOverride !== undefined ? groupOverride : bloodGroup;
      const params = new URLSearchParams({ status: "approved", limit: "24", page: String(pageNum) });
      if (group) params.set("bloodGroup", group);
      if (district) params.set("district", district);
      if (upazila) params.set("upazila", upazila);
      if (availableOnly) params.set("availableOnly", "1");
      if (district) params.set("sort", "near");

      const res = await fetch(`/api/donors?${params.toString()}`);
      const data = await res.json();
      const list: Donor[] = data.data?.donors ?? [];
      setDonors((prev) => (append ? [...prev, ...list] : list));
      setPage(data.data?.page ?? pageNum);
      setPages(data.data?.pages ?? 1);
      setTotal(data.data?.total ?? list.length);
    } catch {
      if (!append) setDonors([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  async function handleSearch() {
    await runSearch(1, false);
  }

  async function handleQuickGroup(g: string) {
    setBloodGroup(g);
    await runSearch(1, false, g);
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">গ্রুপ ধরে খুঁজুন:</span>
          {bloodGroups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleQuickGroup(g)}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition ${
                bloodGroup === g
                  ? "bg-red-600 text-white"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {settings.field_bloodgroup}
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
            >
              <option value="">সব গ্রুপ</option>
              {bloodGroups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

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

        <label className="flex items-center gap-2.5 mb-4 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="w-4 h-4 accent-red-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            শুধু এখন রক্ত দিতে পারবেন এমন ডোনার দেখুন
          </span>
        </label>

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

                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      📱 {revealedIds.has(donor.id) ? donor.phone : maskPhone(donor.phone)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(donor.id)) next.delete(donor.id);
                          else next.add(donor.id);
                          return next;
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {revealedIds.has(donor.id) ? "লুকান" : "নম্বর দেখুন"}
                    </button>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-1.5">
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
                    {isRegularDonor(donor.last_donation_date) && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        নিয়মিত দাতা
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
                  <button
                    type="button"
                    onClick={() => handleReport(donor)}
                    disabled={reportedIds.has(donor.id)}
                    className="mt-2.5 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 disabled:text-green-600 disabled:no-underline hover:underline"
                  >
                    <Flag className="w-3 h-3" />
                    {reportedIds.has(donor.id) ? "রিপোর্ট করা হয়েছে ✓ এডমিন যাচাই করবেন" : "ভুয়া নম্বর? রিপোর্ট করুন"}
                  </button>
                </div>
              );
            })}
          </div>
        )
      )}

      {searched && donors.length > 0 && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">মোট {total} জন ডোনার পাওয়া গেছে</p>
          {page < pages && (
            <button
              onClick={() => runSearch(page + 1, true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-60"
            >
              {loading ? "লোড হচ্ছে..." : "আরও দেখুন"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
