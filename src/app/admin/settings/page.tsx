"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Save,
  Upload,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Palette,
  Type,
  Layout,
  MessageSquare,
  Share2,
  Lock,
  ToggleLeft,
  Heart,
  Users,
  Shield,
  Award,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface SettingsForm {
  // Appearance
  site_name: string;
  site_tagline: string;
  logo_url: string;
  favicon_url: string;
  color_theme: string;
  font_family: string;
  dark_mode_enabled: string;
  // Content — Hero
  hero_headline: string;
  hero_subheadline: string;
  hero_btn1_label: string;
  hero_btn2_label: string;
  // Content — Sections
  search_section_title: string;
  donor_form_title: string;
  donor_form_desc: string;
  request_form_title: string;
  request_form_desc: string;
  // Content — Why Donate
  why_donate_title: string;
  why_donate_1_icon: string;
  why_donate_1_text: string;
  why_donate_2_icon: string;
  why_donate_2_text: string;
  why_donate_3_icon: string;
  why_donate_3_text: string;
  why_donate_4_icon: string;
  why_donate_4_text: string;
  // Content — Footer & Messages
  footer_tagline: string;
  footer_copyright: string;
  empty_state_message: string;
  donor_success_msg: string;
  request_success_msg: string;
  // Content — Field Labels
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
  // Social
  facebook_url: string;
  whatsapp_url: string;
  email_address: string;
  // Visibility
  show_live_counters: string;
  show_why_donate: string;
  show_dark_mode_toggle: string;
  show_whatsapp_btn: string;
  show_call_btn: string;
  availability_days: string;
  auto_approve: string;
}

interface SecurityForm {
  current_password: string;
  new_username: string;
  new_password: string;
  confirm_new_password: string;
}

type TabId =
  | "appearance"
  | "content"
  | "social"
  | "security"
  | "visibility";

// ── Constants ──────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { label: "Classic Red", value: "#DC2626" },
  { label: "Royal Purple", value: "#7C3AED" },
  { label: "Ocean Blue", value: "#2563EB" },
  { label: "Forest Green", value: "#16A34A" },
  { label: "Warm Orange", value: "#EA580C" },
  { label: "Dark Slate", value: "#475569" },
  { label: "Soft Pink", value: "#EC4899" },
];

const ICON_OPTIONS = ["Heart", "Users", "Shield", "Award"] as const;
type IconName = (typeof ICON_OPTIONS)[number];

const ICON_MAP: Record<IconName, React.ReactNode> = {
  Heart: <Heart className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
};

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
  { id: "content", label: "Content", icon: <Layout className="w-4 h-4" /> },
  { id: "social", label: "Social & Contact", icon: <Share2 className="w-4 h-4" /> },
  { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
  { id: "visibility", label: "Visibility", icon: <ToggleLeft className="w-4 h-4" /> },
];

const DEFAULT_FORM: SettingsForm = {
  site_name: "",
  site_tagline: "",
  logo_url: "",
  favicon_url: "",
  color_theme: "#DC2626",
  font_family: "inter",
  dark_mode_enabled: "false",
  hero_headline: "",
  hero_subheadline: "",
  hero_btn1_label: "",
  hero_btn2_label: "",
  search_section_title: "",
  donor_form_title: "",
  donor_form_desc: "",
  request_form_title: "",
  request_form_desc: "",
  why_donate_title: "",
  why_donate_1_icon: "Heart",
  why_donate_1_text: "",
  why_donate_2_icon: "Users",
  why_donate_2_text: "",
  why_donate_3_icon: "Shield",
  why_donate_3_text: "",
  why_donate_4_icon: "Award",
  why_donate_4_text: "",
  footer_tagline: "",
  footer_copyright: "",
  empty_state_message: "",
  donor_success_msg: "",
  request_success_msg: "",
  field_fullname: "",
  field_bloodgroup: "",
  field_district: "",
  field_upazila: "",
  field_phone: "",
  field_lastdonation: "",
  field_gender: "",
  field_patientname: "",
  field_units: "",
  field_hospital: "",
  field_contact: "",
  field_urgency: "",
  field_note: "",
  urgency_critical: "",
  urgency_moderate: "",
  urgency_normal: "",
  facebook_url: "",
  whatsapp_url: "",
  email_address: "",
  show_live_counters: "true",
  show_why_donate: "true",
  show_dark_mode_toggle: "true",
  show_whatsapp_btn: "true",
  show_call_btn: "true",
  availability_days: "90",
  auto_approve: "false",
};

// ── Sub-components ─────────────────────────────────────────────────────────

function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
    />
  );
}

function TextAreaInput({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition resize-none"
    />
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
          checked ? "bg-[var(--color-primary)]" : "bg-gray-200"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

function SaveButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-60 transition"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {loading ? "Saving…" : "Save Changes"}
    </button>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────

function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
        type === "success"
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200"
      }`}
    >
      {type === "success" ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-600" />
      )}
      {message}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("appearance");
  const [form, setForm] = useState<SettingsForm>(DEFAULT_FORM);
  const [security, setSecurity] = useState<SecurityForm>({
    current_password: "",
    new_username: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [customColor, setCustomColor] = useState("");
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [adminUsername, setAdminUsername] = useState("");

  // ── Helpers ──────────────────────────────────────────────────────────────

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const setField = useCallback(
    <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const boolStr = (val: string) => val === "true";

  // ── Load settings on mount ────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings", { credentials: 'include' });
        if (!res.ok) throw new Error("Failed to load settings");
        const json = await res.json();
        const s = (json.data ?? json) as Record<string, string>;

        setForm({
          site_name: s.site_name ?? "",
          site_tagline: s.site_tagline ?? "",
          logo_url: s.logo_url ?? "",
          favicon_url: s.favicon_url ?? "",
          color_theme: s.color_theme ?? "#DC2626",
          font_family: s.font_family ?? "inter",
          dark_mode_enabled: s.dark_mode_enabled ?? "false",
          hero_headline: s.hero_headline ?? "",
          hero_subheadline: s.hero_subheadline ?? "",
          hero_btn1_label: s.hero_btn1_label ?? "",
          hero_btn2_label: s.hero_btn2_label ?? "",
          search_section_title: s.search_section_title ?? "",
          donor_form_title: s.donor_form_title ?? "",
          donor_form_desc: s.donor_form_desc ?? "",
          request_form_title: s.request_form_title ?? "",
          request_form_desc: s.request_form_desc ?? "",
          why_donate_title: s.why_donate_title ?? "",
          why_donate_1_icon: s.why_donate_1_icon ?? "Heart",
          why_donate_1_text: s.why_donate_1_text ?? "",
          why_donate_2_icon: s.why_donate_2_icon ?? "Users",
          why_donate_2_text: s.why_donate_2_text ?? "",
          why_donate_3_icon: s.why_donate_3_icon ?? "Shield",
          why_donate_3_text: s.why_donate_3_text ?? "",
          why_donate_4_icon: s.why_donate_4_icon ?? "Award",
          why_donate_4_text: s.why_donate_4_text ?? "",
          footer_tagline: s.footer_tagline ?? "",
          footer_copyright: s.footer_copyright ?? "",
          empty_state_message: s.empty_state_message ?? "",
          donor_success_msg: s.donor_success_msg ?? "",
          request_success_msg: s.request_success_msg ?? "",
          field_fullname: s.field_fullname ?? "",
          field_bloodgroup: s.field_bloodgroup ?? "",
          field_district: s.field_district ?? "",
          field_upazila: s.field_upazila ?? "",
          field_phone: s.field_phone ?? "",
          field_lastdonation: s.field_lastdonation ?? "",
          field_gender: s.field_gender ?? "",
          field_patientname: s.field_patientname ?? "",
          field_units: s.field_units ?? "",
          field_hospital: s.field_hospital ?? "",
          field_contact: s.field_contact ?? "",
          field_urgency: s.field_urgency ?? "",
          field_note: s.field_note ?? "",
          urgency_critical: s.urgency_critical ?? "",
          urgency_moderate: s.urgency_moderate ?? "",
          urgency_normal: s.urgency_normal ?? "",
          facebook_url: s.facebook_url ?? "",
          whatsapp_url: s.whatsapp_url ?? "",
          email_address: s.email_address ?? "",
          show_live_counters: s.show_live_counters ?? "true",
          show_why_donate: s.show_why_donate ?? "true",
          show_dark_mode_toggle: s.show_dark_mode_toggle ?? "true",
          show_whatsapp_btn: s.show_whatsapp_btn ?? "true",
          show_call_btn: s.show_call_btn ?? "true",
          availability_days: s.availability_days ?? "90",
          auto_approve: s.auto_approve ?? "false",
        });

        // Determine if current theme is a preset or custom
        const isPreset = COLOR_PRESETS.some((p) => p.value === (s.color_theme ?? "#DC2626"));
        if (!isPreset) {
          setShowCustomColor(true);
          setCustomColor(s.color_theme ?? "");
        }

        // Load admin username separately (not exposed in public settings)
        // We show an empty input for the admin to set a new username
        setAdminUsername("");
      } catch {
        showToast("Failed to load settings", "error");
      } finally {
        setLoadingInit(false);
      }
    }
    load();
  }, [showToast]);

  // ── Image upload ──────────────────────────────────────────────────────────

  async function handleImageUpload(
    file: File,
    field: "logo_url" | "favicon_url"
  ) {
    const setter = field === "logo_url" ? setLogoUploading : setFaviconUploading;
    setter(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) {
const err = await res.json().catch(() => ({}));
        throw new Error((err as { success: boolean; error?: string }).error ?? "Upload failed");
      }
      const data = (await res.json()) as { success: boolean; data: { url: string } };
      setField(field, data.data.url);
      showToast("Image uploaded successfully", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Image upload failed",
        "error"
      );
    } finally {
      setter(false);
    }
  }

  // ── Save helpers ──────────────────────────────────────────────────────────

  async function saveKeys(keys: (keyof SettingsForm)[], sectionId: string) {
    setSavingSection(sectionId);
    try {
      const updates: Record<string, string> = {};
      for (const k of keys) {
        updates[k] = form[k];
      }
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: 'include',
      });
      if (!res.ok) {
       const err = await res.json().catch(() => ({}));
        throw new Error((err as { success: boolean; error?: string }).error ?? "Upload failed");
      }
      showToast("Settings saved successfully", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to save settings",
        "error"
      );
    } finally {
      setSavingSection(null);
    }
  }

  // ── Security save ─────────────────────────────────────────────────────────

  async function handleSecuritySave() {
    // Client-side validation
    if (!security.current_password) {
      showToast("Current password is required", "error");
      return;
    }
    if (security.new_password && security.new_password.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (security.new_password !== security.confirm_new_password) {
      showToast("New passwords do not match", "error");
      return;
    }

    setSavingSection("security");
    try {
      const payload: Record<string, string> = {
        current_password: security.current_password,
      };
      if (security.new_username.trim()) {
        payload.new_username = security.new_username.trim();
      }
      if (security.new_password) {
        payload.new_password = security.new_password;
        payload.confirm_new_password = security.confirm_new_password;
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { success: boolean; error?: string }).error ?? "Upload failed");
      }

      showToast("Credentials updated successfully", "success");
      setSecurity({
        current_password: "",
        new_username: "",
        new_password: "",
        confirm_new_password: "",
      });
      setAdminUsername("");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update credentials",
        "error"
      );
    } finally {
      setSavingSection(null);
    }
  }

  // ── Color theme handler ───────────────────────────────────────────────────

  function handleColorPreset(hex: string) {
    setShowCustomColor(false);
    setCustomColor("");
    setField("color_theme", hex);
  }

  function handleCustomColorChange(val: string) {
    setCustomColor(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setField("color_theme", val);
    }
  }

  // ── Render helpers for icon select ────────────────────────────────────────

  function IconSelect({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {ICON_OPTIONS.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            title={icon}
            className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition ${
              value === icon
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
            }`}
          >
            {ICON_MAP[icon as IconName]}
            <span className="hidden sm:inline">{icon}</span>
          </button>
        ))}
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────────

  if (loadingInit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Loading settings…</p>
        </div>
      </div>
    );
  }

  // ── Tab content renderers ─────────────────────────────────────────────────

  function renderAppearance() {
    return (
      <div className="space-y-6">
        {/* Branding */}
        <SectionCard title="Branding">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Site Name">
              <TextInput
                value={form.site_name}
                onChange={(v) => setField("site_name", v)}
                placeholder="Roktho Bondhon"
              />
            </FormField>
            <FormField label="Site Tagline">
              <TextInput
                value={form.site_tagline}
                onChange={(v) => setField("site_tagline", v)}
                placeholder="রক্তের বন্ধনে জীবন বাঁচাই"
              />
            </FormField>
          </div>

          {/* Logo Upload */}
          <FormField label="Site Logo" hint="Recommended: PNG or SVG, max 2MB">
            <div className="flex items-center gap-4">
              {form.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.logo_url}
                  alt="Logo preview"
                  className="h-10 w-auto rounded border border-gray-200 object-contain bg-gray-50 p-1"
                />
              )}
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition">
                {logoUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {logoUploading ? "Uploading…" : "Upload Logo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                  disabled={logoUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "logo_url");
                    e.target.value = "";
                  }}
                />
              </label>
              {form.logo_url && (
                <button
                  type="button"
                  onClick={() => setField("logo_url", "")}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  Remove
                </button>
              )}
            </div>
          </FormField>

          {/* Favicon Upload */}
          <FormField label="Favicon" hint="Recommended: ICO or PNG 32×32, max 2MB">
            <div className="flex items-center gap-4">
              {form.favicon_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.favicon_url}
                  alt="Favicon preview"
                  className="h-8 w-8 rounded border border-gray-200 object-contain bg-gray-50 p-0.5"
                />
              )}
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition">
                {faviconUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                {faviconUploading ? "Uploading…" : "Upload Favicon"}
                <input
                  type="file"
                  accept="image/x-icon,image/png,image/jpeg"
                  className="hidden"
                  disabled={faviconUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "favicon_url");
                    e.target.value = "";
                  }}
                />
              </label>
              {form.favicon_url && (
                <button
                  type="button"
                  onClick={() => setField("favicon_url", "")}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  Remove
                </button>
              )}
            </div>
          </FormField>
        </SectionCard>

        {/* Color Theme */}
        <SectionCard title="Color Theme">
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleColorPreset(preset.value)}
                  title={preset.label}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                    form.color_theme === preset.value && !showCustomColor
                      ? "border-gray-400 ring-2 ring-offset-1 ring-gray-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: preset.value }}
                  />
                  <span className="text-gray-700 truncate text-xs sm:text-sm">{preset.label}</span>
                  {form.color_theme === preset.value && !showCustomColor && (
                    <Check className="w-3 h-3 text-gray-600 flex-shrink-0" />
                  )}
                </button>
              ))}

              {/* Custom */}
              <button
                type="button"
                onClick={() => {
                  setShowCustomColor(true);
                  if (!customColor) setCustomColor(form.color_theme);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                  showCustomColor
                    ? "border-gray-400 ring-2 ring-offset-1 ring-gray-400"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-gray-300 bg-gradient-to-br from-pink-400 via-yellow-400 to-blue-400 flex-shrink-0"
                />
                <span className="text-gray-700 text-xs sm:text-sm">Custom</span>
              </button>
            </div>

            {showCustomColor && (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(customColor)
                      ? customColor
                      : "#e5e7eb",
                  }}
                />
                <div className="flex-1 max-w-xs">
                  <TextInput
                    value={customColor}
                    onChange={handleCustomColorChange}
                    placeholder="#000000"
                  />
                </div>
                <span className="text-xs text-gray-400">Hex format: #RRGGBB</span>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Font */}
        <SectionCard title="Font Family">
          <div className="flex flex-wrap gap-3">
            {[
              { value: "inter", label: "Modern", sub: "Inter" },
              { value: "merriweather", label: "Classic", sub: "Merriweather" },
              { value: "nunito", label: "Rounded", sub: "Nunito" },
            ].map((font) => (
              <button
                key={font.value}
                type="button"
                onClick={() => setField("font_family", font.value)}
                className={`px-4 py-3 rounded-lg border text-left transition ${
                  form.font_family === font.value
                    ? "border-[var(--color-primary)] bg-red-50 ring-1 ring-[var(--color-primary)]"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <p className="text-sm font-semibold text-gray-800">{font.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{font.sub}</p>
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <SaveButton
            onClick={() =>
              saveKeys(
                [
                  "site_name",
                  "site_tagline",
                  "logo_url",
                  "favicon_url",
                  "color_theme",
                  "font_family",
                  "dark_mode_enabled",
                ],
                "appearance"
              )
            }
            loading={savingSection === "appearance"}
          />
        </div>
      </div>
    );
  }

  function renderContent() {
    return (
      <div className="space-y-6">
        {/* Hero */}
        <SectionCard title="Hero Section">
          <div className="space-y-4">
            <FormField label="Headline">
              <TextInput
                value={form.hero_headline}
                onChange={(v) => setField("hero_headline", v)}
                placeholder="রক্ত দিন, জীবন বাঁচান"
              />
            </FormField>
            <FormField label="Subheadline">
              <TextInput
                value={form.hero_subheadline}
                onChange={(v) => setField("hero_subheadline", v)}
                placeholder="আপনার একটি রক্তদান একটি জীবন বাঁচাতে পারে"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Button 1 Label">
                <TextInput
                  value={form.hero_btn1_label}
                  onChange={(v) => setField("hero_btn1_label", v)}
                  placeholder="রক্ত দিন"
                />
              </FormField>
              <FormField label="Button 2 Label">
                <TextInput
                  value={form.hero_btn2_label}
                  onChange={(v) => setField("hero_btn2_label", v)}
                  placeholder="রক্ত চান"
                />
              </FormField>
            </div>
          </div>
        </SectionCard>

        {/* Sections */}
        <SectionCard title="Section Titles & Descriptions">
          <div className="space-y-4">
            <FormField label="Search Section Title">
              <TextInput
                value={form.search_section_title}
                onChange={(v) => setField("search_section_title", v)}
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Donor Form Title">
                <TextInput
                  value={form.donor_form_title}
                  onChange={(v) => setField("donor_form_title", v)}
                />
              </FormField>
              <FormField label="Donor Form Description">
                <TextInput
                  value={form.donor_form_desc}
                  onChange={(v) => setField("donor_form_desc", v)}
                />
              </FormField>
              <FormField label="Request Form Title">
                <TextInput
                  value={form.request_form_title}
                  onChange={(v) => setField("request_form_title", v)}
                />
              </FormField>
              <FormField label="Request Form Description">
                <TextInput
                  value={form.request_form_desc}
                  onChange={(v) => setField("request_form_desc", v)}
                />
              </FormField>
            </div>
          </div>
        </SectionCard>

        {/* Why Donate */}
        <SectionCard title="Why Donate Section">
          <FormField label="Section Title">
            <TextInput
              value={form.why_donate_title}
              onChange={(v) => setField("why_donate_title", v)}
            />
          </FormField>
          <div className="space-y-5 mt-4">
            {([1, 2, 3, 4] as const).map((n) => {
              const iconKey = `why_donate_${n}_icon` as keyof SettingsForm;
              const textKey = `why_donate_${n}_text` as keyof SettingsForm;
              return (
                <div
                  key={n}
                  className="p-4 rounded-lg bg-gray-50 border border-gray-100 space-y-3"
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Card {n}
                  </p>
                  <FormField label="Icon">
                    <IconSelect
                      value={form[iconKey]}
                      onChange={(v) => setField(iconKey, v)}
                    />
                  </FormField>
                  <FormField label="Text">
                    <TextInput
                      value={form[textKey]}
                      onChange={(v) => setField(textKey, v)}
                    />
                  </FormField>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Footer */}
        <SectionCard title="Footer">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Footer Tagline">
              <TextInput
                value={form.footer_tagline}
                onChange={(v) => setField("footer_tagline", v)}
              />
            </FormField>
            <FormField label="Copyright Text">
              <TextInput
                value={form.footer_copyright}
                onChange={(v) => setField("footer_copyright", v)}
              />
            </FormField>
          </div>
        </SectionCard>

        {/* Messages */}
        <SectionCard title="Messages">
          <div className="space-y-4">
            <FormField label="Empty Search Result Message">
              <TextInput
                value={form.empty_state_message}
                onChange={(v) => setField("empty_state_message", v)}
              />
            </FormField>
            <FormField label="Donor Registration Success Message">
              <TextAreaInput
                value={form.donor_success_msg}
                onChange={(v) => setField("donor_success_msg", v)}
                rows={2}
              />
            </FormField>
            <FormField label="Blood Request Success Message">
              <TextAreaInput
                value={form.request_success_msg}
                onChange={(v) => setField("request_success_msg", v)}
                rows={2}
              />
            </FormField>
          </div>
        </SectionCard>

        {/* Field Labels */}
        <SectionCard title="Form Field Labels">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                ["field_fullname", "Full Name"],
                ["field_bloodgroup", "Blood Group"],
                ["field_district", "District"],
                ["field_upazila", "Upazila"],
                ["field_phone", "Phone Number"],
                ["field_lastdonation", "Last Donation Date"],
                ["field_gender", "Gender"],
                ["field_patientname", "Patient Name"],
                ["field_units", "Units (Bags)"],
                ["field_hospital", "Hospital Name"],
                ["field_contact", "Contact Number"],
                ["field_urgency", "Urgency"],
                ["field_note", "Additional Note"],
              ] as [keyof SettingsForm, string][]
            ).map(([key, label]) => (
              <FormField key={key} label={label}>
                <TextInput
                  value={form[key]}
                  onChange={(v) => setField(key, v)}
                />
              </FormField>
            ))}
          </div>
        </SectionCard>

        {/* Urgency Labels */}
        <SectionCard title="Urgency Level Labels">
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Critical">
              <TextInput
                value={form.urgency_critical}
                onChange={(v) => setField("urgency_critical", v)}
              />
            </FormField>
            <FormField label="Moderate">
              <TextInput
                value={form.urgency_moderate}
                onChange={(v) => setField("urgency_moderate", v)}
              />
            </FormField>
            <FormField label="Normal">
              <TextInput
                value={form.urgency_normal}
                onChange={(v) => setField("urgency_normal", v)}
              />
            </FormField>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <SaveButton
            onClick={() =>
              saveKeys(
                [
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
                ],
                "content"
              )
            }
            loading={savingSection === "content"}
          />
        </div>
      </div>
    );
  }

  function renderSocial() {
    return (
      <div className="space-y-6">
        <SectionCard title="Social & Contact Links">
          <div className="space-y-4">
            <FormField label="Facebook Page URL" hint="e.g. https://facebook.com/yourpage">
              <TextInput
                value={form.facebook_url}
                onChange={(v) => setField("facebook_url", v)}
                placeholder="https://facebook.com/"
                type="url"
              />
            </FormField>
            <FormField label="WhatsApp Group Link" hint="e.g. https://chat.whatsapp.com/...">
              <TextInput
                value={form.whatsapp_url}
                onChange={(v) => setField("whatsapp_url", v)}
                placeholder="https://chat.whatsapp.com/"
                type="url"
              />
            </FormField>
            <FormField label="Email Address">
              <TextInput
                value={form.email_address}
                onChange={(v) => setField("email_address", v)}
                placeholder="contact@example.com"
                type="email"
              />
            </FormField>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <SaveButton
            onClick={() =>
              saveKeys(["facebook_url", "whatsapp_url", "email_address"], "social")
            }
            loading={savingSection === "social"}
          />
        </div>
      </div>
    );
  }

  function renderSecurity() {
    return (
      <div className="space-y-6">
        <SectionCard title="Change Credentials">
          <p className="text-sm text-gray-500 -mt-2">
            Leave any field blank to keep the current value. Current password is always required to make changes.
          </p>

          <div className="space-y-4">
            <FormField label="New Username" hint="Leave blank to keep current username">
              <TextInput
                value={security.new_username}
                onChange={(v) => setSecurity((p) => ({ ...p, new_username: v }))}
                placeholder="New username"
              />
            </FormField>

            <FormField label="Current Password *">
              <TextInput
                value={security.current_password}
                onChange={(v) => setSecurity((p) => ({ ...p, current_password: v }))}
                placeholder="Enter current password"
                type="password"
              />
            </FormField>

            <FormField label="New Password" hint="Minimum 6 characters. Leave blank to keep current password.">
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={security.new_password}
                  onChange={(e) =>
                    setSecurity((p) => ({ ...p, new_password: e.target.value }))
                  }
                  placeholder="New password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>

            <FormField label="Confirm New Password">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={security.confirm_new_password}
                  onChange={(e) =>
                    setSecurity((p) => ({
                      ...p,
                      confirm_new_password: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <SaveButton
            onClick={handleSecuritySave}
            loading={savingSection === "security"}
          />
        </div>
      </div>
    );
  }

  function renderVisibility() {
    return (
      <div className="space-y-6">
        <SectionCard title="Section Visibility">
          <div className="divide-y divide-gray-100">
            <ToggleSwitch
              checked={boolStr(form.show_live_counters)}
              onChange={(v) => setField("show_live_counters", v ? "true" : "false")}
              label="Show Live Counters"
              description="Display donor count, fulfilled requests, and districts on the hero section"
            />
            <ToggleSwitch
              checked={boolStr(form.show_why_donate)}
              onChange={(v) => setField("show_why_donate", v ? "true" : "false")}
              label="Show Why Donate Section"
              description="Display the 4-card informational section about blood donation"
            />
            <ToggleSwitch
              checked={boolStr(form.show_dark_mode_toggle)}
              onChange={(v) => setField("show_dark_mode_toggle", v ? "true" : "false")}
              label="Show Dark Mode Toggle"
              description="Allow public visitors to switch between light and dark mode"
            />
          </div>
        </SectionCard>

        <SectionCard title="Donor Card Buttons">
          <div className="divide-y divide-gray-100">
            <ToggleSwitch
              checked={boolStr(form.show_call_btn)}
              onChange={(v) => setField("show_call_btn", v ? "true" : "false")}
              label="Show Call Button"
              description="Display a direct call button on each donor card"
            />
            <ToggleSwitch
              checked={boolStr(form.show_whatsapp_btn)}
              onChange={(v) => setField("show_whatsapp_btn", v ? "true" : "false")}
              label="Show WhatsApp Button"
              description="Display a WhatsApp button on each donor card"
            />
          </div>
        </SectionCard>

        <SectionCard title="Donor Settings">
          <div className="space-y-5">
            <FormField
              label="Availability Threshold (days)"
              hint="Donors who donated within this many days will show as 'Recently Donated'. Default: 90 days."
            >
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={form.availability_days}
                  onChange={(e) => setField("availability_days", e.target.value)}
                  className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                />
                <span className="text-sm text-gray-400">days</span>
              </div>
            </FormField>

            <div className="border-t border-gray-100 pt-4">
              <ToggleSwitch
                checked={boolStr(form.auto_approve)}
                onChange={(v) => setField("auto_approve", v ? "true" : "false")}
                label="Auto-Approve New Donors"
                description="When enabled, donor registrations are immediately approved without manual review"
              />
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <SaveButton
            onClick={() =>
              saveKeys(
                [
                  "show_live_counters",
                  "show_why_donate",
                  "show_dark_mode_toggle",
                  "show_whatsapp_btn",
                  "show_call_btn",
                  "availability_days",
                  "auto_approve",
                ],
                "visibility"
              )
            }
            loading={savingSection === "visibility"}
          />
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage all aspects of your site from one place
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <aside className="lg:w-52 flex-shrink-0">
            <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition w-full text-left ${
                    activeTab === tab.id
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {activeTab === "appearance" && renderAppearance()}
            {activeTab === "content" && renderContent()}
            {activeTab === "social" && renderSocial()}
            {activeTab === "security" && renderSecurity()}
            {activeTab === "visibility" && renderVisibility()}
          </main>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}