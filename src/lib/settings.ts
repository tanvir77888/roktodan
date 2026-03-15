// src/lib/settings.ts
import { sql } from "@/lib/db";

// ── Typed settings map ─────────────────────────────────────────────────────

export interface SettingsMap {
  site_name: string;
  site_tagline: string;
  logo_url: string;
  favicon_url: string;
  color_theme: string;
  font_family: string;
  dark_mode_enabled: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_btn1_label: string;
  hero_btn2_label: string;
  search_section_title: string;
  donor_form_title: string;
  donor_form_desc: string;
  request_form_title: string;
  request_form_desc: string;
  why_donate_title: string;
  why_donate_1_icon: string;
  why_donate_1_text: string;
  why_donate_2_icon: string;
  why_donate_2_text: string;
  why_donate_3_icon: string;
  why_donate_3_text: string;
  why_donate_4_icon: string;
  why_donate_4_text: string;
  footer_tagline: string;
  footer_copyright: string;
  facebook_url: string;
  whatsapp_url: string;
  email_address: string;
  show_live_counters: string;
  show_why_donate: string;
  show_dark_mode_toggle: string;
  show_whatsapp_btn: string;
  show_call_btn: string;
  availability_days: string;
  auto_approve: string;
  empty_state_message: string;
  donor_success_msg: string;
  request_success_msg: string;
  field_fullname: string;
  field_bloodgroup: string;
  field_district: string;
  field_upazila: string;
  field_phone: string;
  field_lastdonation: string;
  field_gender: string;
  field_patientname: string;
  field_units: string;
  field_hospital: string;
  field_contact: string;
  field_urgency: string;
  field_note: string;
  urgency_critical: string;
  urgency_moderate: string;
  urgency_normal: string;
  admin_username: string;
  admin_password_hash: string;
}

// ── getSettings ────────────────────────────────────────────────────────────

export async function getSettings(): Promise<SettingsMap> {
  try {
    await sql`SELECT 1 FROM settings LIMIT 1`;
  } catch {
    const { runMigration } = await import("@/lib/db");
    await runMigration();
  }
  const rows = await sql`SELECT key, value FROM settings`;

  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key as string] = (row.value as string) ?? "";
  }

  // Return with all known keys guaranteed — missing keys fall back to ""
  return {
    site_name: map.site_name ?? "",
    site_tagline: map.site_tagline ?? "",
    logo_url: map.logo_url ?? "",
    favicon_url: map.favicon_url ?? "",
    color_theme: map.color_theme ?? "#DC2626",
    font_family: map.font_family ?? "inter",
    dark_mode_enabled: map.dark_mode_enabled ?? "false",
    hero_headline: map.hero_headline || "রক্ত দিন, জীবন বাঁচান",
    hero_subheadline: map.hero_subheadline || "আপনার একটি রক্তদান একটি জীবন বাঁচাতে পারে",
    hero_btn1_label: map.hero_btn1_label || "রক্ত দিন",
    hero_btn2_label: map.hero_btn2_label || "রক্ত চান",
    search_section_title: map.search_section_title || "রক্তদাতা খুঁজুন",
    donor_form_title: map.donor_form_title || "রক্তদাতা হিসেবে নিবন্ধন করুন",
    donor_form_desc: map.donor_form_desc || "আপনার তথ্য দিন এবং জীবন বাঁচানোর অংশ হন",
    request_form_title: map.request_form_title || "রক্তের জন্য অনুরোধ করুন",
    request_form_desc: map.request_form_desc || "জরুরি রক্তের প্রয়োজনে এখনই অনুরোধ করুন",
    why_donate_title: map.why_donate_title || "কেন রক্ত দেবেন?",
    why_donate_1_icon: map.why_donate_1_icon ?? "Heart",
    why_donate_1_text: map.why_donate_1_text ?? "",
    why_donate_2_icon: map.why_donate_2_icon ?? "Users",
    why_donate_2_text: map.why_donate_2_text ?? "",
    why_donate_3_icon: map.why_donate_3_icon ?? "Shield",
    why_donate_3_text: map.why_donate_3_text ?? "",
    why_donate_4_icon: map.why_donate_4_icon ?? "Award",
    why_donate_4_text: map.why_donate_4_text ?? "",
    footer_tagline: map.footer_tagline ?? "",
    footer_copyright: map.footer_copyright ?? "",
    facebook_url: map.facebook_url ?? "",
    whatsapp_url: map.whatsapp_url ?? "",
    email_address: map.email_address ?? "",
    show_live_counters: map.show_live_counters ?? "true",
    show_why_donate: map.show_why_donate ?? "true",
    show_dark_mode_toggle: map.show_dark_mode_toggle ?? "true",
    show_whatsapp_btn: map.show_whatsapp_btn ?? "true",
    show_call_btn: map.show_call_btn ?? "true",
    availability_days: map.availability_days ?? "90",
    auto_approve: map.auto_approve ?? "false",
    empty_state_message: map.empty_state_message ?? "",
    donor_success_msg: map.donor_success_msg ?? "",
    request_success_msg: map.request_success_msg ?? "",
    field_fullname: map.field_fullname || "পূর্ণ নাম",
    field_bloodgroup: map.field_bloodgroup || "রক্তের গ্রুপ",
    field_district: map.field_district || "জেলা",
    field_upazila: map.field_upazila || "উপজেলা",
    field_phone: map.field_phone || "ফোন নম্বর",
    field_lastdonation: map.field_lastdonation || "সর্বশেষ রক্তদানের তারিখ",
    field_gender: map.field_gender || "লিঙ্গ",
    field_patientname: map.field_patientname || "রোগীর নাম",
    field_units: map.field_units || "ব্যাগের সংখ্যা",
    field_hospital: map.field_hospital || "হাসপাতালের নাম",
    field_contact: map.field_contact || "যোগাযোগের নম্বর",
    field_urgency: map.field_urgency || "জরুরিত্ব",
    field_note: map.field_note || "অতিরিক্ত তথ্য",
    urgency_critical: map.urgency_critical || "জরুরি",
    urgency_moderate: map.urgency_moderate || "মাঝারি",
    urgency_normal: map.urgency_normal || "সাধারণ",
    admin_username: map.admin_username ?? "admin",
    admin_password_hash: map.admin_password_hash ?? "",
  };
}

// ── getSetting ─────────────────────────────────────────────────────────────

export async function getSetting(key: string): Promise<string> {
  const rows = await sql`
    SELECT value FROM settings WHERE key = ${key}
  `;

  if (rows.length === 0) return "";
  return (rows[0].value as string) ?? "";
}

// ── updateSettings ─────────────────────────────────────────────────────────

export async function updateSettings(
  updates: Record<string, string>
): Promise<void> {
  for (const [key, value] of Object.entries(updates)) {
    await sql`
      INSERT INTO settings (key, value) VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
  }
}