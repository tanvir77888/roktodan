// src/app/api/messenger/webhook/route.ts
// Roktho Bondhon Messenger bot — official Meta Graph API (free).
//
// Activation (admin, one-time):
//   1. Create a Meta app + connect the Facebook Page.
//   2. Save two settings (via SQL/settings): messenger_verify_token (any secret
//      string you choose) and messenger_page_token (the Page access token).
//   3. In the Meta app, set the webhook callback URL to
//      https://roktodan2.vercel.app/api/messenger/webhook with the same
//      verify token, and subscribe to `messages`.
// Until both settings exist the webhook stays inert (verification fails
// closed and incoming events are acknowledged without replies).

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSetting } from "@/lib/settings";

const BLOOD_GROUPS = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

// ── GET — webhook verification ─────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");
  const verifyToken = await getSetting("messenger_verify_token");

  if (mode === "subscribe" && verifyToken && token === verifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Verification failed", { status: 403 });
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function sendMessage(recipientId: string, text: string): Promise<void> {
  const pageToken = await getSetting("messenger_page_token");
  if (!pageToken) return;
  try {
    await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${pageToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    });
  } catch {
    /* best-effort */
  }
}

function detectBloodGroup(text: string): string | null {
  const upper = text.toUpperCase().replace(/\s+/g, "");
  for (const g of BLOOD_GROUPS) {
    if (upper.includes(g)) return g;
  }
  return null;
}

// ── POST — incoming messages ───────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const pageToken = await getSetting("messenger_page_token");
    if (!pageToken) {
      // Bot not activated yet — acknowledge so Meta does not retry/disable.
      return NextResponse.json({ success: true, inactive: true });
    }

    const body = (await request.json()) as {
      entry?: Array<{
        messaging?: Array<{
          sender?: { id?: string };
          message?: { text?: string };
        }>;
      }>;
    };

    for (const entry of body.entry ?? []) {
      for (const event of entry.messaging ?? []) {
        const senderId = event.sender?.id;
        const text = event.message?.text;
        if (!senderId || !text) continue;

        const group = detectBloodGroup(text);
        if (!group) {
          await sendMessage(
            senderId,
            "আসসালামু আলাইকুম! 🩸 কোন গ্রুপের রক্ত খুঁজছেন? গ্রুপটি লিখে পাঠান (যেমন: B+ বা O-) — কাছের ডোনারদের তথ্য পাঠিয়ে দিচ্ছি।\nওয়েবসাইট: https://roktodan2.vercel.app"
          );
          continue;
        }

        const donors = (await sql`
          SELECT full_name, district, upazila, phone FROM donors
          WHERE status = 'approved' AND blood_group = ${group}
          ORDER BY id DESC LIMIT 5
        `) as unknown as Array<{
          full_name: string;
          district: string;
          upazila: string;
          phone: string;
        }>;

        if (donors.length === 0) {
          await sendMessage(
            senderId,
            `দুঃখিত, এই মুহূর্তে ${group} গ্রুপের ডোনার তালিকায় নেই। ওয়েবসাইটে অনুরোধ পোস্ট করুন — এডমিন লাইভ বোর্ডে তুলে দেবেন: https://roktodan2.vercel.app`
          );
        } else {
          const lines = donors.map(
            (d, i) => `${i + 1}. ${d.full_name} — ${d.district}, ${d.upazila}\n📞 ${d.phone}`
          );
          await sendMessage(
            senderId,
            `${group} গ্রুপের ডোনারগণ:\n\n${lines.join("\n\n")}\n\nআরও ডোনার: https://roktodan2.vercel.app`
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/messenger/webhook]", error);
    // Always 200 so Meta does not retry storms
    return NextResponse.json({ success: true });
  }
}
