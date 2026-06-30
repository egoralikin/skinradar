import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.status !== "ACTIVE") return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  if (listing.userId === user.id) return NextResponse.json({ error: "You cannot offer on your own listing." }, { status: 400 });

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.slice(0, 500) : null;

  const offer = await prisma.offer.create({
    data: {
      listingId: listing.id,
      buyerId: user.id,
      message
    }
  });

  return NextResponse.json({ offer });
}
