// src/app/page.tsx
import Link from "next/link";
import { Search, Heart, PlusCircle, ArrowRight } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-sans">
      {/* নেভিগেশন বার */}
      <nav className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-red-600/20">R</div>
          <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">রক্তদান</span>
        </div>
        <MobileMenu />
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12">
        {/* টেক্সট সেকশন */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
            রক্তের প্রয়োজনে <br />পাশে আছি আমরা
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm mx-auto font-medium">
            আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি প্রাণ। দ্রুত রক্তদাতা খুঁজে পেতে নিচের অপশনগুলো ব্যবহার করুন।
          </p>
        </div>

        {/* প্রধান বাটনগুলো (এগুলো এখন আলাদা পেজে নিয়ে যাবে) */}
        <div className="grid gap-5">
          {/* রক্তদাতা খুঁজুন বাটন */}
          <Link href="/search" className="group p-6 bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/20 flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-600/30 group-hover:rotate-6 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">রক্তদাতা খুঁজুন</h3>
                <p className="text-xs text-red-600/70 dark:text-red-400 font-bold tracking-wide uppercase">SEARCH DONOR</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          {/* রক্ত দিন বাটন */}
          <Link href="/donate" className="group p-6 bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-green-500 rounded-2xl text-white shadow-xl shadow-green-500/20 group-hover:-rotate-6 transition-transform">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">রক্ত দিন</h3>
                <p className="text-xs text-gray-500 font-bold tracking-wide uppercase">BE A DONOR</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" />
          </Link>

          {/* রক্ত চান বাটন */}
          <Link href="/request" className="group p-6 bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-orange-500 rounded-2xl text-white shadow-xl shadow-orange-500/20 group-hover:rotate-12 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">রক্ত চান</h3>
                <p className="text-xs text-gray-500 font-bold tracking-wide uppercase">REQUEST BLOOD</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
          </Link>
        </div>

        {/* ছোট ফুটার ইনফো */}
        <div className="mt-20 text-center">
          <div className="h-1 w-12 bg-gray-200 dark:bg-gray-800 mx-auto mb-6 rounded-full"></div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
            Roktodan • Founded by Tanvir Ahmed
          </p>
        </div>
      </main>
    </div>
  );
}
