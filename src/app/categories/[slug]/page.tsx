import Link from "next/link";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const label = slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="py-8">
      <section className="panel p-6 md:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200/80">Category</p>
        <h1 className="mt-3 text-5xl font-black">{label}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
          Category landing pages are stubbed for launch. Search active listings now, then connect a full CS2 item database later.
        </p>
        <Link href={`/market?q=${encodeURIComponent(label)}`} className="btn-primary mt-7">Search {label}</Link>
      </section>
    </div>
  );
}
