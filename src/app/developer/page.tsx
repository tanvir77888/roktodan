// src/app/developer/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Github, Mail, Heart, Code, Award, ArrowLeft, Facebook, Phone, MapPin, Sparkles, Star, Users } from "lucide-react";

export default function DeveloperPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "আমার লক্ষ্য",
      content: "আমি প্রযুক্তি বিশেষজ্ঞ না হলেও, প্রযুক্তির মাধ্যমে মানুষের জীবন সহজ করতে ভালোবাসি। এই 'রক্তদান' প্ল্যাটফর্মটি আমার একটি স্বপ্ন, যা তৈরি করা হয়েছে যাতে কোনো মানুষ রক্তের অভাবে বিপদে না পড়ে।",
      icon: <Heart className="w-6 h-6 text-red-600" />,
      author: "তানভীর আহমেদ"
    },
    {
      title: "সহযোগী - আকাশ চৌধুরী",
      content: "রক্তদান প্ল্যাটফর্মের কারিগরি ও গঠনমূলক কাজে আকাশের অবদান অপরিসীম। তার অক্লান্ত পরিশ্রমে আমাদের এই যাত্রা সহজ হয়েছে।",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      author: "টিম মেম্বার"
    },
    {
      title: "সহযোগী - নাজমুল ইসলাম রোহান",
      content: "রোহানের সৃজনশীল চিন্তা এবং ডেডিকেশন আমাদের প্রজেক্টকে নতুন মাত্রা দিয়েছে। সে সবসময় টিমের অনুপ্রেরণা হিসেবে কাজ করে।",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      author: "টিম মেম্বার"
    },
    {
      title: "সহযোগী - হুসাইন রাহুল",
      content: "রাহুলের সঠিক দিকনির্দেশনা এবং কঠোর পরিশ্রম ছাড়া এই প্রজেক্টটি বাস্তবায়ন করা অনেক কঠিন হতো। সে আমাদের অন্যতম স্তম্ভ।",
      icon: <Award className="w-6 h-6 text-green-500" />,
      author: "টিম মেম্বার"
    },
    {
      title: "মানবতার জয়গান",
      content: "আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি প্রাণ। আসুন আমরা সবাই মিলে একটি সুস্থ ও রক্তদানকারী সমাজ গড়ে তুলি।",
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      author: "রক্তদান পরিবার"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] transition-colors duration-500 font-sans overflow-x-hidden text-gray-900 dark:text-white">
      <nav className="p-6 flex items-center justify-between sticky top-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl z-50 border-b border-gray-100 dark:border-white/5">
        <a href="/" className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-gray-100 dark:border-white/10 hover:border-red-50 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs">ফিরে যান</span>
        </a>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Project Roktodan</div>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="relative inline-block group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-[2.8rem] blur opacity-25"></div>
            <div className="relative w-36 h-36 bg-white dark:bg-gray-900 rounded-[2.5rem] mx-auto p-1 shadow-2xl overflow-hidden">
               <img 
                 src="https://i.ibb.co.com/RkJQ58wd/image.jpg" 
                 alt="Tanvir Ahmed" 
                 className="w-full h-full object-cover rounded-[2.3rem]" 
               />
            </div>
          </div>
          
          <h1 className="text-4xl font-black mb-3 tracking-tight tracking-tight">তানভীর আহমেদ</h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm text-red-600 text-[10px] font-black uppercase tracking-widest mb-10">
            <Sparkles className="w-3 h-3" /> Founder & Visionary
          </div>
          
          <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
            <a href="https://facebook.com/tanvir.ahmed.fb" target="_blank" className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-[1.5rem] hover:-translate-y-1 transition-all"><Facebook className="w-6 h-6" /></a>
            <a href="tel:01403520600" className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-[1.5rem] hover:-translate-y-1 transition-all"><Phone className="w-6 h-6" /></a>
            <a href="mailto:thanvirteach01@gmail.com" className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-[1.5rem] hover:-translate-y-1 transition-all"><Mail className="w-6 h-6" /></a>
            <a href="https://github.com/tanvir77888" target="_blank" className="flex items-center justify-center p-4 bg-gray-100 dark:bg-white/10 rounded-[1.5rem] hover:-translate-y-1 transition-all"><Github className="w-6 h-6" /></a>
          </div>
        </div>

        <div className="relative mb-12">
          <div className="relative bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl min-h-[250px] overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-1000 ease-in-out ${
                  index === activeSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">{slide.icon}</div>
                  <h2 className="text-xl font-bold leading-tight">{slide.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-medium">
                  {slide.content}
                </p>
                <div className="mt-6 flex items-center gap-2">
                   <div className="h-[2px] w-4 bg-red-600"></div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{slide.author}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${i === activeSlide ? "w-6 bg-red-600" : "w-2 bg-gray-200 dark:bg-gray-800"}`}></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 mb-4"><MapPin className="w-6 h-6" /></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-gray-400">অবস্থান</span>
            <p className="text-sm font-bold mt-1">সিলেট, বাংলাদেশ</p>
          </div>
          <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 mb-4"><Heart className="w-6 h-6" /></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-gray-400">প্যাশন</span>
            <p className="text-sm font-bold mt-1">সমাজসেবা</p>
          </div>
        </div>

        <footer className="mt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">DESIGNED FOR HUMANITY</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
