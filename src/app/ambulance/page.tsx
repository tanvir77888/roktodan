// src/app/ambulance/page.tsx
import { getSettings } from "@/lib/settings";
import { parseDirectory, mapsLink } from "@/lib/directory";
import { Ambulance, MapPin, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AmbulancePage() {
  const settings = await getSettings();
  const entries = parseDirectory(settings.directory_json).filter((e) => e.type === "ambulance");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
            <Ambulance className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            অ্যাম্বুলেন্স সেবা
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            জরুরি প্রয়োজনে অ্যাম্বুলেন্সের যোগাযোগ।
          </p>
        </div>

        <a
          href="tel:999"
          className="block bg-red-600 text-white rounded-2xl p-5 text-center mb-6 shadow-sm"
        >
          <div className="text-sm font-medium text-red-100">জাতীয় জরুরি সেবা</div>
          <div className="text-4xl font-black tracking-wider mt-1">৯৯৯</div>
          <div className="text-xs text-red-100 mt-1">যেকোনো জরুরি অবস্থায় কল করুন — সম্পূর্ণ ফ্রি</div>
        </a>

        {entries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500">
            স্থানীয় অ্যাম্বুলেন্সের তালিকা শীঘ্রই যোগ করা হবে।
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((e, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-4 flex flex-wrap items-center gap-3 shadow-sm"
              >
                <div className="flex-1 min-w-[220px]">
                  <div className="font-bold text-gray-900 dark:text-white">{e.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {e.address || e.area}
                  </div>
                  {e.phone && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5" /> {e.phone}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {e.phone && (
                    <a
                      href={`tel:${e.phone}`}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium"
                    >
                      কল করুন
                    </a>
                  )}
                  <a
                    href={mapsLink(e)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border-2 border-red-600 text-red-600 text-sm font-semibold"
                  >
                    ম্যাপে দেখুন
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <a href="/" className="text-sm text-red-600 font-medium">← হোমপেজে ফিরুন</a>
        </div>
      </div>
    </div>
  );
}
