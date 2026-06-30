import Link from "next/link";
import { caseNames, gloveNames, knifeNames, weaponGroups } from "@/lib/catalog";

export const dynamic = "force-static";

export default function GameItemsPage() {
  return (
    <div className="py-8">
      <section className="panel p-6 md:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200/80">Game items</p>
        <h1 className="mt-3 text-5xl font-black">CS2 item library</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
          A search-first category hub for skins, cases, gloves, knives, stickers, and other CS2 cosmetics. Link every category to your marketplace search while the full item database is being expanded.
        </p>
      </section>

      <section id="skins" className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {weaponGroups.map((group) => (
          <div key={group.title} className="category-tile">
            <h2 className="text-2xl font-black">{group.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{group.subtitle}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => <Link key={item} href={`/market?q=${encodeURIComponent(item)}`} className="chip">{item}</Link>)}
            </div>
          </div>
        ))}
      </section>

      <CatalogSection id="cases" title="Cases and terminals" items={caseNames} />
      <CatalogSection id="knives" title="Knife types" items={knifeNames} />
      <CatalogSection id="gloves" title="Glove types" items={gloveNames} />
    </div>
  );
}

function CatalogSection({ id, title, items }: { id: string; title: string; items: string[] }) {
  return (
    <section id={id} className="mt-10 card p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black">{title}</h2>
        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">{items.length} links</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => <Link key={item} href={`/market?q=${encodeURIComponent(item)}`} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-white">{item}</Link>)}
      </div>
    </section>
  );
}
