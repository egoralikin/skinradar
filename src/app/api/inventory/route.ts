import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { fetchCs2Inventory } from "@/lib/steam";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items = await fetchCs2Inventory(user.steamId);
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch Steam inventory." },
      { status: 502 }
    );
  }
}
