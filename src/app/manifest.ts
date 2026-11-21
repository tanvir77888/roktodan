// src/app/manifest.ts
import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  const icons: MetadataRoute.Manifest["icons"] = s.logo_url
    ? [
        { src: s.logo_url, sizes: "192x192", type: "image/png", purpose: "any" },
        { src: s.logo_url, sizes: "512x512", type: "image/png", purpose: "any" },
      ]
    : [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      ];

  return {
    name: s.site_name || "Roktho Bondhon — রক্তবন্ধন",
    short_name: "রক্তবন্ধন",
    description: s.site_tagline || "রক্ত দিন, জীবন বাঁচান",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: s.color_theme || "#DC2626",
    lang: "bn",
    icons,
  };
}
