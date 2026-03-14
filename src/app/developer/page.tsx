// src/app/developer/page.tsx
import { Github, Mail, Heart, Code, Award, ArrowLeft, Facebook, Phone, MapPin, User } from "lucide-react";

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-sans">
      {/* মডার্ন নেভিগেশন */}
      <nav className="p-5 flex items-center justify-between sticky top-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg z-50 border-b border-gray-100 dark:border-gray-800">
        <a href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-all">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-bold text-xs">Back</span>
        </a>
        <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12">
        {/* প্রোফাইল সেকশন */}
        <div className="text-center mb-16">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-red-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            {/* ছবির জন্য নিচে src="..." এর জায়গায় আপনার ছবির লিংক দিন */}
            <div className="relative w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-2xl overflow-hidden">
               <User className="w-12 h-12 text-gray-300" />
               {/* ছবির জন্য নিচের লাইনটি ব্যবহার করুন: */}
               {/* <img src="আপনার_ছবির_লিংক" alt="Tanvir" className="w-full h-full object-cover" /> */}
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">তানভীর আহমেদ</h1>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-black uppercase tracking-widest mb-8">
            Visionary & Founder
          </div>
          
          {/* অ্যাকশন বাটনসমূহ */}
          <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
            <a href="https://facebook.com/tanvir.ahmed.fb" target="_blank" className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 hover:scale-110 transition-transform">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="tel:01403520600" className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-600 hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </a>
            <a href="mailto:thanvirteach01@gmail.com" className="flex flex-col items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </a>
            <a href="https://github.com/tanvir77888" target="_blank" className="flex flex-col items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white hover:scale-110 transition-transform">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* ইন্ট্রো সেকশন */}
        <div className="space-y-6">
          <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Code className="w-20 h-20" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">আমার লক্ষ্য</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              আমি প্রযুক্তি বিশেষজ্ঞ না হলেও, প্রযুক্তির মাধ্যমে মানুষের জীবন সহজ করতে ভালোবাসি। এই "রক্তদান" প্ল্যাটফর্মটি আমার একটি স্বপ্ন, যা তৈরি করা হয়েছে যাতে কোনো মানুষ রক্তের অভাবে বিপদে না পড়ে। 
            </p>
          </div>

          {/* ইনফো কার্ডস */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">Sylhet, Bangladesh</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Passion</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">Social Service</p>
            </div>
          </div>
        </div>

        {/* ফুটার */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gray-200 dark:bg-gray-800"></div>
            <Award className="w-5 h-5 text-yellow-500" />
            <div className="h-px w-8 bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Designed for Humanity</p>
        </footer>
      </main>
    </div>
  );
}
