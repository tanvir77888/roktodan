// src/app/about/page.tsx
import { getSettings } from "@/lib/settings";
import { Droplet, Phone, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
            <Droplet className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">আমাদের সম্পর্কে</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed text-[15px]">
          <p>
            <strong className="text-red-600">{settings.site_name}</strong> একটি সম্পূর্ণ স্বেচ্ছাসেবী,
            অলাভজনক উদ্যোগ। আমাদের একটাই লক্ষ্য — জরুরি মুহূর্তে রোগীর জন্য দ্রুততম সময়ে সঠিক গ্রুপের
            রক্তদাতা খুঁজে দেওয়া।
          </p>
          <p>
            হবিগঞ্জ থেকে শুরু করে আজ আমাদের তালিকায় শত শত নিবন্ধিত ডোনার রয়েছেন। কেউ যখন রক্তের জন্য
            অনুরোধ করেন, এডমিন যাচাই করে তা লাইভ বোর্ডে তুলে দেন — যাতে কাছের ডোনাররা সরাসরি যোগাযোগ
            করতে পারেন।
          </p>
          <p>
            এই প্ল্যাটফর্মে কোনো সেবার জন্যই <strong>কোনো টাকা নেওয়া হয় না</strong>। রক্তদান সম্পূর্ণ
            স্বেচ্ছায় ও মানবিক দায়িত্ব থেকে। কেউ যদি রক্তের বিনিময়ে টাকা দাবি করে, অনুগ্রহ করে আমাদের
            হেল্পলাইনে জানান।
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
            <div className="font-bold text-gray-900 dark:text-white mb-2">যোগাযোগ</div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                {settings.helpline_1_name}: {settings.helpline_1_phone}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                {settings.helpline_2_name}: {settings.helpline_2_phone}
              </div>
              {settings.whatsapp_url && (
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp-এ মেসেজ করুন
                </a>
              )}
            </div>
          </div>
          <p className="text-center font-semibold text-gray-900 dark:text-white pt-2">
            রক্ত দিন, জীবন বাঁচান ✊
          </p>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
