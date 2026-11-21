// src/app/api/admin/reports/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUsername } from "@/lib/auth";

// ── GET /api/admin/reports — donors with fake-number reports ───────────────

export async function GET(): Promise<NextResponse> {
  const me = await getSessionUsername();
  if (!me) {
    return NextResponse.json({ success: false, error: "Unauthorised" }, { status: 401 });
  }
  try {
    const rows = await sql`
      SELECT d.id, d.full_name, d.blood_group, d.district, d.phone, d.status,
             COUNT(r.id)::int AS report_count,
             MAX(r.created_at) AS last_reported_at
      FROM donor_reports r
      JOIN donors d ON d.id = r.donor_id
      GROUP BY d.id
      ORDER BY report_count DESC, last_reported_at DESC
      LIMIT 50
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
