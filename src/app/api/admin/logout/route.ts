// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set("rb_session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}