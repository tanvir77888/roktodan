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
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center min-h-[48px] flex items-center justify-center">
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
        <input type="text" value={form.patient_name} onChange={(e) => set("patient_name", e.target.value)} className="input-base" placeholder="রোগীর নাম" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label={settings.field_bloodgroup} required>
          <select value={form.blood_group} onChange={(e) => set("blood_group", e.target.value)} className="input-base">
            <option value="">নির্বাচন করুন</option>
            {bloodGroups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label={settings.field_units} required>
          <input type="number" min={1} max={20} value={form.units} onChange={(e) => set("units", e.target.value)} className="input-base" />
        </Field>
      </div>

      <Field label={settings.field_hospital} required>
        <input type="text" value={form.hospital_name} onChange={(e) => set("hospital_name", e.target.value)} className="input-base" placeholder="হাসপাতালের নাম" />
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
        <input type="tel" value={form.contact_number} onChange={(e) => set("contact_number", e.target.value)} className="input-base" placeholder="01XXXXXXXXX" />
      </Field>

      <Field label={settings.field_urgency} required>
        <select value={form.urgency} onChange={(e) => set("urgency", e.target.value)} className="input-base">
          <option value="critical">{settings.urgency_critical}</option>
          <option value="moderate">{settings.urgency_moderate}</option>
          <option value="normal">{settings.urgency_normal}</option>
        </select>
      </Field>

      <Field label={settings.field_note}>
        <textarea value={form.additional_note} onChange={(e) => set("additional_note", e.target.value)} className="input-base resize-none" rows={3} placeholder="অতিরিক্ত তথ্য (ঐচ্ছিক)" />
      </Field>

      <Field label="প্রেসক্রিপশন / ডকুমেন্ট আপলোড করুন (ঐচ্ছিক)">
        <div className="space-y-2">
          {form.image_url && (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image_url} alt="Uploaded document" className="h-24 w-24 object-cover rounded-lg border border-gray-200" />
              <button
                type="button"
                onClick={() => set("image_url", "")}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          )}
          <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition w-fit ${imageUploading ? "opacity-60 pointer-events-none" : ""}`}>
            {imageUploading ? "আপলোড হচ্ছে..." : "📎 ডকুমেন্ট বেছে নিন"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              disabled={imageUploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageUploading(true);
                try {
                  const fd = new FormData();
                  fd.append("file", file);
                  const res = await fetch("/api/upload", { method: "POST", body: fd });
                  const json = await res.json();
                  if (json.success) set("image_url", json.data.url);
                  else setError("ডকুমেন্ট আপলোড করা যায়নি।");
                } catch {
                  setError("ডকুমেন্ট আপলোড করা যায়নি।");
                } finally {
                  setImageUploading(false);
                  e.target.value = "";
                }
              }}
            />
          </label>
          <p className="text-xs text-gray-400">JPG বা PNG, সর্বোচ্চ ২ MB</p>
        </div>
      </Field>

      <button
        onClick={handleSubmit}
        disabled={loading || imageUploading}
        className="w-full py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: "var(--color-primary)" }}
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