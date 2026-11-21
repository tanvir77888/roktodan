// src/app/api/donors/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// ── POST /api/donors/report — report a fake/wrong donor number ─────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { donor_id?: unknown };
    const donorId = typeof body.donor_id === "number" ? body.donor_id : NaN;
    if (!donorId || donorId <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid donor_id" },
        { status: 400 }
      );
    }
    const donors = await sql`SELECT id FROM donors WHERE id = ${donorId} LIMIT 1`;
    if (donors.length === 0) {
      return NextResponse.json(
        { success: false, error: "Donor not found" },
        { status: 404 }
      );
    }
    await sql`INSERT INTO donor_reports (donor_id) VALUES (${donorId})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/donors/report]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save report" },
      { status: 500 }
    );
  }
}
