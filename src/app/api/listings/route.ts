import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { priceToCents } from "@/lib/format";

export async function GET() {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { steamId: true, personaName: true, avatar: true } } }
  });
  return NextResponse.json({ listings });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const priceCents = priceToCents(body?.price);
  const assetId = typeof body?.assetId === "string" ? body.assetId : "";
  const name = typeof body?.name === "string" ? body.name : "";

  if (!assetId || !name || !priceCents) {
    return NextResponse.json({ error: "Missing item data or valid price." }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      userId: user.id,
      assetId,
      classId: typeof body?.classId === "string" ? body.classId : null,
      instanceId: typeof body?.instanceId === "string" ? body.instanceId : null,
      name,
      marketHashName: typeof body?.marketHashName === "string" ? body.marketHashName : null,
      imageUrl: typeof body?.imageUrl === "string" ? body.imageUrl : null,
      exterior: typeof body?.exterior === "string" ? body.exterior : null,
      rarity: typeof body?.rarity === "string" ? body.rarity : null,
      priceCents
    }
  });

  return NextResponse.json({ listing });
}
