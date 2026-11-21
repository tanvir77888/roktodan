// src/app/thank-you/page.tsx
"use client";

import { useRef, useState } from "react";
import { Gift, Download } from "lucide-react";

export default function ThankYouCardPage() {
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas || !name.trim()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 1000;
    const H = 560;
    canvas.width = W;
    canvas.height = H;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#991b1b");
    grad.addColorStop(1, "#dc2626");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // decorative circles
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.arc(W - 90, 60, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(60, H - 40, 110, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fecaca";
    ctx.font = "600 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Roktho Bondhon — রক্তবন্ধন", W / 2, 78);

    ctx.font = "120px sans-serif";
    ctx.fillText("🩸", W / 2, 205);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 54px sans-serif";
    ctx.fillText("ধন্যবাদ!", W / 2, 292);

    ctx.font = "bold 44px sans-serif";
    ctx.fillText(name.trim(), W / 2, 356);

    ctx.fillStyle = "#fee2e2";
    ctx.font = "28px sans-serif";
    ctx.fillText(`রক্তের গ্রুপ: ${bloodGroup}`, W / 2, 404);
    ctx.font = "24px sans-serif";
    ctx.fillText("আপনার এক ব্যাগ রক্তে বেঁচেছে একটি জীবন,", W / 2, 452);
    ctx.fillText("কারো মুখে ফিরেছে হাসি। আপনি একজন সত্যিকারের নায়ক।", W / 2, 488);

    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = "20px sans-serif";
    ctx.fillText("রক্ত দিন, জীবন বাঁচান ✊ · roktodan2.vercel.app", W / 2, 532);

    setGenerated(true);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `thank-you-${name.trim().replace(/\s+/g, "-")}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">ধন্যবাদ কার্ড</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            রক্তদাতার নাম লিখলেই সুন্দর ধন্যবাদ কার্ড তৈরি হয়ে যাবে — ডাউনলোড করে WhatsApp-এ পাঠিয়ে দিন।
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="দাতার নাম"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-bold"
          >
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <button
            onClick={draw}
            disabled={!name.trim()}
            className="px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-bold disabled:opacity-50"
          >
            কার্ড বানান
          </button>
        </div>

        <canvas
          ref={canvasRef}
          className={`w-full rounded-2xl shadow-lg ${generated ? "" : "hidden"}`}
        />

        {generated && (
          <button
            onClick={download}
            className="w-full mt-4 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-600 text-white font-bold"
          >
            <Download className="w-5 h-5" /> কার্ড ডাউনলোড করুন (PNG)
          </button>
        )}

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
