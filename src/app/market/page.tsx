import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { popularSearches } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function MarketPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }) {
  const { q, sort } = await searchParams;
  const listings: any[] = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {})
    },
    orderBy: sort === "price-low" ? { priceCents: "asc" } : sort === "price-high" ? { priceCents: "desc" } : { createdAt: "desc" },
    include: { user: { select: { personaName: true, avatar: true, steamId: true } } }
  });

  return (
    <div className="py-8">
      <section className="panel p-5 md:p-8">
        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200/80">Search market</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">CS2 skin marketplace</h1>
            <p className="mt-3 max-w-2xl text-slate-400">Browse active P2P listings from signed-in Steam users. Filter by item name, compare prices, and contact sellers through the listing flow.</p>
          </div>
          <Link href="/sell" className="btn-primary">List your inventory</Link>
        </div>

        <form className="grid gap-3 lg:grid-cols-[1fr_180px_120px]" action="/market">
          <input className="search-input py-4" name="q" placeholder="Search AK, Knife, Gloves, Sticker..." defaultValue={q || ""} />
          <select className="input" name="sort" defaultValue={sort || "newest"}>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
          <button className="btn-secondary" type="submit">Search</button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {popularSearches.map((item) => <Link key={item} href={`/market?q=${encodeURIComponent(item)}`} className="chip">{item}</Link>)}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-5">
          <h2 className="text-lg font-black">Filters</h2>
          <div className="mt-5 space-y-5">
            <FilterGroup title="Category" items={["Knives", "Gloves", "Rifles", "Pistols", "SMGs", "Cases", "Stickers"]} />
            <FilterGroup title="Exterior" items={["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"]} />
            <FilterGroup title="Trade type" items={["P2P trade", "Cash offer", "Trade URL ready"]} />
          </div>
        </aside>

        {listings.length === 0 ? (
          <div className="card grid min-h-96 place-items-center p-10 text-center">
            <div>
              <h2 className="text-2xl font-black">No active listings found</h2>
              <p className="mt-3 text-slate-400">Try a different search or sign in and list an item from your Steam inventory.</p>
              <Link href="/sell" className="btn-primary mt-6">Create first listing</Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
              <span>{listings.length} active listing{listings.length === 1 ? "" : "s"}</span>
              <span>P2P marketplace MVP</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.id}`} className="market-card group">
                  <div className="grid h-48 place-items-center rounded-3xl bg-black/25">
                    {listing.imageUrl ? <img src={listing.imageUrl} alt={listing.name} className="max-h-40 object-contain transition group-hover:scale-105" /> : <span className="text-slate-500">No image</span>}
                  </div>
                  <div className="mt-4">
                    <h2 className="line-clamp-2 min-h-12 font-black">{listing.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">{listing.exterior || listing.rarity || "CS2 item"}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-black text-cyan-200">{formatMoney(listing.priceCents)}</span>
                      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-400">P2P</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-xs text-slate-500">
                      {listing.user.avatar ? <img src={listing.user.avatar} alt="" className="h-6 w-6 rounded-full" /> : null}
                      <span className="truncate">{listing.user.personaName || listing.user.steamId}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item} href={`/market?q=${encodeURIComponent(item)}`} className="block rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-white">
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
