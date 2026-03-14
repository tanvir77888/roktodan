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
    patient_name: "", blood_group: "", units: "1", hospital_name: "",
    district: "", contact_number: "", urgency: "normal", additional_note: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit() {
    if (!form.patient_name || !form.blood_group || !form.hospital_name || !form.district || !form.contact_number) {
      setError("সব তথ্য পূরণ করুন।");
      return;
    }
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
      }
    } catch { setError("সমস্যা হয়েছে।"); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      {success && <p className="text-green-600 text-sm">{settings.request_success_msg}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input type="text" placeholder={settings.field_patientname} value={form.patient_name} onChange={(e) => set("patient_name", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800" />
      <select value={form.blood_group} onChange={(e) => set("blood_group", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800">
        <option value="">গ্রুপ বেছে নিন</option>
        {bloodGroups.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>
      <input type="text" placeholder={settings.field_hospital} value={form.hospital_name} onChange={(e) => set("hospital_name", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800" />
      <SearchableSelect value={form.district} onChange={(val) => set("district", val)} options={districts.map((d) => ({ value: d.name, label: d.name }))} placeholder={settings.field_district} />
      <input type="tel" placeholder={settings.field_contact} value={form.contact_number} onChange={(e) => set("contact_number", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800" />
      <button onClick={handleSubmit} disabled={loading} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold">{loading ? "অপেক্ষা করুন..." : "অনুরোধ পাঠান"}</button>
    </div>
  );
}
