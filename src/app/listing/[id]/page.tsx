import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatMoney } from "@/lib/format";
import OfferForm from "./offer-form";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { user: { select: { id: true, steamId: true, personaName: true, avatar: true, tradeUrl: true } } }
  });
  if (!listing || listing.status !== "ACTIVE") notFound();

  const isOwner = user?.id === listing.userId;

  return (
    <div className="grid gap-8 py-8 lg:grid-cols-[.95fr_1.05fr]">
      <section className="card flex min-h-[420px] items-center justify-center p-8">
        {listing.imageUrl ? <img src={listing.imageUrl} alt={listing.name} className="max-h-[380px] object-contain" /> : <span className="text-slate-500">No image</span>}
      </section>
      <section className="card p-8">
        <p className="mb-3 text-sm uppercase tracking-[.25em] text-sky-300">Active listing</p>
        <h1 className="text-4xl font-black leading-tight">{listing.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
          {listing.exterior ? <span className="rounded-full bg-white/10 px-3 py-1">{listing.exterior}</span> : null}
          {listing.rarity ? <span className="rounded-full bg-white/10 px-3 py-1">{listing.rarity}</span> : null}
          <span className="rounded-full bg-white/10 px-3 py-1">Asset {listing.assetId}</span>
        </div>
        <p className="mt-8 text-5xl font-black text-sky-200">{formatMoney(listing.priceCents)}</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-slate-400">Seller</p>
          <div className="mt-2 flex items-center gap-3">
            {listing.user.avatar ? <img src={listing.user.avatar} alt="" className="h-11 w-11 rounded-xl" /> : <div className="h-11 w-11 rounded-xl bg-white/10" />}
            <div>
              <p className="font-semibold">{listing.user.personaName || "Steam user"}</p>
              <p className="text-xs text-slate-500">{listing.user.steamId}</p>
            </div>
          </div>
        </div>

        {isOwner ? (
          <p className="mt-6 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4 text-sky-100">This is your listing.</p>
        ) : user ? (
          <OfferForm listingId={listing.id} sellerTradeUrl={listing.user.tradeUrl || ""} />
        ) : (
          <a href="/api/auth/steam/login" className="btn-primary mt-6 w-full">Sign in with Steam to trade</a>
        )}
      </section>
    </div>
  );
}
