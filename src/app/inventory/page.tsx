import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const user = await getCurrentUser();

  return (
    <div className="py-8">
      <section className="panel p-6 md:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200/80">Steam inventory</p>
        <h1 className="mt-3 text-5xl font-black">Inventory search</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
          Sign in with Steam to load your public CS2 inventory, save your trade URL, and list items for P2P trades.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {user ? (
            <>
              <Link href="/sell" className="btn-primary">Open inventory listing flow</Link>
              <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
            </>
          ) : (
            <a href="/api/auth/steam/login" className="btn-primary">Sign in with Steam</a>
          )}
        </div>
      </section>
    </div>
  );
}
