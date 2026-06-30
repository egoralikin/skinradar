import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "SkinRadar — CS2 Trading MVP",
  description: "Search, list, and trade CS2 skins through a P2P marketplace."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
            <div className="flex items-center gap-8">
              <Link href="/" className="group flex items-center gap-2 text-xl font-black tracking-tight">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-cyan-300 text-slate-950 transition group-hover:rotate-6">S</span>
                <span>Skin<span className="text-cyan-300">Radar</span></span>
              </Link>
              <nav className="hidden items-center gap-1 text-sm md:flex">
                <Link href="/" className="btn-ghost">Home</Link>
                <Link href="/tradeup" className="btn-ghost">Trade Up</Link>
                <Link href="/inventory" className="btn-ghost">Inventory</Link>
                <Link href="/game-items" className="btn-ghost">Game Items</Link>
                <Link href="/market" className="btn-ghost">Market</Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300 lg:block">EN / USD</div>
              {user ? (
                <>
                  <Link href="/sell" className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 sm:inline-flex">List item</Link>
                  <Link href="/dashboard" className="hidden sm:inline-flex">
                    {user.avatar ? <img src={user.avatar} alt="" className="h-9 w-9 rounded-full border border-white/15" /> : <span className="btn-secondary py-2">Dashboard</span>}
                  </Link>
                  <a href="/api/auth/logout" className="btn-ghost">Logout</a>
                </>
              ) : (
                <a href="/api/auth/steam/login" className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
                  Sign in with Steam
                </a>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 pb-20 md:px-6">{children}</main>
      </body>
    </html>
  );
}
