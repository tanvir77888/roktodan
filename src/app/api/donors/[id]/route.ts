// src/app/api/donors/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// ── Auth helper ────────────────────────────────────────────────────────────

async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("rb_session")?.value;
  if (!token) return false;
  const session = await verifyToken(token);
  return session !== null;
}

// ── ID validation helper ───────────────────────────────────────────────────

function parseId(params: { id: string }): number | null {
  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0 || String(id) !== params.id) return null;
  return id;
}

// ── PATCH /api/donors/[id] ─────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const id = parseId(params);
    if (id === null) {
      return NextResponse.json(
        { success: false, error: "Invalid donor ID" },
        { status: 400 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { status } = body as Record<string, unknown>;

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json(
        {
          success: false,
          error: "status must be 'approved' or 'rejected'",
        },
        { status: 400 }
      );
    }

    const rows = await sql`
      UPDATE donors
      SET status = ${status}
      WHERE id = ${id}
      RETURNING
        id,
        full_name,
        blood_group,
        district,
        upazila,
        phone,
        last_donation_date,
        gender,
        status,
        image_url,
        created_at
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Donor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/donors/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/donors/[id] ────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const id = parseId(params);
    if (id === null) {
      return NextResponse.json(
        { success: false, error: "Invalid donor ID" },
        { status: 400 }
      );
    }

    const rows = await sql`
      DELETE FROM donors
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Donor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/donors/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}