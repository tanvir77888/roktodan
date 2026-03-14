"use client";

import { useState } from "react";
import type { District } from "@/lib/geodata";
import SearchableSelect from "./SearchableSelect";

interface RegistrationSettings {
  donor_success_msg: string;
  field_fullname: string;
  field_bloodgroup: string;
  field_district: string;
  field_upazila: string;
  field_phone: string;
  field_lastdonation: string;
  field_gender: string;
}

export default function DonorRegistrationForm({
  districts,
  bloodGroups,
  settings,
}: {
  districts: District[];
  bloodGroups: string[];
  settings: RegistrationSettings;
}) {
  const [form, setForm] = useState({
    full_name: "",
    blood_group: "",
    district: "",
    upazila: "",
    phone: "",
    last_donation: "",
    gender: "male",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const activeUpazilas = districts.find((d) => d.name === form.district)?.upazilas ?? [];

  const handleSubmit = async () => {
    if (!form.full_name || !form.blood_group || !form.district || !form.phone) {
      setError("অনুগ্রহ করে প্রয়োজনীয় সব তথ্য দিন।");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSuccess(true);
        setForm({
          full_name: "",
          blood_group: "",
          district: "",
          upazila: "",
          phone: "",
          last_donation: "",
          gender: "male",
        });
      } else {
        setError("নিবন্ধন করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
      }
    } catch (err) {
      setError("সার্ভার সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">রক্তদাতা হিসেবে নিবন্ধন করুন</h2>

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-xl text-sm mb-4">
          {settings.donor_success_msg}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder={settings.field_fullname}
        className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <select
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          value={form.blood_group}
          onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
        >
          <option value="">{settings.field_bloodgroup}</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <select
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="male">পুরুষ</option>
          <option value="female">নারী</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SearchableSelect
          options={districts.map((d) => ({ value: d.name, label: d.name }))}
          onChange={(val: string) => setForm({ ...form, district: val, upazila: "" })}
          placeholder={settings.field_district}
        />

        <select
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50"
          value={form.upazila}
          onChange={(e) => setForm({ ...form, upazila: e.target.value })}
          disabled={!form.district}
        >
          <option value="">{settings.field_upazila}</option>
          {activeUpazilas.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="tel"
          placeholder={settings.field_phone}
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="date"
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          value={form.last_donation}
          onChange={(e) => setForm({ ...form, last_donation: e.target.value })}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg"
      >
        {loading ? "লোডিং..." : "নিবন্ধন সম্পন্ন করুন"}
      </button>
    </div>
  );
}
