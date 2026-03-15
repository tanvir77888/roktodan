// src/app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSettings();

    // Remove all admin_* keys before returning to the client
    const publicSettings = Object.fromEntries(
      Object.entries(settings).filter(([key]) => !key.startsWith("admin_"))
    );

    return NextResponse.json({ success: true, data: publicSettings });
  } catch (error) {
    console.error("[GET /api/settings] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load settings" },
      { status: 500 }
    );
  }
}