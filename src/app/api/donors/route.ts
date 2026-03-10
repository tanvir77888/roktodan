// src/app/api/donors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql, neon } from "@/lib/db";
import { getSetting } from "@/lib/settings";
import { verifyToken } from "@/lib/auth";

const db = neon(process.env.DATABASE_URL!);

const ALLOWED_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

// ── Auth detection ─────────────────────────────────────────────────────────

async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("rb_session")?.value;
  if (!token) return false;
  const session = await verifyToken(token);
  return session !== null;
}

// ── GET /api/donors ────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    const isAdmin = await isAdminRequest(request);

    // Parse query params
    const bloodGroup = searchParams.get("bloodGroup") ?? "";
    const district = searchParams.get("district") ?? "";
    const upazila = searchParams.get("upazila") ?? "";
    const search = searchParams.get("search") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const defaultLimit = isAdmin ? 20 : 12;
    const limit = Math.min(
      9999,
      Math.max(1, parseInt(searchParams.get("limit") ?? String(defaultLimit), 10))
    );
    const offset = (page - 1) * limit;

    // Status: public always gets approved; admin can filter freely
    let status = searchParams.get("status") ?? "";
    if (!isAdmin) {
      status = "approved";
    }

    // ── Build dynamic WHERE clauses ──────────────────────────────────────
    // We accumulate conditions and params, then build the final query.
    // @neondatabase/serverless tagged templates don't support dynamic
    // composition natively, so we fall back to a parameterised raw string
    // approach using the neon client's query method via the sql tag with
    // an explicit unsafe template. Instead we use a safe builder pattern:
    // collect all values in an array and build a plain parameterised string.

    // We need to use the neon client directly for dynamic queries.
    // The sql tagged template from @neondatabase/serverless supports
    // raw parameterised queries via sql.query(text, params).
    // However, the exported `sql` is the tagged template. We can use
    // it with a trick: build the query as a string with $N placeholders
    // and pass params as an array using the underlying neon function.

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (status) {
      conditions.push(`status = $${paramIdx++}`);
      params.push(status);
    }

    if (bloodGroup && ALLOWED_BLOOD_GROUPS.includes(bloodGroup as typeof ALLOWED_BLOOD_GROUPS[number])) {
      conditions.push(`blood_group = $${paramIdx++}`);
      params.push(bloodGroup);
    }

    if (district) {
      conditions.push(`district = $${paramIdx++}`);
      params.push(district);
    }

    if (upazila) {
      conditions.push(`upazila = $${paramIdx++}`);
      params.push(upazila);
    }

    if (search) {
      conditions.push(`(full_name ILIKE $${paramIdx} OR phone ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count query
    const countText = `SELECT COUNT(*) as total FROM donors ${whereClause}`;
    const countRows = await db(countText, params as any[]) as Array<{ total: string }>;
    const total = parseInt(countRows[0]?.total ?? "0", 10);

    // Data query
    const dataParams = [...params, limit, offset];
    const dataText = `
      SELECT
        id, full_name, blood_group, district, upazila,
        phone, last_donation_date, gender, status, image_url, created_at
      FROM donors
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;

    const donors = await db(dataText, dataParams as any[]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        donors,
        total,
        page,
        pages,
      },
    });
  } catch (error) {
    console.error("[GET /api/donors] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donors." },
      { status: 500 }
    );
  }
}

// ── POST /api/donors ───────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const {
      full_name,
      blood_group,
      district,
      upazila,
      phone,
      last_donation_date,
      gender,
      image_url,
    } = body as Record<string, unknown>;

    // ── Required field validation ──────────────────────────────────────────

    if (!full_name || typeof full_name !== "string" || !full_name.trim()) {
      return NextResponse.json(
        { success: false, error: "Full name is required." },
        { status: 400 }
      );
    }

    if (!blood_group || typeof blood_group !== "string") {
      return NextResponse.json(
        { success: false, error: "Blood group is required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_BLOOD_GROUPS.includes(blood_group as typeof ALLOWED_BLOOD_GROUPS[number])) {
      return NextResponse.json(
        { success: false, error: `Invalid blood group. Must be one of: ${ALLOWED_BLOOD_GROUPS.join(", ")}.` },
        { status: 400 }
      );
    }

    if (!district || typeof district !== "string" || !district.trim()) {
      return NextResponse.json(
        { success: false, error: "District is required." },
        { status: 400 }
      );
    }

    if (!upazila || typeof upazila !== "string" || !upazila.trim()) {
      return NextResponse.json(
        { success: false, error: "Upazila is required." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }

    // ── Phone normalisation ────────────────────────────────────────────────
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length !== 11) {
      return NextResponse.json(
        { success: false, error: "Phone number must be 11 digits (Bangladesh format)." },
        { status: 400 }
      );
    }

    // ── Optional field validation ──────────────────────────────────────────
    let normalizedLastDonation: string | null = null;
    if (last_donation_date !== undefined && last_donation_date !== null && last_donation_date !== "") {
      if (typeof last_donation_date !== "string") {
        return NextResponse.json(
          { success: false, error: "Invalid last donation date format." },
          { status: 400 }
        );
      }
      const parsed = new Date(last_donation_date);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json(
          { success: false, error: "Invalid last donation date." },
          { status: 400 }
        );
      }
      normalizedLastDonation = last_donation_date;
    }

    let normalizedGender: string | null = null;
    if (gender !== undefined && gender !== null && gender !== "") {
      if (typeof gender !== "string" || !["male", "female", "other"].includes(gender)) {
        return NextResponse.json(
          { success: false, error: "Invalid gender. Must be male, female, or other." },
          { status: 400 }
        );
      }
      normalizedGender = gender;
    }

    // ── Auto-approve check ─────────────────────────────────────────────────
    const autoApprove = await getSetting("auto_approve");
    const status = autoApprove === "true" ? "approved" : "pending";

    // ── Optional image_url ─────────────────────────────────────────────────
    const normalizedImageUrl: string | null =
      image_url !== undefined &&
      image_url !== null &&
      image_url !== "" &&
      typeof image_url === "string" &&
      image_url.startsWith("http")
        ? image_url.trim()
        : null;

    // ── Insert ─────────────────────────────────────────────────────────────
    const rows = await sql`
      INSERT INTO donors
        (full_name, blood_group, district, upazila, phone, last_donation_date, gender, status, image_url)
      VALUES
        (${full_name.trim()}, ${blood_group}, ${district.trim()}, ${upazila.trim()},
         ${digitsOnly}, ${normalizedLastDonation}, ${normalizedGender}, ${status}, ${normalizedImageUrl})
      RETURNING id
    `;

    const newId = (rows[0] as { id: number }).id;

    return NextResponse.json(
      { success: true, data: { id: newId } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/donors] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register donor." },
      { status: 500 }
    );
  }
}