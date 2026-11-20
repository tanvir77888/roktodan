"use client";

import { useState } from "react";
import type { District } from "@/lib/geodata";
import SearchableSelect from "./SearchableSelect";
import { Phone, MessageCircle, Share2, Copy, Check } from "lucide-react";

interface MatchedDonor {
  id: number;
  full_name: string;
  blood_group: string;
  district: string;
  upazila: string;
  phone: string;
}

interface SubmittedReq {
  patient_name: string;
  blood_group: string;
  units: string;
  hospital_name: string;
  district: string;
  contact_number: string;
}

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
    needed_by: "",
    additional_note: "",
    image_url: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [closeUrl, setCloseUrl] = useState("");
  const [matches, setMatches] = useState<MatchedDonor[]>([]);
  const [submittedReq, setSubmittedReq] = useState<SubmittedReq | null>(null);
  const [copied, setCopied] = useState("");

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
        body: JSON.stringify({
          ...form,
          units: parseInt(form.units, 10),
          needed_by: form.needed_by ? new Date(form.needed_by).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const snapshot: SubmittedReq = {
          patient_name: form.patient_name,
          blood_group: form.blood_group,
          units: form.units,
          hospital_name: form.hospital_name,
          district: form.district,
          contact_number: form.contact_number,
        };
        setSubmittedReq(snapshot);
        setCloseUrl(data.data?.close_url ?? "");
        setSuccess(true);
        // Show matching donors right away so the requester can call them
        try {
          const params = new URLSearchParams({ bloodGroup: snapshot.blood_group, district: snapshot.district, limit: "6" });
          const dres = await fetch(`/api/donors?${params.toString()}`);
          const djson = await dres.json();
          setMatches(djson.data?.donors ?? []);
        } catch {
          setMatches([]);
        }
        setForm({ patient_name: "", blood_group: "", units: "1", hospital_name: "", district: "", contact_number: "", urgency: "normal", needed_by: "", additional_note: "", image_url: "" });
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
            {settings.request_success_msg || "আপনার অনুরোধ সফলভাবে পাঠানো হয়েছে।"} এডমিন যাচাই করে অনুরোধটি লাইভ বোর্ডে তুলে দেবেন।
          </p>
        </div>
      )}

      {success && submittedReq && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `🩸 জরুরি রক্তের প্রয়োজন!\nরোগী: ${submittedReq.patient_name}\nরক্তের গ্রুপ: ${submittedReq.blood_group} (${submittedReq.units} ব্যাগ)\nহাসপাতাল: ${submittedReq.hospital_name}, ${submittedReq.district}\nযোগাযোগ: ${submittedReq.contact_number}\n— Roktodan (রক্তদান)`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:opacity-90"
            >
              <Share2 className="w-4 h-4" /> WhatsApp-এ শেয়ার করুন
            </a>
            <button
              type="button"
              onClick={async () => {
                const text = `🩸 জরুরি রক্তের প্রয়োজন! রোগী: ${submittedReq.patient_name}, গ্রুপ: ${submittedReq.blood_group} (${submittedReq.units} ব্যাগ), হাসপাতাল: ${submittedReq.hospital_name}, ${submittedReq.district}, যোগাযোগ: ${submittedReq.contact_number}`;
                try { await navigator.clipboard.writeText(text); setCopied("share"); } catch { /* ignore */ }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {copied === "share" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} লেখা কপি করুন
            </button>
          </div>

          {closeUrl && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">রক্ত পেয়ে গেলে অনুরোধটি বন্ধ করে দেবেন:</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-700 dark:text-blue-300 break-all flex-1">{typeof window !== "undefined" ? window.location.origin : ""}{closeUrl}</span>
                <button
                  type="button"
                  onClick={async () => {
                    try { await navigator.clipboard.writeText(`${window.location.origin}${closeUrl}`); setCopied("close"); } catch { /* ignore */ }
                  }}
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:opacity-90"
                >
                  {copied === "close" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} কপি
                </button>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">লিংকটা সংরক্ষণ করে রাখুন — এটা দিয়েই পরে অনুরোধ বন্ধ করতে পারবেন।</p>
            </div>
          )}

          {matches.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">মিলে যাওয়া ডোনার — এখনই কল করুন ({matches.length} জন)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matches.map((d) => (
                  <div key={d.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{d.full_name}</div>
                        <div className="text-xs text-gray-500">{d.district} · {d.upazila}</div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">{d.phone}</div>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">{d.blood_group}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <a href={`tel:${d.phone}`} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-600 hover:opacity-90">
                        <Phone className="w-3.5 h-3.5" /> কল
                      </a>
                      <a href={`https://wa.me/880${d.phone.replace(/\D/g, "").replace(/^880/, "").replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:opacity-90">
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

      <Field label="কখন রক্ত লাগবে? (ঐচ্ছিক)">
        <input type="datetime-local" value={form.needed_by} onChange={(e) => set("needed_by", e.target.value)} className="input-base" />
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
