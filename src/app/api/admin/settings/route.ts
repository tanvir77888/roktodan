// src/app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyToken,
  getAdminCredentials,
  verifyPassword,
  hashPassword,
} from "@/lib/auth";
import { updateSettings } from "@/lib/settings";

// ── Valid settings keys whitelist ──────────────────────────────────────────
// Derived from SettingsMap interface — excludes special/security keys that
// are handled separately or must never be written arbitrarily.

const VALID_SETTINGS_KEYS = new Set<string>([
  "site_name",
  "site_tagline",
  "logo_url",
  "favicon_url",
  "color_theme",
  "font_family",
  "dark_mode_enabled",
  "hero_headline",
  "hero_subheadline",
  "hero_btn1_label",
  "hero_btn2_label",
  "search_section_title",
  "donor_form_title",
  "donor_form_desc",
  "request_form_title",
  "request_form_desc",
  "why_donate_title",
  "why_donate_1_icon",
  "why_donate_1_text",
  "why_donate_2_icon",
  "why_donate_2_text",
  "why_donate_3_icon",
  "why_donate_3_text",
  "why_donate_4_icon",
  "why_donate_4_text",
  "footer_tagline",
  "footer_copyright",
  "facebook_url",
  "whatsapp_url",
  "email_address",
  "show_live_counters",
  "show_why_donate",
  "show_dark_mode_toggle",
  "show_whatsapp_btn",
  "show_call_btn",
  "availability_days",
  "auto_approve",
  "empty_state_message",
  "donor_success_msg",
  "request_success_msg",
  "field_fullname",
  "field_bloodgroup",
  "field_district",
  "field_upazila",
  "field_phone",
  "field_lastdonation",
  "field_gender",
  "field_patientname",
  "field_units",
  "field_hospital",
  "field_contact",
  "field_urgency",
  "field_note",
  "urgency_critical",
  "urgency_moderate",
  "urgency_normal",
  // admin_username and admin_password_hash are written only via the
  // password-change flow below, never directly from the request body.
]);

// ── Special keys extracted before passing to updateSettings ───────────────

const SPECIAL_KEYS = new Set([
  "new_password",
  "confirm_new_password",
  "current_password",
  "new_username",
]);

// ── PUT /api/admin/settings ────────────────────────────────────────────────

export async function PUT(req: NextRequest): Promise<NextResponse> {
  // ── Auth check ───────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get("rb_session")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Unauthorised" },
      { status: 401 }
    );
  }

  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorised" },
      { status: 401 }
    );
  }

  // ── Parse body ───────────────────────────────────────────────────────────
  let body: Record<string, string>;
  try {
    body = await req.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new Error("Body must be a JSON object");
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // ── Extract special password-change keys ─────────────────────────────────
  const currentPassword = typeof body.current_password === "string" ? body.current_password : null;
  const newPassword = typeof body.new_password === "string" ? body.new_password : null;
  const confirmNewPassword = typeof body.confirm_new_password === "string" ? body.confirm_new_password : null;
  const newUsername = typeof body.new_username === "string" ? body.new_username.trim() : null;

  // ── Filter to whitelisted settings keys only ─────────────────────────────
  const filteredUpdates: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (SPECIAL_KEYS.has(key)) continue;
    if (!VALID_SETTINGS_KEYS.has(key)) continue;
    if (typeof value !== "string") continue;
    filteredUpdates[key] = value;
  }

  // ── Password / username change flow ──────────────────────────────────────
  const isPasswordChange = newPassword !== null;
  const isUsernameChange = newUsername !== null && newUsername !== "";

  if (isPasswordChange || isUsernameChange) {
    // Current password is mandatory whenever credentials are being changed.
    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: "Current password is required to update credentials" },
        { status: 400 }
      );
    }

    // Verify current password.
    const { username: storedUsername, passwordHash } = await getAdminCredentials();
    const passwordValid = await verifyPassword(currentPassword, passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 403 }
      );
    }

    // Validate new password if provided.
    if (isPasswordChange) {
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }
      if (confirmNewPassword !== null && newPassword !== confirmNewPassword) {
        return NextResponse.json(
          { success: false, error: "New passwords do not match" },
          { status: 400 }
        );
      }

      const newHash = await hashPassword(newPassword);
      filteredUpdates["admin_password_hash"] = newHash;
    }

    // Update username if provided and different from current.
    if (isUsernameChange && newUsername !== storedUsername) {
      if (newUsername.length < 3) {
        return NextResponse.json(
          { success: false, error: "Username must be at least 3 characters" },
          { status: 400 }
        );
      }
      filteredUpdates["admin_username"] = newUsername;
    }
  }

  // ── Persist updates ───────────────────────────────────────────────────────
  try {
    if (Object.keys(filteredUpdates).length > 0) {
      await updateSettings(filteredUpdates);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/admin/settings] Database error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    );
  }
}