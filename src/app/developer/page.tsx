// src/app/developer/page.tsx
import { Github, Mail, Globe, Heart, Code, Award, ArrowLeft, Facebook, Linkedin } from "lucide-react";
import Image from "next/image";

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Top Header/Navigation */}
      <nav className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
        <a href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold text-sm">ফিরে যান</span>
        </a>
        <div className="text-xs font-bold text-red-600 uppercase tracking-widest">Developer Profile</div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Profile Identity Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-gradient-to-tr from-red-600 to-red-400 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
              T
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 shadow-sm"></div>
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">তানভীর আহমেদ</h1>
          <p className="text-red-600 font-bold text-sm uppercase tracking-widest mb-6">Full Stack Developer & UI Enthusiast</p>
          
          {/* Social Icons */}
          <div className="flex justify-center gap-3 mb-8">
            <a href="https://github.com/tanvir77888" target="_blank" className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-all">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-all">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="mailto:contact@tanvir.com" className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-all">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-50 dark:bg-gray-800/40 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-red-600" /> আমার সম্পর্কে
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            আমি একজন প্যাশনেট ওয়েব ডেভেলপার। মানুষের দৈনন্দিন সমস্যা সমাধানে প্রযুক্তি ব্যবহার করতে আমি ভালোবাসি। 
            এই রক্তদান (Roktodan) প্রজেক্টটি আমার অন্যতম একটি প্রিয় কাজ, যা তৈরি করা হয়েছে জরুরি মুহূর্তে দ্রুত রক্তদাতা খুঁজে পাওয়ার প্রক্রিয়াকে সহজ করার জন্য।
          </p>
        </div>

        {/* Stats/Skills Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm">
            <Award className="w-8 h-8 text-red-600 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white">Expertise</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium italic">Next.js, TypeScript, PostgreSQL</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm">
            <Heart className="w-8 h-8 text-red-600 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white">Goal</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium italic">Building tech for social good</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center border-t border-gray-100 dark:border-gray-800 pt-8">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Project: Roktodan Alpha v1.0
          </p>
          <p className="text-[10px] text-gray-400 mt-1 italic">
            Developed with ❤️ by Tanvir Ahmed
          </p>
        </div>
      </main>
    </div>
  );
}
