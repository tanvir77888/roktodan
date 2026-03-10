// src/app/api/requests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

const ALLOWED_STATUSES = ["fulfilled", "rejected"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("rb_session")?.value;
  if (!token) return false;
  const session = await verifyToken(token);
  return session !== null;
}

function parseId(idParam: string): number | null {
  const id = parseInt(idParam, 10);
  if (isNaN(id) || id <= 0 || String(id) !== idParam) return null;
  return id;
}

// ── PATCH /api/requests/[id] ───────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorised" },
        { status: 401 }
      );
    }

    const { id: idParam } = await context.params;
    const id = parseId(idParam);
    if (id === null) {
      return NextResponse.json(
        { success: false, error: "Invalid request ID" },
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

    if (
      typeof body !== "object" ||
      body === null ||
      !("status" in body)
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required field: status" },
        { status: 400 }
      );
    }

    const { status } = body as Record<string, unknown>;

    if (
      typeof status !== "string" ||
      !ALLOWED_STATUSES.includes(status as AllowedStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const rows = await sql`
      UPDATE blood_requests
      SET status = ${status}
      WHERE id = ${id}
      RETURNING
        id,
        patient_name,
        blood_group,
        units,
        hospital_name,
        district,
        contact_number,
        urgency,
        additional_note,
        image_url,
        status,
        created_at
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blood request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/requests/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/requests/[id] ──────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorised" },
        { status: 401 }
      );
    }

    const { id: idParam } = await context.params;
    const id = parseId(idParam);
    if (id === null) {
      return NextResponse.json(
        { success: false, error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const rows = await sql`
      DELETE FROM blood_requests
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blood request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/requests/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}