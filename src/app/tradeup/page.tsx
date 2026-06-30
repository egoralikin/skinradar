import Link from "next/link";

export default function TradeupPage() {
  return (
    <div className="py-8">
      <section className="panel p-6 md:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200/80">Tool preview</p>
        <h1 className="mt-3 text-5xl font-black">Trade-up helper</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
          This page is ready for a trade-up calculator module. For the launch MVP it routes users back to marketplace search and inventory listing so the site can go online quickly.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/market?q=Trade Up" className="btn-primary">Search trade-up fillers</Link>
          <Link href="/sell" className="btn-secondary">List inventory item</Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Input skins", "Let users add 10 skins and estimate output pools."],
          ["EV pricing", "Connect market prices later to show expected value."],
          ["Saved contracts", "Logged-in users can save and compare trade-up ideas."]
        ].map(([title, body]) => (
          <div key={title} className="category-tile">
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="mt-3 leading-7 text-slate-400">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
