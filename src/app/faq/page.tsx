// src/app/faq/page.tsx
"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "রক্ত দিলে শরীর দুর্বল হয়ে যায়?",
    a: "না। একজন সুস্থ মানুষের শরীরে প্রায় ৫–৬ লিটার রক্ত থাকে; দান করা হয় মাত্র ৩৫০–৪৫০ মিলি। শরীর ২৪–৪৮ ঘণ্টায় তরল অংশ আর কয়েক সপ্তাহে লোহিত কণিকা পূরণ করে ফেলে। দানের পর পর্যাপ্ত পানি ও খাবার খেলেই যথেষ্ট।",
  },
  {
    q: "রক্ত দিলে ওজন বেড়ে যায় বা কমে যায়?",
    a: "কোনোটাই নয় — এটি প্রচলিত ভুল ধারণা। রক্তদানের সঙ্গে ওজন বাড়া-কমার কোনো সম্পর্ক নেই।",
  },
  {
    q: "কতদিন পর পর রক্ত দেওয়া যায়?",
    a: "পুরুষরা প্রতি ৩ মাস (৯০ দিন) এবং মহিলারা প্রতি ৪ মাস (১২০ দিন) পর পর পূর্ণ রক্ত দিতে পারেন।",
  },
  {
    q: "রক্ত দিলে কি কোনো রোগে আক্রান্ত হওয়ার ঝুঁকি আছে?",
    a: "না। প্রতিবার সম্পূর্ণ নতুন, জীবাণুমুক্ত সুই ও ব্যাগ ব্যবহার করা হয় এবং ব্যবহারের পর ধ্বংস করা হয় — সংক্রমণের কোনো সুযোগ নেই।",
  },
  {
    q: "ডায়াবেটিস বা উচ্চ রক্তচাপ থাকলে রক্ত দেওয়া যায়?",
    a: "নিয়ন্ত্রণে থাকলে এবং ওষুধ চললে অনেক ক্ষেত্রেই দেওয়া যায়, তবে চূড়ান্ত সিদ্ধান্ত ব্লাড ব্যাংকের চিকিৎসক স্ক্রিনিং করে নেন। ইনসুলিন নিলে সাধারণত দেওয়া যায় না।",
  },
  {
    q: "রক্ত দিতে কতক্ষণ লাগে?",
    a: "পুরো প্রক্রিয়া (নিবন্ধন, স্ক্রিনিং, দান, বিশ্রাম) মিলিয়ে প্রায় ২০–৩০ মিনিট; আসল দান মাত্র ৮–১০ মিনিট।",
  },
  {
    q: "মহিলারা কি রক্ত দিতে পারেন?",
    a: "অবশ্যই পারেন। ওজন ৫০ কেজি+, বয়স ১৮–৬০, হিমোগ্লোবিন ঠিক থাকলেই পারবেন। মাসিক চলাকালীন ও গর্ভাবস্থায় দেওয়া যায় না; সন্তান জন্মের পর ১ বছর অপেক্ষা করতে হয়।",
  },
  {
    q: "রক্ত দিলে কি ব্যথা লাগে?",
    a: "শুধু সুই ঢোকানোর মুহূর্তে হালকা চিমটির মতো অনুভূতি — এর বাইরে কোনো ব্যথা নেই।",
  },
  {
    q: "ট্যাটু বা পিয়ার্সিং করালে রক্ত দেওয়া যায়?",
    a: "সাধারণত ট্যাটু/পিয়ার্সিংয়ের পর ৬ মাস অপেক্ষা করে দিতে হয় (সংক্রমণের ঝুঁকি এড়াতে)।",
  },
  {
    q: "রক্তদানে আমার কী লাভ?",
    a: "প্রতিবার ফ্রি স্ক্রিনিং হয় (হিমোগ্লোবিন, রক্তচাপ, পালস এবং HIV, হেপাটাইটিস B/C, সিফিলিসসহ কয়েকটি পরীক্ষা)। গবেষণায় দেখা গেছে নিয়মিত দানে হৃদরোগের ঝুঁকি কমে — আর সবচেয়ে বড় লাভ, আপনার রক্তে বাঁচে একটি জীবন।",
  },
];

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            ভুল ধারণা ও সত্য
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            রক্তদান নিয়ে প্রচলিত প্রশ্নের সঠিক উত্তর।
          </p>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                  {f.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
