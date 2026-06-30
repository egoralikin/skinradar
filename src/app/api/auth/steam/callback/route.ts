import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { fetchSteamProfile, getAppUrl, verifySteamOpenId } from "@/lib/steam";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const steamId = await verifySteamOpenId(params);
  const appUrl = getAppUrl(request.nextUrl.origin);

  if (!steamId) {
    return NextResponse.redirect(`${appUrl}/?auth=failed`);
  }

  const profile = await fetchSteamProfile(steamId);
  const user = await prisma.user.upsert({
    where: { steamId },
    update: {
      personaName: profile?.personaname,
      avatar: profile?.avatarfull || profile?.avatarmedium
    },
    create: {
      steamId,
      personaName: profile?.personaname,
      avatar: profile?.avatarfull || profile?.avatarmedium
    }
  });

  const token = await createSessionToken({ userId: user.id, steamId: user.steamId });
  const response = NextResponse.redirect(`${appUrl}/dashboard`);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
