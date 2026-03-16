import { runMigration } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  await runMigration();
  return NextResponse.json({ success: true, message: "Migration complete" });
}