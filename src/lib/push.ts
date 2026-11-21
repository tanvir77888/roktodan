// src/lib/push.ts
// Web Push sender — RFC 8291 (aes128gcm) + VAPID (RFC 8292), no extra deps.
// Keys are generated once in runMigration() and stored in the settings table
// (private key under the admin_ prefix, never exposed via the public API).

import * as crypto from "crypto";
import { SignJWT, importJWK } from "jose";
import { sql } from "@/lib/db";
import { getSetting } from "@/lib/settings";

export interface PushSubscriptionRow {
  id: number;
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface VapidKeys {
  publicKey: string;
  privateJwk: { kty: string; crv: string; x: string; y: string; d: string };
}

async function getVapidKeys(): Promise<VapidKeys | null> {
  const [pub, d, x, y] = await Promise.all([
    getSetting("vapid_public"),
    getSetting("admin_vapid_private"),
    getSetting("admin_vapid_pub_x"),
    getSetting("admin_vapid_pub_y"),
  ]);
  if (!pub || !d || !x || !y) return null;
  return {
    publicKey: pub,
    privateJwk: { kty: "EC", crv: "P-256", x, y, d },
  };
}

async function vapidAuthorization(endpoint: string, keys: VapidKeys): Promise<string> {
  const key = await importJWK(keys.privateJwk, "ES256");
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256", typ: "JWT" })
    .setAudience(new URL(endpoint).origin)
    .setSubject("mailto:admin@roktodan2.vercel.app")
    .setExpirationTime("12h")
    .sign(key);
  return `vapid t=${jwt}, k=${keys.publicKey}`;
}

function encryptPayload(sub: PushSubscriptionRow, payload: string): Buffer {
  const uaPublic = Buffer.from(sub.p256dh, "base64url");
  const authSecret = Buffer.from(sub.auth, "base64url");

  const ecdh = crypto.createECDH("prime256v1");
  ecdh.generateKeys();
  const asPublic = ecdh.getPublicKey();
  const sharedSecret = ecdh.computeSecret(uaPublic);

  const salt = crypto.randomBytes(16);

  // RFC 8291 §3.3/§3.4 key derivation
  const keyInfo = Buffer.concat([
    Buffer.from("WebPush: info\0", "utf8"),
    uaPublic,
    asPublic,
  ]);
  const ikm = Buffer.from(crypto.hkdfSync("sha256", sharedSecret, authSecret, keyInfo, 32));
  const cek = Buffer.from(
    crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: aes128gcm\0", "utf8"), 16)
  );
  const nonce = Buffer.from(
    crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: nonce\0", "utf8"), 12)
  );

  // Single record: payload + 0x02 (final record delimiter)
  const plaintext = Buffer.concat([Buffer.from(payload, "utf8"), Buffer.from([2])]);
  const cipher = crypto.createCipheriv("aes-128-gcm", cek, nonce);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);

  const rs = Buffer.alloc(4);
  rs.writeUInt32BE(4096, 0);
  const header = Buffer.concat([salt, rs, Buffer.from([asPublic.length]), asPublic]);
  return Buffer.concat([header, ciphertext]);
}

export async function sendPush(
  sub: PushSubscriptionRow,
  payloadObj: Record<string, string>
): Promise<boolean> {
  const keys = await getVapidKeys();
  if (!keys) return false;
  try {
    const body = encryptPayload(sub, JSON.stringify(payloadObj));
    const authorization = await vapidAuthorization(sub.endpoint, keys);
    const res = await fetch(sub.endpoint, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Encoding": "aes128gcm",
        "Content-Type": "application/octet-stream",
        TTL: "3600",
        Urgency: "high",
      },
      body: new Uint8Array(body),
    });
    if (res.status === 404 || res.status === 410) {
      await sql`DELETE FROM push_subscriptions WHERE id = ${sub.id}`;
      return false;
    }
    return res.status >= 200 && res.status < 300;
  } catch {
    return false;
  }
}

export async function sendPushToAll(payloadObj: Record<string, string>): Promise<void> {
  try {
    const subs = (await sql`
      SELECT id, endpoint, p256dh, auth FROM push_subscriptions ORDER BY id ASC LIMIT 500
    `) as unknown as PushSubscriptionRow[];
    for (const sub of subs) {
      await sendPush(sub, payloadObj);
    }
  } catch {
    /* push must never break the main flow */
  }
}
