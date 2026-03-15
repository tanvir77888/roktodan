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