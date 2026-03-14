"use client";

import { useState } from "react";
import type { District } from "@/lib/geodata";
import SearchableSelect from "./SearchableSelect";

interface RequestFormSettings {
  request_success_msg: string;
  field_patientname: string;
  field_bloodgroup: string;
  field_units: string;
  field_hospital: string;
  field_district: string;
  field_contact: string;
  field_urgency: string;
  field_note: string;
  urgency_critical: string;
  urgency_moderate: string;
  urgency_normal: string;
}

export default function BloodRequestForm({
  districts,
  bloodGroups,
  settings,
}: {
  districts: District[];
  bloodGroups: string[];
  settings: RequestFormSettings;
}) {
  const [form, setForm] = useState({
    patient_name: "",
    blood_group: "",
    units: "1",
    hospital_name: "",
    district: "",
    contact_number: "",
    urgency: "normal",
    additional_note: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.patient_name || !form.blood_group || !form.district || !form.contact_number) {
      setError("দয়া করে প্রয়োজনীয় সব তথ্য দিন।");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSuccess(true);
        setForm({
          patient_name: "",
          blood_group: "",
          units: "1",
          hospital_name: "",
          district: "",
          contact_number: "",
          urgency: "normal",
          additional_note: "",
        });
      } else {
        setError("দুঃখিত, অনুরোধটি পাঠানো সম্ভব হয়নি।");
      }
    } catch (err) {
      setError("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">রক্তের অনুরোধ পাঠান</h2>
      
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-xl text-sm mb-4">
          {settings.request_success_msg}
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder={settings.field_patientname}
        className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
        value={form.patient_name}
        onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <select
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          value={form.blood_group}
          onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
        >
          <option value="">{settings.field_bloodgroup}</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder={settings.field_units}
          className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          value={form.units}
          onChange={(e) => setForm({ ...form, units: e.target.value })}
        />
      </div>

      <SearchableSelect
        options={districts.map((d) => ({ value: d.name, label: d.name }))}
        onChange={(val: string) => setForm({ ...form, district: val })}
        placeholder={settings.field_district}
      />

      <input
        type="tel"
        placeholder={settings.field_contact}
        className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
        value={form.contact_number}
        onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-red-200 dark:shadow-none"
      >
        {loading ? "লোডিং..." : "অনুরোধ পাঠান"}
      </button>
    </div>
  );
}
