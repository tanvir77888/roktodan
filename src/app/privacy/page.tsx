// src/app/privacy/page.tsx
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">গোপনীয়তা নীতি</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">সর্বশেষ হালনাগাদ: ২১ নভেম্বর ২০২৬</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-5 text-gray-700 dark:text-gray-200 leading-relaxed text-[15px]">
          <section>
            <h2 className="font-bold text-gray-900 dark:text-white mb-1.5">১. আমরা কী তথ্য নিই</h2>
            <p>
              ডোনার নিবন্ধনের সময় নাম, রক্তের গ্রুপ, জেলা, উপজেলা, মোবাইল নম্বর, লিঙ্গ, শেষ রক্তদানের
              তারিখ এবং (ঐচ্ছিক) ছবি নেওয়া হয়। রক্তের অনুরোধের সময় রোগীর নাম, হাসপাতাল, যোগাযোগের
              নম্বর ও প্রয়োজনীয় তথ্য নেওয়া হয়।
            </p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 dark:text-white mb-1.5">২. তথ্য কেন ব্যবহার হয়</h2>
            <p>
              একমাত্র উদ্দেশ্য — রক্তের প্রয়োজনে গ্রহীতা ও দাতার মধ্যে যোগাযোগ করিয়ে দেওয়া। অনুমোদিত
              ডোনারের নাম, গ্রুপ, এলাকা ও নম্বর ওয়েবসাইটে প্রকাশিত হয় যাতে রোগীর পরিবার সরাসরি যোগাযোগ
              করতে পারেন — নিবন্ধনের মাধ্যমে আপনি এতে সম্মতি দিচ্ছেন।
            </p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 dark:text-white mb-1.5">৩. তৃতীয় পক্ষের কাছে বিক্রি নয়</h2>
            <p>
              আমরা আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি করি না, বিজ্ঞাপনের কাজে ব্যবহার করি না এবং
              অপ্রয়োজনীয়ভাবে ভাগ করি না।
            </p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 dark:text-white mb-1.5">৪. নম্বর আংশিক লুকানো</h2>
            <p>
              সার্চ ফলাফলে মোবাইল নম্বর আংশিক লুকিয়ে দেখানো হয়; পূর্ণ নম্বর দেখতে দর্শনার্থীকে ক্লিক
              করতে হয়। এটি অপব্যবহার কমানোর একটি ব্যবস্থা।
            </p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 dark:text-white mb-1.5">৫. তথ্য মুছে ফেলা</h2>
            <p>
              যেকোনো সময় হেল্পলাইনে যোগাযোগ করে আপনার তথ্য সংশোধন বা সম্পূর্ণ মুছে ফেলার অনুরোধ করতে
              পারেন। যাচাই করে আমরা দ্রুততম সময়ে ব্যবস্থা নেব।
            </p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 dark:text-white mb-1.5">৬. ভুয়া তথ্য</h2>
            <p>
              ভুয়া নম্বর বা মিথ্যা তথ্য দিলে তা রিপোর্টের মাধ্যমে যাচাই করে তালিকা থেকে সরিয়ে দেওয়া হয়।
            </p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 dark:text-white mb-1.5">৭. নীতির পরিবর্তন</h2>
            <p>
              প্রয়োজনে এই নীতি হালনাগাদ করা হতে পারে; পরিবর্তন এই পেজেই প্রকাশ করা হবে।
            </p>
          </section>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
