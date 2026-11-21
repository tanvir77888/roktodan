// src/app/compatibility/page.tsx
import { HeartHandshake } from "lucide-react";

const ROWS: Array<{ group: string; donateTo: string[]; receiveFrom: string[] }> = [
  { group: "O-", donateTo: ["সবাই"], receiveFrom: ["O-"] },
  { group: "O+", donateTo: ["O+", "A+", "B+", "AB+"], receiveFrom: ["O-", "O+"] },
  { group: "A-", donateTo: ["A-", "A+", "AB-", "AB+"], receiveFrom: ["O-", "A-"] },
  { group: "A+", donateTo: ["A+", "AB+"], receiveFrom: ["O-", "O+", "A-", "A+"] },
  { group: "B-", donateTo: ["B-", "B+", "AB-", "AB+"], receiveFrom: ["O-", "B-"] },
  { group: "B+", donateTo: ["B+", "AB+"], receiveFrom: ["O-", "O+", "B-", "B+"] },
  { group: "AB-", donateTo: ["AB-", "AB+"], receiveFrom: ["O-", "A-", "B-", "AB-"] },
  { group: "AB+", donateTo: ["AB+"], receiveFrom: ["সবাই"] },
];

export default function CompatibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
            <HeartHandshake className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            কে কাকে রক্ত দিতে পারে?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            রক্তের গ্রুপ মিলের সহজ চার্ট — O- হলো সার্বজনীন দাতা, AB+ সার্বজনীন গ্রহীতা।
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-red-600 text-white text-left">
                <th className="px-4 py-3 font-bold">আপনার গ্রুপ</th>
                <th className="px-4 py-3 font-bold">দিতে পারবেন</th>
                <th className="px-4 py-3 font-bold">নিতে পারবেন</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.group} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="px-4 py-3">
                    <span className="font-black text-red-600 text-base">{r.group}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{r.donateTo.join(", ")}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{r.receiveFrom.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mt-5 text-sm text-amber-800 dark:text-amber-300">
          💡 <strong>জরুরি অবস্থায়</strong> হাসপাতাল/ব্লাড ব্যাংক ক্রস-ম্যাচ করে রক্ত দেয় — তাই গ্রুপ না মিললেও
          হতাশ হবেন না, ব্লাড ব্যাংকে যোগাযোগ করুন এবং আমাদের লাইভ বোর্ডে অনুরোধ পোস্ট করুন।
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
