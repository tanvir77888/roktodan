// src/app/LangToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

export default function LangToggle() {
  const [lang, setLang] = useState<"bn" | "en">("bn");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )rb_lang=(en|bn)/);
    if (match) setLang(match[1] as "en" | "bn");
  }, []);

  function toggle() {
    const next = lang === "bn" ? "en" : "bn";
    document.cookie = `rb_lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  }

  return (
    <button
      onClick={toggle}
      title={lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <Globe className="w-3.5 h-3.5" />
      {lang === "bn" ? "EN" : "বাংলা"}
    </button>
  );
}
