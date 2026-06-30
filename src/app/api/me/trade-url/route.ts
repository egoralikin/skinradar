import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

function isValidTradeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "steamcommunity.com" && url.pathname === "/tradeoffer/new/" && url.searchParams.has("partner") && url.searchParams.has("token");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const tradeUrl = typeof body?.tradeUrl === "string" ? body.tradeUrl.trim() : "";
  if (tradeUrl && !isValidTradeUrl(tradeUrl)) {
    return NextResponse.json({ error: "Enter a valid Steam trade URL." }, { status: 400 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { tradeUrl: tradeUrl || null } });
  return NextResponse.json({ ok: true });
}
