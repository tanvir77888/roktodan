// src/app/developer/page.tsx
"use client";

import { Github, Mail, Heart, Code, Award, ArrowLeft, Facebook, Phone, MapPin, Sparkles, ExternalLink } from "lucide-react";

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] transition-colors duration-500 font-sans overflow-x-hidden">
      {/* এনিমেটেড ব্যাকগ্রাউন্ড এলিমেন্ট */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="p-6 flex items-center justify-between sticky top-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl z-50 border-b border-gray-100 dark:border-white/5">
        <a href="/" className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-gray-100 dark:border-white/10 hover:border-red-500 transition-all duration-300">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs">ফিরে যান</span>
        </a>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Live Status</span>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12 relative z-10">
        {/* প্রোফাইল সেকশন */}
        <div className="text-center mb-16">
          <div className="relative inline-block group">
            {/* ছবির চারপাশের এনিমেটেড বর্ডার */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-[2.8rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative w-36 h-36 bg-white dark:bg-gray-900 rounded-[2.5rem] mx-auto mb-8 p-1 shadow-2xl overflow-hidden">
               <img 
                 src="https://i.ibb.co.com/RkJQ58wd/image.jpg" 
                 alt="Tanvir Ahmed" 
                 className="w-full h-full object-cover rounded-[2.3rem] transition-transform duration-700 group-hover:scale-110" 
               />
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">তানভীর আহমেদ</h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm text-red-600 text-[10px] font-black uppercase tracking-widest mb-10">
            <Sparkles className="w-3 h-3" /> Founder & Visionary
          </div>
          
          {/* সোশ্যাল গ্রিড - আরও ইন্টারেক্টিভ */}
          <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
            {[
              { icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10', href: 'https://facebook.com/tanvir.ahmed.fb' },
              { icon: Phone, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-500/10', href: 'tel:01403520600' },
              { icon: Mail, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-500/10', href: 'mailto:thanvirteach01@gmail.com' },
              { icon: Github, color: 'text-gray-900 dark:text-white', bg: 'bg-gray-100 dark:bg-white/10', href: 'https://github.com/tanvir77888' }
            ].map((item, idx) => (
              <a key={idx} href={item.href} target="_blank" className={`flex items-center justify-center p-4 ${item.bg} ${item.color} rounded-[1.5rem] hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl`}>
                <item.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* কার্ড সেকশন */}
        <div className="space-y-6">
          <div className="group p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Code className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-red-600 rounded-full"></span> আমার লক্ষ্য
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-medium">
              আমি প্রযুক্তি বিশেষজ্ঞ না হলেও, প্রযুক্তির মাধ্যমে মানুষের জীবন সহজ করতে ভালোবাসি। এই "রক্তদান" প্ল্যাটফর্মটি আমার একটি স্বপ্ন, যা তৈরি করা হয়েছে যাতে কোনো মানুষ রক্তের অভাবে বিপদে না পড়ে। 
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-red-500/50 transition-colors">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 mb-4 group-hover:rotate-12 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">অবস্থান</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">সিলেট, বাংলাদেশ</p>
            </div>
            <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-red-500/50 transition-colors">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">প্যাশন</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">সমাজসেবা</p>
            </div>
          </div>
        </div>

        {/* ফুটার */}
        <footer className="mt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400 mb-6">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Designed for Humanity</span>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-600 italic">
            Developed with ❤️ by Tanvir Ahmed
          </p>
        </footer>
      </main>
    </div>
  );
}
