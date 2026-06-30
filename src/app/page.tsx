import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { caseNames, gloveNames, heroQuickLinks, knifeNames, popularSearches, weaponGroups } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const listings: any[] = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { user: { select: { personaName: true, avatar: true, steamId: true } } }
  });

  return (
    <div className="py-8 md:py-12">
      <section className="panel overflow-hidden p-5 md:p-9">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
              CS2 skin search + P2P trading marketplace
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Find CS2 skins faster. Trade directly with Steam users.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Search knives, gloves, cases, stickers, and player listings in one clean interface. This version keeps the marketplace P2P: no gambling, no bot deposits, no hidden wallet mechanics.
            </p>

            <form action="/market" className="mt-8">
              <div className="relative">
                <input name="q" className="search-input pr-36" placeholder="Search AK-47, Karambit, Gloves, Case..." />
                <button className="absolute right-2 top-2 rounded-2xl bg-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-200" type="submit">
                  Search
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {heroQuickLinks.map((link) => (
                <Link key={link.label} href={link.href} className="chip">{link.label}</Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-400">
              <span className="py-2 font-semibold text-slate-300">Popular:</span>
              {popularSearches.slice(0, 4).map((item) => (
                <Link key={item} href={`/market?q=${encodeURIComponent(item)}`} className="chip bg-black/20">{item}</Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-4">
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200/80">Live market</p>
                <h2 className="mt-1 text-2xl font-black">Latest listings</h2>
              </div>
              <Link href="/market" className="text-sm font-bold text-cyan-200 hover:text-white">View all</Link>
            </div>
            <div className="grid gap-3">
              {listings.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 p-8 text-slate-400">
                  No listings yet. Sign in with Steam and list your first CS2 item.
                </div>
              ) : (
                listings.map((listing) => (
                  <Link key={listing.id} href={`/listing/${listing.id}`} className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-300/30 hover:bg-white/[0.08]">
                    <div className="grid h-20 w-28 shrink-0 place-items-center rounded-2xl bg-slate-950/70">
                      {listing.imageUrl ? <img src={listing.imageUrl} alt="" className="max-h-16 max-w-24 object-contain transition group-hover:scale-105" /> : <span className="text-xs text-slate-500">No image</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black">{listing.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{listing.exterior || listing.rarity || "CS2 item"}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">Seller: {listing.user.personaName || listing.user.steamId}</p>
                    </div>
                    <p className="font-black text-cyan-200">{formatMoney(listing.priceCents)}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {weaponGroups.map((group) => (
          <Link href={group.href} key={group.title} className="category-tile">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200/80">Explore</p>
            <h2 className="mt-3 text-2xl font-black">{group.title}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{group.subtitle}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.slice(0, 6).map((item) => <span key={item} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-300">{item}</span>)}
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr_.85fr]">
        <CatalogColumn title="Popular cases" items={caseNames.slice(-12).reverse()} hrefBase="/market?q=" />
        <CatalogColumn title="Knife types" items={knifeNames} hrefBase="/market?q=" />
        <CatalogColumn title="Glove types" items={gloveNames} hrefBase="/market?q=" />
      </section>
    </div>
  );
}

function CatalogColumn({ title, items, hrefBase }: { title: string; items: string[]; hrefBase: string }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">{title}</h2>
        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">{items.length}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {items.map((item) => (
          <Link key={item} href={`${hrefBase}${encodeURIComponent(item)}`} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-white">
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
