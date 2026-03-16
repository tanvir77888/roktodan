// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── Auth check ───────────────────────────────────────────────────────
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("rb_session");
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const session = await verifyToken(sessionCookie.value);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ── Content-Length pre-check (fast reject before reading body) ───────
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 2MB." },
        { status: 413 }
      );
    }

    // ── Parse multipart form data ────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid multipart form data." },
        { status: 400 }
      );
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file provided. Expected a field named 'file'." },
        { status: 400 }
      );
    }

    // ── File size check after parsing (authoritative check) ──────────────
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 2MB." },
        { status: 413 }
      );
    }

    // ── MIME / extension validation ───────────────────────────────────────
    const allowedMime = ["image/jpeg", "image/png", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"];
    const allowedExtensions = ["jpg", "jpeg", "png", "svg", "ico"];

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowedExtensions.includes(ext) || !allowedMime.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Allowed: JPG, PNG, SVG, ICO." },
        { status: 400 }
      );
    }

    // ── Convert to base64 data URL ────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // ── Upload to Cloudinary ──────────────────────────────────────────────
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { success: false, error: "Image upload is not configured. Please set Cloudinary credentials in environment variables." },
        { status: 503 }
      );
    }
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "roktho-bondhon",
      resource_type: "image",
      allowed_formats: allowedExtensions,
    });

    return NextResponse.json(
      { success: true, data: { url: result.secure_url } },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/upload] Error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}