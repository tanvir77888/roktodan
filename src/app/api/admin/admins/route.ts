// src/app/api/admin/admins/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  getSessionUsername,
  hashPassword,
  logAudit,
} from "@/lib/auth";

async function requireAdmin(): Promise<string | null> {
  return getSessionUsername();
}

// ── GET /api/admin/admins — list extra admin accounts ─────────────────────

export async function GET(): Promise<NextResponse> {
  const me = await requireAdmin();
  if (!me) {
    return NextResponse.json({ success: false, error: "Unauthorised" }, { status: 401 });
  }
  try {
    const rows = await sql`
      SELECT id, username, created_at FROM admin_users ORDER BY id ASC
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

// ── POST /api/admin/admins — create an extra admin account ────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const me = await requireAdmin();
  if (!me) {
    return NextResponse.json({ success: false, error: "Unauthorised" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = (body.username ?? "").trim();
    const password = body.password ?? "";
    if (username.length < 3 || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "ইউজারনেম কমপক্ষে ৩ অক্ষর ও পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }
    const existing = await sql`
      SELECT id FROM admin_users WHERE LOWER(username) = ${username.toLowerCase()} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "এই ইউজারনেমে ইতিমধ্যে একজন এডমিন আছেন।" },
        { status: 409 }
      );
    }
    const passwordHash = await hashPassword(password);
    const rows = await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES (${username}, ${passwordHash})
      RETURNING id, username, created_at
    `;
    await logAudit(me, "admin_create", `নতুন এডমিন যোগ: ${username}`);
    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/admins]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// ── DELETE /api/admin/admins?id= — remove an extra admin account ──────────

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const me = await requireAdmin();
  if (!me) {
    return NextResponse.json({ success: false, error: "Unauthorised" }, { status: 401 });
  }
  const id = parseInt(request.nextUrl.searchParams.get("id") ?? "", 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
  }
  try {
    const rows = await sql`
      DELETE FROM admin_users WHERE id = ${id} RETURNING username
    `;
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    await logAudit(me, "admin_delete", `এডমিন মুছে ফেলা: ${rows[0].username as string}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/admins]", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
