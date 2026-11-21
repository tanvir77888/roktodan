// src/app/api/push/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSetting } from "@/lib/settings";

// GET — the VAPID public key the browser needs to subscribe
export async function GET(): Promise<NextResponse> {
  const publicKey = await getSetting("vapid_public");
  return NextResponse.json({ success: true, data: { publicKey } });
}

// POST — save a browser push subscription
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as {
      endpoint?: string;
      keys?: { p256dh?: string; auth?: string };
    };
    if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      return NextResponse.json(
        { success: false, error: "Invalid subscription" },
        { status: 400 }
      );
    }
    await sql`
      INSERT INTO push_subscriptions (endpoint, p256dh, auth)
      VALUES (${body.endpoint}, ${body.keys.p256dh}, ${body.keys.auth})
      ON CONFLICT (endpoint) DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/push/subscribe]", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

// DELETE — remove a subscription
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { endpoint?: string };
    if (body.endpoint) {
      await sql`DELETE FROM push_subscriptions WHERE endpoint = ${body.endpoint}`;
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
