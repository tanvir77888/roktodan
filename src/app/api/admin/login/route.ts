// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminLogin,
  signToken,
  getTotpSecret,
  verifyTotp,
  logAudit,
} from "@/lib/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Username and password required" },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      typeof (body as Record<string, unknown>).username !== "string" ||
      typeof (body as Record<string, unknown>).password !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "Username and password required" },
        { status: 400 }
      );
    }

    const { username, password, totp } = body as {
      username: string;
      password: string;
      totp?: string;
    };

    if (!username.trim() || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password required" },
        { status: 400 }
      );
    }

    const result = await verifyAdminLogin(username, password);

    if (!result.ok) {
      await new Promise((r) => setTimeout(r, 200));
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ── Two-factor gate (only when the admin has enabled TOTP) ──────────
    const totpSecret = await getTotpSecret();
    if (totpSecret) {
      if (!totp) {
        return NextResponse.json(
          { success: false, needs_totp: true, error: "Authenticator code required" },
          { status: 401 }
        );
      }
      if (!verifyTotp(totpSecret, totp)) {
        await new Promise((r) => setTimeout(r, 200));
        return NextResponse.json(
          { success: false, needs_totp: true, error: "Invalid authenticator code" },
          { status: 401 }
        );
      }
    }

    await logAudit(result.username, "login", "এডমিন প্যানেলে লগইন");

    const token = await signToken({ username: result.username, iat: Date.now() });

    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("rb_session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600,
      secure: isProduction,
    });

    return response;
  } catch (err) {
    console.error("[POST /api/admin/login] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}