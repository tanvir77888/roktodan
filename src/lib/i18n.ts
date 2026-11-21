// src/lib/i18n.ts
// Bounded English version: when the visitor picks English (cookie rb_lang=en),
// the site's chrome — headings, form labels, buttons — switches to English.
// User-generated content (donor names, districts, stories) stays as entered.

import type { SettingsMap } from "@/lib/settings";

export type Lang = "bn" | "en";

export const EN_SETTINGS: Partial<SettingsMap> = {
  hero_headline: "Give Blood, Save a Life",
  hero_subheadline: "One donation from you can save a life",
  hero_btn1_label: "Donate Blood",
  hero_btn2_label: "Request Blood",
  search_section_title: "Find a Blood Donor",
  donor_form_title: "Register as a Donor",
  donor_form_desc: "Fill in your details and become part of saving lives",
  request_form_title: "Request Blood",
  request_form_desc: "Request now in an emergency",
  why_donate_title: "Why donate blood?",
  footer_tagline: "Connecting donors and patients in an emergency",
  empty_state_message: "No donors found. Please try different filters.",
  donor_success_msg: "Your registration was successful!",
  request_success_msg: "Your request was submitted!",
  field_fullname: "Full name",
  field_bloodgroup: "Blood group",
  field_district: "District",
  field_upazila: "Upazila",
  field_phone: "Phone number",
  field_lastdonation: "Last donation date",
  field_gender: "Gender",
  field_patientname: "Patient name",
  field_units: "Units needed",
  field_hospital: "Hospital name",
  field_contact: "Contact number",
  field_urgency: "Urgency",
  field_note: "Additional note",
  urgency_critical: "Critical",
  urgency_moderate: "Moderate",
  urgency_normal: "Normal",
};

export const BOARD_STRINGS: Record<Lang, Record<string, string>> = {
  bn: {
    title: "জরুরি রক্তের অনুরোধ — লাইভ বোর্ড",
    subtitle: "এই মুহূর্তে যাদের রক্ত দরকার — আপনার গ্রুপ মিললে একটা কলই যথেষ্ট",
    sos: "SOS — অতি জরুরি",
    call: "কল করুন",
    share: "শেয়ার করুন",
    empty: "এই মুহূর্তে কোনো জরুরি অনুরোধ নেই।",
    remaining: "বাকি",
  },
  en: {
    title: "Urgent Blood Requests — Live Board",
    subtitle: "People who need blood right now — if your group matches, one call is enough",
    sos: "SOS — Critical",
    call: "Call",
    share: "Share",
    empty: "No urgent requests right now.",
    remaining: "left",
  },
};
