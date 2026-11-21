// src/app/eligibility/page.tsx
"use client";

import { useState } from "react";
import { ClipboardCheck, CheckCircle, XCircle } from "lucide-react";

interface Answers {
  age: string;
  weight: string;
  gender: string;
  lastDonation: string;
  healthy: string;
  fever: string;
  surgery: string;
}

const initial: Answers = {
  age: "",
  weight: "",
  gender: "",
  lastDonation: "",
  healthy: "",
  fever: "",
  surgery: "",
};

export default function EligibilityPage() {
  const [answers, setAnswers] = useState<Answers>(initial);
  const [result, setResult] = useState<{ ok: boolean; reasons: string[] } | null>(null);

  function set(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function evaluate() {
    const reasons: string[] = [];
    const age = parseInt(answers.age, 10);
    const weight = parseFloat(answers.weight);
    if (isNaN(age) || age < 18 || age > 60) reasons.push("বয়স ১৮–৬০ বছরের মধ্যে হতে হয়।");
    if (isNaN(weight) || weight < 50) reasons.push("ওজন কমপক্ষে ৫০ কেজি হতে হয়।");
    if (answers.lastDonation) {
      const days = Math.floor((Date.now() - new Date(answers.lastDonation).getTime()) / 86400000);
      const gap = answers.gender === "female" ? 120 : 90;
      if (days < gap) reasons.push(`শেষ দানের পর অন্তত ${gap} দিন অপেক্ষা করতে হয় (আপনার ${days} দিন হয়েছে)।`);
    }
    if (answers.healthy !== "yes") reasons.push("আজ শারীরিকভাবে সুস্থ বোধ না করলে রক্ত দেওয়া উচিত নয়।");
    if (answers.fever === "yes") reasons.push("গত ১৪ দিনে জ্বর/অ্যান্টিবায়োটিক থাকলে আরও কিছুদিন অপেক্ষা করুন।");
    if (answers.surgery === "yes") reasons.push("গত ৬ মাসে বড় অপারেশন হয়ে থাকলে চিকিৎসকের পরামর্শ নিন।");
    setResult({ ok: reasons.length === 0, reasons });
  }

  const allAnswered =
    answers.age && answers.weight && answers.gender && answers.healthy && answers.fever && answers.surgery;

  const radioGroup = (
    label: string,
    key: keyof Answers,
    options: Array<{ value: string; label: string }>
  ) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2.5">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => set(key, o.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              answers[key] === o.value
                ? "bg-red-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            আপনি কি রক্ত দিতে পারবেন?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            কয়েকটি সহজ প্রশ্নের উত্তর দিন — সাথে সাথে জেনে যাবেন।
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">আপনার বয়স (বছর)</label>
              <input
                type="number"
                value={answers.age}
                onChange={(e) => set("age", e.target.value)}
                placeholder="যেমন: ২৫"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">আপনার ওজন (কেজি)</label>
              <input
                type="number"
                value={answers.weight}
                onChange={(e) => set("weight", e.target.value)}
                placeholder="যেমন: ৬০"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              />
            </div>
          </div>

          {radioGroup("আপনি...", "gender", [
            { value: "male", label: "পুরুষ" },
            { value: "female", label: "মহিলা" },
          ])}

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              শেষ কবে রক্ত দিয়েছেন? (আগে না দিলে ফাঁকা রাখুন)
            </label>
            <input
              type="date"
              value={answers.lastDonation}
              onChange={(e) => set("lastDonation", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
          </div>

          {radioGroup("আজ কি শারীরিকভাবে সম্পূর্ণ সুস্থ বোধ করছেন?", "healthy", [
            { value: "yes", label: "হ্যাঁ, সুস্থ" },
            { value: "no", label: "না" },
          ])}
          {radioGroup("গত ১৪ দিনে জ্বর হয়েছে বা অ্যান্টিবায়োটিক খেয়েছেন?", "fever", [
            { value: "no", label: "না" },
            { value: "yes", label: "হ্যাঁ" },
          ])}
          {radioGroup("গত ৬ মাসে কোনো বড় অপারেশন হয়েছে?", "surgery", [
            { value: "no", label: "না" },
            { value: "yes", label: "হ্যাঁ" },
          ])}
        </div>

        <button
          onClick={evaluate}
          disabled={!allAnswered}
          className="w-full mt-5 py-3.5 rounded-xl bg-red-600 text-white font-bold disabled:opacity-50"
        >
          ফলাফল দেখুন
        </button>

        {result && (
          <div
            className={`mt-5 rounded-2xl border p-5 ${
              result.ok
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
            }`}
          >
            {result.ok ? (
              <div className="flex gap-3">
                <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
                <div>
                  <div className="font-bold text-green-800 dark:text-green-300 text-lg">আলহামদুলিল্লাহ! আপনি রক্ত দিতে পারবেন ✅</div>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    ডোনার হিসেবে নিবন্ধন করুন অথবা লাইভ বোর্ডে জরুরি অনুরোধ দেখুন।
                  </p>
                  <a href="/" className="inline-block mt-3 px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold">
                    হোমপেজে যান
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <XCircle className="w-8 h-8 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-amber-800 dark:text-amber-300 text-lg">এখনই রক্ত দেওয়া ঠিক হবে না</div>
                  <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-400 mt-1.5 space-y-1">
                    {result.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                    এটি একটি সাধারণ নির্দেশিকা — চূড়ান্ত সিদ্ধান্ত ব্লাড ব্যাংকের চিকিৎসকই নেন।
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
