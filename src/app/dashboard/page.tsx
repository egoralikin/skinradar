import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatMoney } from "@/lib/format";
import TradeUrlForm from "./trade-url-form";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/steam/login");

  const listings: any[] = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  const offers: any[] = await prisma.offer.findMany({
    where: { listing: { userId: user.id } },
    include: {
      buyer: { select: { personaName: true, steamId: true, tradeUrl: true } },
      listing: { select: { name: true, priceCents: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="grid gap-6 py-8 lg:grid-cols-[.85fr_1.15fr]">
      <aside className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            {user.avatar ? <img src={user.avatar} alt="" className="h-16 w-16 rounded-2xl" /> : <div className="h-16 w-16 rounded-2xl bg-white/10" />}
            <div>
              <h1 className="text-2xl font-black">{user.personaName || "Steam user"}</h1>
              <p className="text-sm text-slate-400">Steam ID: {user.steamId}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/sell" className="btn-primary">List item</Link>
            <Link href="/market" className="btn-secondary">Market</Link>
          </div>
        </div>
        <TradeUrlForm currentTradeUrl={user.tradeUrl || ""} />
      </aside>

      <section className="space-y-6">
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-bold">Your listings</h2>
          <div className="space-y-3">
            {listings.length === 0 ? <p className="text-slate-400">No listings yet.</p> : listings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                <div>
                  <p className="font-semibold">{listing.name}</p>
                  <p className="text-sm text-slate-400">{listing.status} · {formatMoney(listing.priceCents)}</p>
                </div>
                <Link href={`/listing/${listing.id}`} className="text-sm text-sky-300 hover:text-sky-200">Open</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-xl font-bold">Buyer interest</h2>
          <div className="space-y-3">
            {offers.length === 0 ? <p className="text-slate-400">No offers yet.</p> : offers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{offer.listing.name}</p>
                  <span className="text-sm text-sky-200">{formatMoney(offer.listing.priceCents)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">Buyer: {offer.buyer.personaName || offer.buyer.steamId}</p>
                {offer.message ? <p className="mt-2 text-sm text-slate-300">“{offer.message}”</p> : null}
                {offer.buyer.tradeUrl ? (
                  <a href={offer.buyer.tradeUrl} target="_blank" className="mt-3 inline-flex text-sm text-sky-300 hover:text-sky-200">Open buyer trade URL</a>
                ) : (
                  <p className="mt-3 text-sm text-amber-200">Buyer has not added a trade URL.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
