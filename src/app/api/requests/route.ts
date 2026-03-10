// src/app/api/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql, neon } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

const db = neon(process.env.DATABASE_URL!);

const VALID_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const VALID_URGENCY = ["critical", "moderate", "normal"] as const;

async function isAdminRequest(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get("rb_session")?.value;
    if (!token) return false;
    const session = await verifyToken(token);
    return session !== null;
  } catch {
    return false;
  }
}

// ── GET /api/requests ──────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const isAdmin = await isAdminRequest(request);
    console.log("[GET /api/requests] isAdmin:", isAdmin, "cookie:", request.cookies.get("rb_session")?.value?.slice(0, 20));
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorised" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "";
    const bloodGroup = searchParams.get("bloodGroup") ?? "";
    const district = searchParams.get("district") ?? "";
    const urgency = searchParams.get("urgency") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const offset = (page - 1) * limit;

    // Build dynamic WHERE conditions
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (status && ["pending", "fulfilled", "rejected"].includes(status)) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    if (bloodGroup && (VALID_BLOOD_GROUPS as readonly string[]).includes(bloodGroup)) {
      conditions.push(`blood_group = $${paramIndex++}`);
      params.push(bloodGroup);
    }
    if (district) {
      conditions.push(`district = $${paramIndex++}`);
      params.push(district);
    }
    if (urgency && (VALID_URGENCY as readonly string[]).includes(urgency)) {
      conditions.push(`urgency = $${paramIndex++}`);
      params.push(urgency);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const orderClause = `
      ORDER BY
        CASE urgency
          WHEN 'critical' THEN 0
          WHEN 'moderate' THEN 1
          ELSE 2
        END ASC,
        created_at DESC
    `;

    // Count query
    const countQuery = `SELECT COUNT(*) AS total FROM blood_requests ${whereClause}`;
    const countRows = await db(countQuery, params as any[]) as Array<{ total: string }>;
    const total = parseInt(countRows[0]?.total ?? "0", 10);

    // Data query
    const dataParams = [...params, limit, offset];
    const dataQuery = `
      SELECT
        id, patient_name, blood_group, units, hospital_name,
        district, contact_number, urgency, additional_note,
        image_url, status, created_at
      FROM blood_requests
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const rows = await db(dataQuery, dataParams as any[]);
    const pages = Math.ceil(total / limit);

    console.log("[GET /api/requests] total:", total, "rows:", rows.length, "first row:", JSON.stringify(rows[0] ?? null));

    return NextResponse.json({
      success: true,
      data: {
        requests: rows,
        total,
        page,
        pages,
      },
    });
  } catch (error) {
    console.error("[GET /api/requests] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blood requests" },
      { status: 500 }
    );
  }
}

// ── POST /api/requests ─────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request body must be a JSON object" },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    // Required field presence check
    const requiredFields = [
      "patient_name",
      "blood_group",
      "units",
      "hospital_name",
      "district",
      "contact_number",
      "urgency",
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // patient_name
    const patientName = String(data.patient_name).trim();
    if (patientName.length < 2 || patientName.length > 200) {
      return NextResponse.json(
        { success: false, error: "Patient name must be between 2 and 200 characters" },
        { status: 400 }
      );
    }

    // blood_group
    const bloodGroup = String(data.blood_group).trim();
    if (!(VALID_BLOOD_GROUPS as readonly string[]).includes(bloodGroup)) {
      return NextResponse.json(
        { success: false, error: "Invalid blood group" },
        { status: 400 }
      );
    }

    // units
    const unitsRaw = Number(data.units);
    if (!Number.isInteger(unitsRaw) || unitsRaw < 1 || unitsRaw > 20) {
      return NextResponse.json(
        { success: false, error: "Units must be an integer between 1 and 20" },
        { status: 400 }
      );
    }
    const units = unitsRaw;

    // hospital_name
    const hospitalName = String(data.hospital_name).trim();
    if (hospitalName.length < 2 || hospitalName.length > 300) {
      return NextResponse.json(
        { success: false, error: "Hospital name must be between 2 and 300 characters" },
        { status: 400 }
      );
    }

    // district
    const district = String(data.district).trim();
    if (!district || district.length > 100) {
      return NextResponse.json(
        { success: false, error: "Invalid district" },
        { status: 400 }
      );
    }

    // contact_number
    const contactNumber = String(data.contact_number).trim();
    if (!contactNumber || contactNumber.length > 20) {
      return NextResponse.json(
        { success: false, error: "Invalid contact number" },
        { status: 400 }
      );
    }

    // urgency
    const urgency = String(data.urgency).trim();
    if (!(VALID_URGENCY as readonly string[]).includes(urgency)) {
      return NextResponse.json(
        { success: false, error: "Urgency must be one of: critical, moderate, normal" },
        { status: 400 }
      );
    }

    // additional_note (optional)
    const additionalNote = data.additional_note
      ? String(data.additional_note).trim().slice(0, 1000)
      : null;

    // image_url (optional)
    const imageUrl =
      data.image_url && typeof data.image_url === "string" && data.image_url.startsWith("http")
        ? data.image_url.trim()
        : null;

    const result = await sql`
      INSERT INTO blood_requests (
        patient_name,
        blood_group,
        units,
        hospital_name,
        district,
        contact_number,
        urgency,
        additional_note,
        image_url,
        status
      ) VALUES (
        ${patientName},
        ${bloodGroup},
        ${units},
        ${hospitalName},
        ${district},
        ${contactNumber},
        ${urgency},
        ${additionalNote},
        ${imageUrl},
        'pending'
      )
      RETURNING id
    `;

    const insertedId = result[0]?.id as number;

    return NextResponse.json(
      { success: true, data: { id: insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/requests] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit blood request" },
      { status: 500 }
    );
  }
}