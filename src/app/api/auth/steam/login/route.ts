import { NextRequest, NextResponse } from "next/server";
import { buildSteamLoginUrl } from "@/lib/steam";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(buildSteamLoginUrl(origin));
}
