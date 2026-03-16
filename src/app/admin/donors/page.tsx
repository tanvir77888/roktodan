"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DISTRICTS, BLOOD_GROUPS } from "@/lib/geodata";
import {
  Search,
  Check,
  X,
  Trash2,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

interface Donor {
  id: number;
  full_name: string;
  blood_group: string;
  district: string;
  upazila: string;
  phone: string;
  last_donation_date: string | null;
  gender: string | null;
  status: "pending" | "approved" | "rejected";
  image_url: string | null;
  created_at: string;
}

interface ApiResponse {
  donors: Donor[];
  total: number;
  page: number;
  pages: number;
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

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const [exportLoading, setExportLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [bloodGroup, district, status]);

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (bloodGroup) params.set("bloodGroup", bloodGroup);
      if (district) params.set("district", district);
      if (status) params.set("status", status);
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/donors?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      const data: ApiResponse = json.data ?? json;
      setDonors(data.donors ?? []);
      setTotalCount(data.total ?? 0);
      setTotalPages(data.pages ?? 1);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, bloodGroup, district, status, page]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleStatusChange(id: number, newStatus: "approved" | "rejected") {
    try {
      const res = await fetch(`/api/donors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      showToast(
        newStatus === "approved" ? "Donor approved" : "Donor rejected",
        "success"
      );
      fetchDonors();
    } catch {
      showToast("Failed to update status", "error");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this donor?")) return;
    try {
      const res = await fetch(`/api/donors/${id}`, { method: "DELETE", credentials: 'include' });
      if (!res.ok) throw new Error();
      showToast("Donor deleted", "success");
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      fetchDonors();
    } catch {
      showToast("Failed to delete", "error");
    }
  }

  async function handleBulkAction(action: "approved" | "rejected") {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    let successCount = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/donors/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action }),
          credentials: 'include',
        });
        if (res.ok) successCount++;
      } catch {
        // continue
      }
    }
    setBulkLoading(false);
    setSelectedIds(new Set());
    showToast(
      `${successCount} জন দাতার স্ট্যাটাস ${action === "approved" ? "অনুমোদিত" : "প্রত্যাখ্যাত"} করা হয়েছে`,
      "success"
    );
    fetchDonors();
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === donors.length && donors.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(donors.map((d) => d.id)));
    }
  }

  async function handleExportCSV() {
    setExportLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (bloodGroup) params.set("bloodGroup", bloodGroup);
      if (district) params.set("district", district);
      if (status) params.set("status", status);
      params.set("limit", "9999");
      params.set("page", "1");

      const res = await fetch(`/api/donors?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const data: ApiResponse = json.data ?? json;

      const headers = ["Name", "Blood Group", "District", "Upazila", "Phone", "Last Donated", "Gender", "Status", "Submitted"];
      const rows = data.donors.map((d) => [
        `"${d.full_name}"`,
        d.blood_group,
        `"${d.district}"`,
        `"${d.upazila}"`,
        d.phone,
        d.last_donation_date ? d.last_donation_date.slice(0, 10) : "",
        d.gender ?? "",
        d.status,
        d.created_at.slice(0, 10),
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donors_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast("Failed to export CSV", "error");
    } finally {
      setExportLoading(false);
    }
  }

  const allOnPageSelected = donors.length > 0 && selectedIds.size === donors.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donor Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalCount} donors found
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exportLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 shadow-sm"
        >
          <Download size={16} />
          {exportLoading ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
          <select
            value={bloodGroup}
            onChange={(e) => { setBloodGroup(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <select
            value={district}
            onChange={(e) => { setDistrict(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          {(search || bloodGroup || district || status) && (
            <button
              onClick={() => { setSearch(""); setBloodGroup(""); setDistrict(""); setStatus(""); setPage(1); }}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter size={14} /> ফিল্টার সরান
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-blue-700">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => handleBulkAction("approved")}
            disabled={bulkLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <Check size={14} /> Approve All
          </button>
          <button
            onClick={() => handleBulkAction("rejected")}
            disabled={bulkLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            <X size={14} /> Reject All
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Table — hidden on mobile, visible md+ */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Image</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Blood Group</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">District</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Upazila</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Last Donated</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-full max-w-[100px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-gray-300" />
                      <span>No donors found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                donors.map((donor) => (
                  <tr
                    key={donor.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(donor.id)}
                        onChange={() => toggleSelect(donor.id)}
                        className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {donor.full_name}
                    </td>
                    <td className="px-4 py-3">
                      {donor.image_url ? (
                        <a href={donor.image_url} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={donor.image_url} alt="Donor" className="h-8 w-8 rounded-full object-cover border border-gray-200 hover:opacity-80 transition" />
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          BLOOD_GROUP_COLORS[donor.blood_group] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {donor.blood_group}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{donor.district}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{donor.upazila}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-mono text-xs">
                      {donor.phone}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {formatDate(donor.last_donation_date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          STATUS_COLORS[donor.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUS_LABELS[donor.status] ?? donor.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-nowrap">
                        {donor.status !== "approved" && (
                          <button
                            onClick={() => handleStatusChange(donor.id, "approved")}
                            title="অনুমোদন করুন"
                            className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {donor.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusChange(donor.id, "rejected")}
                            title="প্রত্যাখ্যান করুন"
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedDonor(donor); setShowModal(true); }}
                          title="বিস্তারিত দেখুন"
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(donor.id)}
                          title="মুছে ফেলুন"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} / {totalPages} ({totalCount} total)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-gray-700 px-2">{page}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile card list — visible only on small screens */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))
        ) : donors.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center text-gray-400 text-sm">
            কোনো রক্তদাতা পাওয়া যায়নি
          </div>
        ) : (
          donors.map((donor) => (
            <div key={donor.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(donor.id)}
                    onChange={() => toggleSelect(donor.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="font-semibold text-gray-900 text-sm">{donor.full_name}</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${BLOOD_GROUP_COLORS[donor.blood_group] ?? "bg-gray-100 text-gray-700"}`}>
                    {donor.blood_group}
                  </span>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${STATUS_COLORS[donor.status] ?? "bg-gray-100 text-gray-700"}`}>
                  {STATUS_LABELS[donor.status] ?? donor.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                <div><span className="font-medium text-gray-700">District:</span> {donor.district} — {donor.upazila}</div>
                <div><span className="font-medium text-gray-700">Phone:</span> {donor.phone}</div>
                <div><span className="font-medium text-gray-700">Last Donated:</span> {formatDate(donor.last_donation_date)}</div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {donor.status !== "approved" && (
                  <button onClick={() => handleStatusChange(donor.id, "approved")} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition">
                    <Check size={12} /> অনুমোদন
                  </button>
                )}
                {donor.status !== "rejected" && (
                  <button onClick={() => handleStatusChange(donor.id, "rejected")} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition">
                    <X size={12} /> প্রত্যাখ্যান
                  </button>
                )}
                <button onClick={() => { setSelectedDonor(donor); setShowModal(true); }} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition">
                  <Eye size={12} /> বিস্তারিত
                </button>
                <button onClick={() => handleDelete(donor.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition">
                  <Trash2 size={12} /> মুছুন
                </button>
              </div>
            </div>
          ))
        )}
        {!loading && totalPages > 1 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">পৃষ্ঠা {page} / {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-gray-700">{page}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedDonor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-4 pr-8">দাতার বিস্তারিত তথ্য</h2>

            <div className="space-y-3">
              {[
                ["Name", selectedDonor.full_name],
                [
                  "Blood Group",
                  <span
                    key="bg"
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      BLOOD_GROUP_COLORS[selectedDonor.blood_group] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedDonor.blood_group}
                  </span>,
                ],
                ["District", selectedDonor.district],
                ["Upazila", selectedDonor.upazila],
                ["Phone", selectedDonor.phone],
                ["Last Donated", formatDate(selectedDonor.last_donation_date)],
                ["Gender", selectedDonor.gender ? (GENDER_LABELS[selectedDonor.gender] ?? selectedDonor.gender) : "—"],
                [
                  "Status",
                  <span
                    key="status"
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      STATUS_COLORS[selectedDonor.status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_LABELS[selectedDonor.status] ?? selectedDonor.status}
                  </span>,
                ],
                ["Registered", formatDateTime(selectedDonor.created_at)],
                ...(selectedDonor.image_url ? [["Image", (
                  <a key="img" href={selectedDonor.image_url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedDonor.image_url} alt="Donor" className="h-20 w-20 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition" />
                  </a>
                )]] : []),
              ].map(([label, value]) => (
                <div key={String(label)} className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500 shrink-0 w-36">{label}</span>
                  <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              {selectedDonor.status !== "approved" && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedDonor.id, "approved");
                    setShowModal(false);
                  }}
                  className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                >
                  অনুমোদন করুন
                </button>
              )}
              {selectedDonor.status !== "rejected" && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedDonor.id, "rejected");
                    setShowModal(false);
                  }}
                  className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                >
                  প্রত্যাখ্যান করুন
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}