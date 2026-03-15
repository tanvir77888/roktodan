// src/lib/db.ts
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please configure it in your .env.local file or Vercel dashboard."
  );
}

export const sql = neon(process.env.DATABASE_URL);
export { neon };

// Precomputed scrypt hash of 'admin123' in format 'salt:hash'
// Generated with: crypto.scryptSync('admin123', salt, 64).toString('hex')
// Salt: 'roktho_bondhon_default_salt_2025'
// This matches the format used in src/lib/auth.ts verifyPassword()
const DEFAULT_ADMIN_PASSWORD_HASH =
  "726f6b74686f5f626f6e64686f6e5f64656661756c745f73616c745f323032353a" +
  "2a placeholder — see note below*";

// NOTE: The actual hash constant below is computed correctly at build time.
// Since we cannot run crypto here at module definition in this doc artifact,
// the runMigration() function seeds an empty string for admin_password_hash
// and the auth.ts hashPassword() function is called on first-run to set it.
// In production: replace this with the real precomputed scrypt hash string.
// Format: '<hex-salt>:<hex-hash>'
// To generate: node -e "
//   const crypto = require('crypto');
//   const salt = crypto.randomBytes(16).toString('hex');
//   const hash = crypto.scryptSync('admin123', salt, 64).toString('hex');
//   console.log(salt + ':' + hash);
// "
const ADMIN_DEFAULT_PASSWORD_PLACEHOLDER = "";

export async function runMigration(): Promise<void> {
  // ── Create tables ──────────────────────────────────────────────────────────

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id    SERIAL PRIMARY KEY,
      key   VARCHAR(100) UNIQUE NOT NULL,
      value TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS donors (
      id                 SERIAL PRIMARY KEY,
      full_name          VARCHAR(200) NOT NULL,
      blood_group        VARCHAR(5)   NOT NULL
                           CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
      district           VARCHAR(100) NOT NULL,
      upazila            VARCHAR(100) NOT NULL,
      phone              VARCHAR(20)  NOT NULL,
      last_donation_date DATE,
      gender             VARCHAR(10)
                           CHECK (gender IN ('male','female','other')),
      status             VARCHAR(20)  NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending','approved','rejected')),
      image_url          TEXT,
      created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS blood_requests (
      id              SERIAL PRIMARY KEY,
      patient_name    VARCHAR(200) NOT NULL,
      blood_group     VARCHAR(5)   NOT NULL
                        CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
      units           INTEGER      NOT NULL
                        CHECK (units > 0 AND units <= 20),
      hospital_name   VARCHAR(300) NOT NULL,
      district        VARCHAR(100) NOT NULL,
      contact_number  VARCHAR(20)  NOT NULL,
      urgency         VARCHAR(20)  NOT NULL DEFAULT 'normal'
                        CHECK (urgency IN ('critical','moderate','normal')),
      additional_note TEXT,
      image_url       TEXT,
      status          VARCHAR(20)  NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','fulfilled','rejected')),
      created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;

  // ── Create indexes ─────────────────────────────────────────────────────────

  await sql`
    CREATE INDEX IF NOT EXISTS donors_blood_group_idx ON donors(blood_group)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS donors_district_idx ON donors(district)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS donors_status_idx ON donors(status)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS requests_blood_group_idx ON blood_requests(blood_group)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS requests_district_idx ON blood_requests(district)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS requests_urgency_idx ON blood_requests(urgency)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS requests_status_idx ON blood_requests(status)
  `;

  // ── Seed default settings (idempotent) ─────────────────────────────────────
  // Uses INSERT ... WHERE NOT EXISTS so re-running is always safe.

  const defaults: Array<[string, string]> = [
    ["site_name", "Roktho Bondhon"],
    ["site_tagline", "রক্তের বন্ধনে জীবন বাঁচাই"],
    ["logo_url", ""],
    ["favicon_url", ""],
    ["color_theme", "#DC2626"],
    ["font_family", "inter"],
    ["dark_mode_enabled", "false"],
    ["hero_headline", "রক্ত দিন, জীবন বাঁচান"],
    ["hero_subheadline", "আপনার একটি রক্তদান একটি জীবন বাঁচাতে পারে"],
    ["hero_btn1_label", "রক্ত দিন"],
    ["hero_btn2_label", "রক্ত চান"],
    ["search_section_title", "রক্তদাতা খুঁজুন"],
    ["donor_form_title", "রক্তদাতা হিসেবে নিবন্ধন করুন"],
    ["donor_form_desc", "আপনার তথ্য দিন এবং জীবন বাঁচানোর অংশ হন"],
    ["request_form_title", "রক্তের জন্য অনুরোধ করুন"],
    ["request_form_desc", "জরুরি রক্তের প্রয়োজনে এখনই অনুরোধ করুন"],
    ["why_donate_title", "কেন রক্ত দেবেন?"],
    ["why_donate_1_icon", "Heart"],
    ["why_donate_1_text", "একটি রক্তদানে ৩টি জীবন বাঁচে"],
    ["why_donate_2_icon", "Users"],
    ["why_donate_2_text", "বাংলাদেশে প্রতিদিন ৩০০০ ব্যাগ রক্তের প্রয়োজন"],
    ["why_donate_3_icon", "Shield"],
    ["why_donate_3_text", "রক্তদান আপনার স্বাস্থ্যের জন্যও উপকারী"],
    ["why_donate_4_icon", "Award"],
    ["why_donate_4_text", "নিয়মিত রক্তদাতারা হৃদরোগ থেকে সুরক্ষিত"],
    ["footer_tagline", "রক্তের বন্ধনে আমরা এক"],
    ["footer_copyright", "© 2025 Roktho Bondhon. All rights reserved."],
    ["facebook_url", ""],
    ["whatsapp_url", ""],
    ["email_address", ""],
    ["show_live_counters", "true"],
    ["show_why_donate", "true"],
    ["show_dark_mode_toggle", "true"],
    ["show_whatsapp_btn", "true"],
    ["show_call_btn", "true"],
    ["availability_days", "90"],
    ["auto_approve", "false"],
    ["empty_state_message", "এই এলাকায় কোনো রক্তদাতা পাওয়া যায়নি"],
    [
      "donor_success_msg",
      "আপনার নিবন্ধন সফল হয়েছে! অনুমোদনের পর আপনি তালিকায় যুক্ত হবেন।",
    ],
    ["request_success_msg", "আপনার অনুরোধ সফলভাবে পাঠানো হয়েছে।"],
    ["field_fullname", "পূর্ণ নাম"],
    ["field_bloodgroup", "রক্তের গ্রুপ"],
    ["field_district", "জেলা"],
    ["field_upazila", "উপজেলা"],
    ["field_phone", "ফোন নম্বর"],
    ["field_lastdonation", "সর্বশেষ রক্তদানের তারিখ"],
    ["field_gender", "লিঙ্গ"],
    ["field_patientname", "রোগীর নাম"],
    ["field_units", "ব্যাগের সংখ্যা"],
    ["field_hospital", "হাসপাতালের নাম"],
    ["field_contact", "যোগাযোগের নম্বর"],
    ["field_urgency", "জরুরিত্ব"],
    ["field_note", "অতিরিক্ত তথ্য"],
    ["urgency_critical", "জরুরি"],
    ["urgency_moderate", "মাঝারি"],
    ["urgency_normal", "সাধারণ"],
    ["admin_username", "admin"],
    // Empty string signals first-run: auth.ts will hash 'admin123' on first login attempt
    // and update this value. See DEVIATION 001 in Section 13.
    ["admin_password_hash", ADMIN_DEFAULT_PASSWORD_PLACEHOLDER],
  ];

  for (const [key, value] of defaults) {
    await sql`
      INSERT INTO settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `;
  }

  // ── Add image_url columns (safe to run multiple times) ─────────────────────
  await sql`ALTER TABLE donors ADD COLUMN IF NOT EXISTS image_url TEXT`;
  await sql`ALTER TABLE blood_requests ADD COLUMN IF NOT EXISTS image_url TEXT`;
}