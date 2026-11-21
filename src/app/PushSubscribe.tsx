// src/app/PushSubscribe.tsx
"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";

function urlB64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export default function PushSubscribe() {
  const [state, setState] = useState<"idle" | "subscribed" | "unsupported" | "busy">("idle");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (sub) setState("subscribed");
      })
      .catch(() => {});
  }, []);

  async function handleSubscribe() {
    setState("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("idle");
        alert("নোটিফিকেশন পেতে অনুমতি দিতে হবে।");
        return;
      }
      const keyRes = await fetch("/api/push/subscribe");
      const keyData = await keyRes.json();
      const publicKey: string = keyData.data?.publicKey ?? "";
      if (!publicKey) {
        setState("idle");
        alert("Push এখনো প্রস্তুত নয়। পরে আবার চেষ্টা করুন।");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(publicKey) as BufferSource,
      });
      const json = sub.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      setState("subscribed");
    } catch {
      setState("idle");
      alert("সাবস্ক্রাইব করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  if (state === "unsupported") return null;

  return (
    <div className="bg-red-600 rounded-2xl px-6 py-6 text-white flex flex-col sm:flex-row items-center gap-4 shadow-sm">
      <div className="flex-1 text-center sm:text-left">
        <div className="font-bold text-lg">🔔 জরুরি রক্তের নোটিফিকেশন পান</div>
        <p className="text-red-100 text-sm mt-0.5">
          আপনার এলাকায় জরুরি রক্তের প্রয়োজন হলেই ফোনে নোটিফিকেশন যাবে — অ্যাপ বন্ধ থাকলেও।
        </p>
      </div>
      <button
        onClick={handleSubscribe}
        disabled={state === "subscribed" || state === "busy"}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-red-600 font-bold text-sm disabled:opacity-80 shrink-0"
      >
        {state === "subscribed" ? (
          <>
            <BellRing className="w-4 h-4" /> চালু আছে ✅
          </>
        ) : (
          <>
            <Bell className="w-4 h-4" /> {state === "busy" ? "চালু হচ্ছে..." : "নোটিফিকেশন চালু করুন"}
          </>
        )}
      </button>
    </div>
  );
}
