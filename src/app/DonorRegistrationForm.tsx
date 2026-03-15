"use client";

import { useState } from "react";
import type { District } from "@/lib/geodata";
import SearchableSelect from "./SearchableSelect";

interface DonorFormSettings {
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
  settings: DonorFormSettings;
}) {
  const [form, setForm] = useState({
    full_name: "",
    blood_group: "",
    district: "",
    upazila: "",
    phone: "",
    last_donation_date: "",
    gender: "",
    image_url: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const upazilas = districts.find((d) => d.name === form.district)?.upazilas ?? [];

  function set(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "district" ? { upazila: "" } : {}),
    }));
  }

  async function handleSubmit() {
    if (!form.full_name || !form.blood_group || !form.district || !form.upazila || !form.phone) {
      setError("অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ full_name: "", blood_group: "", district: "", upazila: "", phone: "", last_donation_date: "", gender: "", image_url: "" });
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
            {settings.donor_success_msg || "আপনার নিবন্ধন সফল হয়েছে!"}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <Field label={settings.field_fullname} required>
        <input
          type="text"
          value={form.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          className="input-base"
          placeholder="আপনার পূর্ণ নাম"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label={settings.field_bloodgroup} required>
          <select value={form.blood_group} onChange={(e) => set("blood_group", e.target.value)} className="input-base">
            <option value="">নির্বাচন করুন</option>
            {bloodGroups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label={settings.field_gender}>
          <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className="input-base">
            <option value="">নির্বাচন করুন</option>
            <option value="male">পুরুষ</option>
            <option value="female">মহিলা</option>
            <option value="other">অন্যান্য</option>
          </select>
        </Field>
      </div>

      <Field label={settings.field_district} required>
        <SearchableSelect
          value={form.district}
          onChange={(val) => set("district", val)}
          options={districts.map((d) => ({ value: d.name, label: d.name }))}
          placeholder="জেলা নির্বাচন করুন"
        />
      </Field>

      <Field label={settings.field_upazila} required>
        <SearchableSelect
          value={form.upazila}
          onChange={(val) => set("upazila", val)}
          options={upazilas.map((u) => ({ value: u, label: u }))}
          placeholder="উপজেলা নির্বাচন করুন"
          disabled={!form.district}
        />
      </Field>

      <Field label={settings.field_phone} required>
        <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input-base" placeholder="01XXXXXXXXX" />
      </Field>

      <Field label={settings.field_lastdonation}>
        <input type="date" value={form.last_donation_date} onChange={(e) => set("last_donation_date", e.target.value)} className="input-base" />
      </Field>

      <Field label="ছবি আপলোড করুন (ঐচ্ছিক)">
        <div className="space-y-2">
          {form.image_url && (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image_url} alt="Uploaded" className="h-24 w-24 object-cover rounded-lg border border-gray-200" />
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
            {imageUploading ? "আপলোড হচ্ছে..." : "📷 ছবি বেছে নিন"}
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
                  else setError("ছবি আপলোড করা যায়নি।");
                } catch {
                  setError("ছবি আপলোড করা যায়নি।");
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
        {loading ? "জমা হচ্ছে..." : "নিবন্ধন করুন"}
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
