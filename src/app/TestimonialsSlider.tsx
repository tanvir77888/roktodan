"use client";

import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const stories = [
  { name: "মাহিন আহমেদ", location: "শায়েস্তানগর, হবিগঞ্জ", text: "জরুরি প্রয়োজনে ও+ রক্ত খুব দ্রুত পেয়েছি। ধন্যবাদ এই প্ল্যাটফর্মকে।" },
  { name: "নিলয় হাসান", location: "চৌধুরী বাজার, হবিগঞ্জ", text: "আমি নিয়মিত রক্ত দান করি। এখানে নিবন্ধন করার প্রক্রিয়া খুবই সহজ।" },
  { name: "জুবায়ের আহমদ", location: "টাউন হল, হবিগঞ্জ", text: "হবিগঞ্জ সদরের ভেতরে রক্তদাতা খুঁজে পাওয়ার জন্য এটি সেরা মাধ্যম।" },
  { name: "আরমান চৌধুরী", location: "আদালত পাড়া, হবিগঞ্জ", text: "স্বেচ্ছায় রক্তদানে আগ্রহী সবার এই সাইটে নিবন্ধন করা উচিত।" },
  { name: "সাদিকুর রহমান", location: "নতুন মুন্সেফী, হবিগঞ্জ", text: "বি পজিটিভ রক্ত দরকার ছিল, ১০ মিনিটেই ডোনারের সাথে যোগাযোগ হয়েছে।" },
  { name: "ফয়সাল মাহমুদ", location: "কালীবাড়ি রোড, হবিগঞ্জ", text: "মানবিক কাজে প্রযুক্তির এমন ব্যবহার সত্যিই প্রশংসনীয়।" }
];

export default function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % stories.length);
    }, 4000); // ৪ সেকেন্ড পর পর পরিবর্তন হবে
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-red-50/20 dark:bg-gray-800/20 border-t border-red-50 dark:border-gray-800 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 dark:text-white">১০০+ ডোনার ও গ্রহীতাদের অভিজ্ঞতা</h2>
        
        <div className="relative min-h-[220px] md:min-h-[180px] flex items-center justify-center">
          {stories.map((s, i) => (
            <div
              key={i}
              className={`absolute w-full transition-all duration-700 ease-in-out ${
                i === current ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
              }`}
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-red-100 dark:border-gray-700 shadow-sm relative">
                <Quote className="absolute top-4 right-6 w-10 h-10 text-red-500/10 dark:text-red-500/5" />
                <p className="text-gray-700 dark:text-gray-300 italic mb-6 text-lg md:text-xl leading-relaxed px-4">"{s.text}"</p>
                <div className="inline-block px-4 py-1 bg-red-50 dark:bg-red-900/20 rounded-full mb-2 text-red-600 font-bold text-sm">{s.name}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-widest">{s.location}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {stories.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-red-600" : "w-2 bg-gray-300 dark:bg-gray-700"}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
