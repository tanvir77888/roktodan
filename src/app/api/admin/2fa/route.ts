// src/app/api/admin/2fa/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getSessionUsername,
  getTotpSecret,
  setTotpSecret,
  generateTotpSecret,
  verifyTotp,
  logAudit,
} from "@/lib/auth";

// Two-factor (TOTP) management.
//  POST { action: "status" }            -> { enabled }
//  POST { action: "setup" }             -> { secret, otpauth_url } (not yet active)
//  POST { action: "enable", secret, code } -> verifies code, saves secret
//  POST { action: "disable", code }     -> verifies code against current secret, clears it

export async function POST(request: NextRequest): Promise<NextResponse> {
  const me = await getSessionUsername();
  if (!me) {
    return NextResponse.json({ success: false, error: "Unauthorised" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as {
      action?: string;
      secret?: string;
      code?: string;
    };
    const action = body.action ?? "status";
    const current = await getTotpSecret();

    if (action === "status") {
      return NextResponse.json({ success: true, data: { enabled: !!current } });
    }

    if (action === "setup") {
      if (current) {
        return NextResponse.json(
          { success: false, error: "2FA ইতিমধ্যে চালু আছে। আগে বন্ধ করুন।" },
          { status: 400 }
        );
      }
      const secret = generateTotpSecret();
      const otpauthUrl = `otpauth://totp/RokthoBondhon:${encodeURIComponent(me)}?secret=${secret}&issuer=RokthoBondhon`;
      return NextResponse.json({ success: true, data: { secret, otpauth_url: otpauthUrl } });
    }

    if (action === "enable") {
      const secret = (body.secret ?? "").trim();
      const code = body.code ?? "";
      if (!secret || !verifyTotp(secret, code)) {
        return NextResponse.json(
          { success: false, error: "কোডটি মিলেনি। অ্যাপে সিক্রেটটি ঠিকমতো যোগ করে আবার চেষ্টা করুন।" },
          { status: 400 }
        );
      }
      await setTotpSecret(secret);
      await logAudit(me, "2fa_enable", "টু-ফ্যাক্টর (TOTP) চালু করা হয়েছে");
      return NextResponse.json({ success: true, data: { enabled: true } });
    }

    if (action === "disable") {
      if (!current) {
        return NextResponse.json({ success: true, data: { enabled: false } });
      }
      if (!verifyTotp(current, body.code ?? "")) {
        return NextResponse.json(
          { success: false, error: "কোডটি মিলেনি।" },
          { status: 400 }
        );
      }
      await setTotpSecret("");
      await logAudit(me, "2fa_disable", "টু-ফ্যাক্টর (TOTP) বন্ধ করা হয়েছে");
      return NextResponse.json({ success: true, data: { enabled: false } });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/admin/2fa]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
