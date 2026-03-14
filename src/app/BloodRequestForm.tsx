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
    image_url: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.patient_name || !form.blood_group || !form.hospital_name || !form.district || !form.contact_number) {
      setError("অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, units: parseInt(form.units, 10) }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ patient_name: "", blood_group: "", units: "1", hospital_name: "", district: "", contact_number: "", urgency: "normal", additional_note: "", image_url: "" });
      } else {
        setError(data.error ?? "কিছু একটা সমস্যা হয়েছে।");
      }
    } catch {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-4">
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
          <p className="text-green-800 dark:text-green-300 font-medium text-sm">
            {settings.request_success_msg || "আপনার অনুরোধ সফলভাবে পাঠানো হয়েছে।"}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <Field label={settings.field_patientname} required>
        <input type="text" value={form.patient_name} onChange={(e) => set("patient_name", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" placeholder="রোগীর নাম" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label={settings.field_bloodgroup} required>
          <select value={form.blood_group} onChange={(e) => set("blood_group", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
            <option value="">নির্বাচন করুন</option>
            {bloodGroups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label={settings.field_units} required>
          <input type="number" min={1} value={form.units} onChange={(e) => set("units", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        </Field>
      </div>

      <Field label={settings.field_hospital} required>
        <input type="text" value={form.hospital_name} onChange={(e) => set("hospital_name", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" placeholder="হাসপাতালের নাম" />
      </Field>

      <Field label={settings.field_district} required>
        <SearchableSelect
          value={form.district}
          onChange={(val) => set("district", val)}
          options={districts.map((d) => ({ value: d.name, label: d.name }))}
          placeholder="জেলা নির্বাচন করুন"
        />
      </Field>

      <Field label={settings.field_contact} required>
        <input type="tel" value={form.contact_number} onChange={(e) => set("contact_number", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" placeholder="01XXXXXXXXX" />
      </Field>

      <Field label={settings.field_urgency} required>
        <select value={form.urgency} onChange={(e) => set("urgency", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="critical">{settings.urgency_critical}</option>
          <option value="moderate">{settings.urgency_moderate}</option>
          <option value="normal">{settings.urgency_normal}</option>
        </select>
      </Field>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 bg-red-600"
      >
        {loading ? "পাঠানো হচ্ছে..." : "অনুরোধ পাঠান"}
      </button>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
