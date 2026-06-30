"use client";

import { useEffect, useMemo, useState } from "react";

type InventoryItem = {
  assetId: string;
  classId?: string;
  instanceId?: string;
  name: string;
  marketHashName?: string;
  imageUrl?: string;
  exterior?: string;
  rarity?: string;
  tradable: boolean;
  marketable: boolean;
};

export default function SellClient() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/inventory");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load inventory.");
        setItems(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((item) => !q || item.name.toLowerCase().includes(q) || item.marketHashName?.toLowerCase().includes(q));
  }, [items, query]);

  async function listItem(item: InventoryItem) {
    const price = prices[item.assetId];
    setStatus((s) => ({ ...s, [item.assetId]: "Listing..." }));
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, price })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create listing.");
      setStatus((s) => ({ ...s, [item.assetId]: "Listed." }));
    } catch (err) {
      setStatus((s) => ({ ...s, [item.assetId]: err instanceof Error ? err.message : "Could not create listing." }));
    }
  }

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black">List a CS2 item</h1>
          <p className="mt-2 text-slate-400">Your Steam inventory must be public for this MVP to load it.</p>
        </div>
        <input className="input md:w-96" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your inventory..." />
      </div>

      {loading ? <div className="card p-10 text-center text-slate-300">Loading Steam inventory...</div> : null}
      {error ? <div className="card border-red-400/20 p-10 text-red-200">{error}</div> : null}

      {!loading && !error ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.assetId} className="card p-4">
              <div className="flex h-44 items-center justify-center rounded-2xl bg-black/20">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="max-h-40 object-contain" /> : <span className="text-slate-500">No image</span>}
              </div>
              <h2 className="mt-4 line-clamp-2 min-h-12 font-bold">{item.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{item.exterior || item.rarity || "CS2 item"}</p>
              <div className="mt-4 flex gap-2">
                <input
                  className="input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Price USD"
                  value={prices[item.assetId] || ""}
                  onChange={(e) => setPrices((p) => ({ ...p, [item.assetId]: e.target.value }))}
                />
                <button className="btn-primary shrink-0" onClick={() => listItem(item)} type="button">List</button>
              </div>
              {status[item.assetId] ? <p className="mt-3 text-sm text-slate-300">{status[item.assetId]}</p> : null}
              {!item.tradable ? <p className="mt-2 text-xs text-amber-200">Steam marks this item as not tradable.</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
