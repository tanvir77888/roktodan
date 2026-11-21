// src/app/api/admin/audit/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUsername } from "@/lib/auth";

// ── GET /api/admin/audit — latest admin activity ───────────────────────────

export async function GET(): Promise<NextResponse> {
  const me = await getSessionUsername();
  if (!me) {
    return NextResponse.json({ success: false, error: "Unauthorised" }, { status: 401 });
  }
  try {
    const rows = await sql`
      SELECT id, admin_username, action, details, created_at
      FROM audit_log
      ORDER BY id DESC
      LIMIT 100
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
