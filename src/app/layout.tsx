// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Merriweather, Nunito } from "next/font/google";
import { getSettings } from "@/lib/settings";
import SwRegister from "./SwRegister";
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

  const siteUrl = "https://roktodan2.vercel.app";
  const title = s.site_name || "Roktho Bondhon";
  const description =
    s.site_tagline ||
    "রক্ত দিন, জীবন বাঁচান — জরুরি রক্তের প্রয়োজনে ডোনার খুঁজুন, লাইভ বোর্ডে অনুরোধ দেখুন, ডোনার হিসেবে নিবন্ধন করুন।";
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: ["রক্তদান", "blood donor Bangladesh", "রক্তদাতা হবিগঞ্জ", "blood donation", "Roktho Bondhon", "জরুরি রক্ত"],
    manifest: "/manifest.webmanifest",
    themeColor: "#DC2626",
    icons: s.favicon_url
      ? { icon: s.favicon_url }
      : undefined,
    openGraph: {
      type: "website",
      locale: "bn_BD",
      url: siteUrl,
      siteName: title,
      title,
      description,
      images: s.logo_url ? [{ url: s.logo_url, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: s.logo_url ? [s.logo_url] : undefined,
    },
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
      <body className={`${fontClass} antialiased`}>
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
