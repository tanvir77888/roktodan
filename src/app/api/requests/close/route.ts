// src/app/api/requests/close/route.ts
// Public endpoint: the requester closes their own blood request via the
// secret close_token link they received when submitting the request.
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);
    const token = body && typeof body === "object" ? String((body as Record<string, unknown>).token ?? "") : "";
    if (!token || token.length < 10) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 400 });
    }

    const rows = await sql`
      UPDATE blood_requests
      SET status = 'fulfilled'
      WHERE close_token = ${token} AND status IN ('pending', 'approved')
      RETURNING id, patient_name
    `;

    if (rows.length === 0) {
      const existing = await sql`
        SELECT id, status FROM blood_requests WHERE close_token = ${token} LIMIT 1
      `;
      if (existing.length > 0) {
        return NextResponse.json({ success: true, data: { alreadyClosed: true } });
      }
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id: rows[0].id, closed: true } });
  } catch (error) {
    console.error("[POST /api/requests/close] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to close request" }, { status: 500 });
  }
}
