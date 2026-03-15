// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Merriweather, Nunito } from "next/font/google";
import { getSettings } from "@/lib/settings";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ── Font definitions ───────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

// ── Metadata (dynamic, generated per request) ──────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();

  return {
    title: s.site_name || "Roktho Bondhon",
    description: s.site_tagline || "রক্তের বন্ধনে জীবন বাঁচাই",
    icons: s.favicon_url
      ? { icon: s.favicon_url }
      : undefined,
    // গুগল সার্চ কনসোল ভেরিফিকেশন কোড এখানে যোগ করা হলো
    verification: {
      google: "-b1iVU6-RA4sFwdIlq-3qdpDSaooR503B7pxXSBHuZQ",
    },
  };
}

// ── Root Layout ────────────────────────────────────────────────────────────

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();

  // Determine which font variable class to apply to <body>
  const fontClass =
    s.font_family === "merriweather"
      ? merriweather.className
      : s.font_family === "nunito"
      ? nunito.className
      : inter.className;

  const fontVariables = [
    inter.variable,
    merriweather.variable,
    nunito.variable,
  ].join(" ");

  const darkClass = s.dark_mode_enabled === "true" ? "dark" : "";

  return (
    <html
      lang="bn"
      className={`${fontVariables} ${darkClass}`.trim()}
      style={{ ["--color-primary" as string]: s.color_theme || "#DC2626" }}
    >
      <body className={`${fontClass} antialiased`}>{children}</body>
    </html>
  );
}
