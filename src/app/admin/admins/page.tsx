// src/app/admin/admins/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, UserPlus, Trash2, ScrollText, KeyRound } from "lucide-react";

interface ExtraAdmin {
  id: number;
  username: string;
  created_at: string;
}

interface AuditEntry {
  id: number;
  admin_username: string;
  action: string;
  details: string | null;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  login: "লগইন",
  donor_status: "ডোনার স্ট্যাটাস বদল",
  donor_delete: "ডোনার মোছা",
  request_status: "অনুরোধ স্ট্যাটাস বদল",
  settings_update: "সেটিংস বদল",
  admin_create: "নতুন এডমিন",
  admin_delete: "এডমিন মোছা",
  "2fa_enable": "2FA চালু",
  "2fa_disable": "2FA বন্ধ",
};

export default function AdminAdminsPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── Extra admins ──────────────────────────────────────────────────────────
  const [admins, setAdmins] = useState<ExtraAdmin[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);

  // ── 2FA ───────────────────────────────────────────────────────────────────
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [setupSecret, setSetupSecret] = useState("");
  const [setupUrl, setSetupUrl] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [totpBusy, setTotpBusy] = useState(false);

  // ── Audit ─────────────────────────────────────────────────────────────────
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  const loadAll = useCallback(async () => {
    try {
      const [a, u, t] = await Promise.all([
        fetch("/api/admin/admins", { credentials: "include" }).then((r) => r.json()),
        fetch("/api/admin/audit", { credentials: "include" }).then((r) => r.json()),
        fetch("/api/admin/2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "status" }),
          credentials: "include",
        }).then((r) => r.json()),
      ]);
      setAdmins(a.data ?? []);
      setAudit(u.data ?? []);
      setTotpEnabled(!!t.data?.enabled);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAddingAdmin(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "ব্যর্থ হয়েছে");
      showToast(`এডমিন "${newUsername}" যোগ হয়েছে`);
      setNewUsername("");
      setNewPassword("");
      await loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "ব্যর্থ হয়েছে", "error");
    } finally {
      setAddingAdmin(false);
    }
  }

  async function handleDeleteAdmin(id: number, username: string) {
    if (!window.confirm(`এডমিন "${username}"-কে মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch(`/api/admin/admins?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "ব্যর্থ হয়েছে");
      showToast("এডমিন মোছা হয়েছে");
      await loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "ব্যর্থ হয়েছে", "error");
    }
  }

  async function handleSetupTotp() {
    setTotpBusy(true);
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup" }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "ব্যর্থ হয়েছে");
      setSetupSecret(data.data.secret);
      setSetupUrl(data.data.otpauth_url);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "ব্যর্থ হয়েছে", "error");
    } finally {
      setTotpBusy(false);
    }
  }

  async function handleEnableTotp() {
    setTotpBusy(true);
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enable", secret: setupSecret, code: totpCode }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "ব্যর্থ হয়েছে");
      showToast("টু-ফ্যাক্টর চালু হয়েছে ✅ এখন থেকে লগইনে কোড লাগবে");
      setSetupSecret("");
      setSetupUrl("");
      setTotpCode("");
      await loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "ব্যর্থ হয়েছে", "error");
    } finally {
      setTotpBusy(false);
    }
  }

  async function handleDisableTotp() {
    setTotpBusy(true);
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable", code: disableCode }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "ব্যর্থ হয়েছে");
      showToast("টু-ফ্যাক্টর বন্ধ হয়েছে");
      setDisableCode("");
      await loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "ব্যর্থ হয়েছে", "error");
    } finally {
      setTotpBusy(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">এডমিন ও নিরাপত্তা</h1>
        <p className="text-sm text-gray-500 mt-1">
          অতিরিক্ত এডমিন অ্যাকাউন্ট, টু-ফ্যাক্টর সুরক্ষা এবং কে কী করেছে তার হিসাব (অডিট লগ)।
        </p>
      </div>

      {/* ── 2FA ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
          <ShieldCheck size={18} className="text-green-600" /> টু-ফ্যাক্টর সুরক্ষা (2FA)
        </h2>
        {totpEnabled ? (
          <div>
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3">
              ✅ 2FA চালু আছে — লগইনের সময় Authenticator অ্যাপের কোড লাগবে।
            </p>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
                placeholder="বন্ধ করতে বর্তমান কোড দিন"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <button
                onClick={handleDisableTotp}
                disabled={totpBusy || disableCode.length !== 6}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        ) : setupSecret ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              আপনার ফোনে Google Authenticator / Microsoft Authenticator অ্যাপে নিচের সিক্রেটটি
              <strong> হাতে লিখে (manual entry)</strong> যোগ করুন, তারপর অ্যাপে দেখানো ৬ সংখ্যার কোড দিয়ে চালু করুন:
            </p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-lg">
              <KeyRound size={16} className="text-gray-400 shrink-0" />
              <code className="text-sm font-mono break-all">{setupSecret}</code>
            </div>
            <p className="text-xs text-gray-400 break-all max-w-lg">{setupUrl}</p>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="অ্যাপের কোড দিন"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm tracking-[0.3em] text-center"
              />
              <button
                onClick={handleEnableTotp}
                disabled={totpBusy || totpCode.length !== 6}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                চালু করুন
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              চালু করলে পাসওয়ার্ডের পাশাপাশি ফোনের Authenticator অ্যাপের কোড ছাড়া কেউ এডমিন প্যানেলে ঢুকতে পারবে না।
            </p>
            <button
              onClick={handleSetupTotp}
              disabled={totpBusy}
              className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg disabled:opacity-50"
            >
              2FA চালু করুন
            </button>
          </div>
        )}
      </div>

      {/* ── Extra admins ────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
          <UserPlus size={18} className="text-blue-600" /> অতিরিক্ত এডমিন
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          মূল এডমিন (সেটিংসের ইউজারনেম) ছাড়াও আরও এডমিন যোগ করা যায়। প্রত্যেকের কাজ অডিট লগে থেকে যাবে।
        </p>
        <form onSubmit={handleAddAdmin} className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="নতুন ইউজারনেম"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            type="submit"
            disabled={addingAdmin || newUsername.trim().length < 3 || newPassword.length < 6}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg disabled:opacity-50"
          >
            {addingAdmin ? "যোগ হচ্ছে..." : "এডমিন যোগ করুন"}
          </button>
        </form>
        {admins.length === 0 ? (
          <p className="text-sm text-gray-400">এখনো কোনো অতিরিক্ত এডমিন নেই।</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {admins.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-800">
                  {a.username}
                  <span className="text-gray-400 font-normal">
                    {" "}
                    · যোগ হয়েছে {new Date(a.created_at).toLocaleDateString("bn-BD")}
                  </span>
                </span>
                <button
                  onClick={() => handleDeleteAdmin(a.id, a.username)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100"
                >
                  <Trash2 size={12} /> মুছুন
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Audit log ───────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
          <ScrollText size={18} className="text-amber-600" /> অডিট লগ (সর্বশেষ ১০০টি কাজ)
        </h2>
        {audit.length === 0 ? (
          <p className="text-sm text-gray-400">এখনো কোনো লগ নেই।</p>
        ) : (
          <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
            {audit.map((entry) => (
              <div key={entry.id} className="py-2 flex flex-wrap items-baseline gap-x-3 text-sm">
                <span className="font-semibold text-gray-800">{entry.admin_username}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </span>
                {entry.details && <span className="text-gray-500">{entry.details}</span>}
                <span className="text-gray-400 text-xs ml-auto">
                  {new Date(entry.created_at).toLocaleString("bn-BD")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
