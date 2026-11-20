"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Droplet } from "lucide-react";

function CloseForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [already, setAlready] = useState(false);
  const [error, setError] = useState("");

  async function handleClose() {
    if (!token) {
      setError("লিংকটি সঠিক নয়।");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/requests/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        setAlready(!!data.data?.alreadyClosed);
      } else {
        setError("অনুরোধটি খুঁজে পাওয়া যায়নি। লিংকটি আবার যাচাই করুন।");
      }
    } catch {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
          <Droplet className="w-7 h-7 text-white" />
        </div>
        {done ? (
          <>
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {already ? "অনুরোধটি আগেই বন্ধ করা হয়েছে" : "ধন্যবাদ! অনুরোধটি বন্ধ করা হলো"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              আলহামদুলিল্লাহ, রক্তের ব্যবস্থা হয়েছে জেনে ভালো লাগলো। রক্তদাতাকে ধন্যবাদ জানাতে ভুলবেন না।
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">রক্ত পাওয়া গেছে?</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              আপনার রক্তের অনুরোধটি পূর্ণ হয়ে থাকলে নিচের বাটনে চাপ দিন — তাহলে অনুরোধটি লাইভ বোর্ড থেকে সরে যাবে এবং ডোনারদের কাছে আর অযথা কল যাবে না।
            </p>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 mb-4">
                {error}
              </div>
            )}
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold bg-green-600 hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "বন্ধ করা হচ্ছে..." : "হ্যাঁ, রক্ত পাওয়া গেছে — অনুরোধ বন্ধ করুন"}
            </button>
          </>
        )}
        <a href="/" className="inline-block mt-6 text-sm text-red-600 font-medium">
          ← হোমপেজে ফিরুন
        </a>
      </div>
    </div>
  );
}

export default function RequestClosePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">লোড হচ্ছে...</div>}>
      <CloseForm />
    </Suspense>
  );
}
