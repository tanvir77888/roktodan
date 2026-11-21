// src/lib/auth.ts
import * as crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { sql } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────────────────

export interface AdminSession {
  username: string;
  iat: number;
}

// ── JWT ────────────────────────────────────────────────────────────────────

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET environment variable must be set and at least 32 characters long."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: AdminSession): Promise<string> {
  return await new SignJWT({ username: payload.username, iat: payload.iat })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (
      typeof payload.username !== "string" ||
      typeof payload.iat !== "number"
    ) {
      return null;
    }
    return { username: payload.username, iat: payload.iat };
  } catch {
    return null;
  }
}

// ── Password hashing (scrypt via Node crypto) ──────────────────────────────
// Storage format: '<hex-salt>:<hex-hash>'  (64-byte key → 128 hex chars)

const SCRYPT_KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, SCRYPT_KEYLEN)
    .toString("hex");
  return `${salt}:${hash}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const parts = storedHash.split(":");
    if (parts.length !== 2) return false;
    const [salt, expectedHex] = parts;
    if (!salt || !expectedHex) return false;

    const expected = Buffer.from(expectedHex, "hex");
    const actual = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);

    if (actual.length !== expected.length) return false;
    return crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// ── Admin credential retrieval ─────────────────────────────────────────────

export async function getAdminCredentials(): Promise<{
  username: string;
  passwordHash: string;
}> {
  const rows = await sql`
    SELECT key, value FROM settings
    WHERE key IN ('admin_username', 'admin_password_hash')
  `;

  let username = "admin";
  let passwordHash = "";

  for (const row of rows) {
    if (row.key === "admin_username") username = row.value ?? "admin";
    if (row.key === "admin_password_hash") passwordHash = row.value ?? "";
  }

  // First-run bootstrap: if no password hash has been set yet (empty string
  // from the migration seed), hash the default password 'admin123' and
  // persist it so subsequent logins work without a manual step.
  if (!passwordHash) {
    passwordHash = await hashPassword("admin123");
    await sql`
      UPDATE settings SET value = ${passwordHash}
      WHERE key = 'admin_password_hash'
    `;
  }

  return { username, passwordHash };
}
// ── Multi-admin login (admin_users table, settings admin as fallback) ─────

export async function verifyAdminLogin(
  username: string,
  password: string
): Promise<{ ok: boolean; username: string }> {
  const uname = username.trim().toLowerCase();
  try {
    const rows = await sql`
      SELECT username, password_hash FROM admin_users
      WHERE LOWER(username) = ${uname}
      LIMIT 1
    `;
    if (rows.length > 0) {
      const match = await verifyPassword(password, rows[0].password_hash as string);
      return { ok: match, username: rows[0].username as string };
    }
  } catch {
    /* admin_users table may not exist yet — fall through to main admin */
  }
  const credentials = await getAdminCredentials();
  const usernameMatch = credentials.username.toLowerCase() === uname;
  const passwordMatch = await verifyPassword(password, credentials.passwordHash);
  return { ok: usernameMatch && passwordMatch, username: credentials.username };
}

// ── Audit log ──────────────────────────────────────────────────────────────

export async function logAudit(
  adminUsername: string,
  action: string,
  details?: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO audit_log (admin_username, action, details)
      VALUES (${adminUsername}, ${action}, ${details ?? null})
    `;
  } catch {
    /* audit must never break the main operation */
  }
}

export async function getSessionUsername(): Promise<string | null> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("rb_session")?.value;
    if (!token) return null;
    const session = await verifyToken(token);
    return session?.username ?? null;
  } catch {
    return null;
  }
}

// ── TOTP two-factor (RFC 6238, authenticator apps) ─────────────────────────
// Secret is base32, stored in settings key 'admin_totp_secret' (the admin_
// prefix keeps it out of the public settings response).

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateTotpSecret(): string {
  const bytes = crypto.randomBytes(20);
  let out = "";
  let bits = 0;
  let value = 0;
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(secret: string): Buffer {
  const clean = secret.replace(/[\s=]/g, "").toUpperCase();
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const ch of clean) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

function totpCode(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const msg = Buffer.alloc(8);
  msg.writeBigInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha1", key).update(msg).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(binary % 1_000_000).padStart(6, "0");
}

export function verifyTotp(secret: string, code: string): boolean {
  const clean = code.replace(/\D/g, "");
  if (clean.length !== 6 || !secret) return false;
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (const drift of [-1, 0, 1]) {
    const expected = totpCode(secret, counter + drift);
    const a = Buffer.from(expected);
    const b = Buffer.from(clean);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
  }
  return false;
}

export async function getTotpSecret(): Promise<string> {
  try {
    const rows = await sql`
      SELECT value FROM settings WHERE key = 'admin_totp_secret' LIMIT 1
    `;
    return (rows[0]?.value as string) ?? "";
  } catch {
    return "";
  }
}

export async function setTotpSecret(secret: string): Promise<void> {
  await sql`
    INSERT INTO settings (key, value) VALUES ('admin_totp_secret', ${secret})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}
