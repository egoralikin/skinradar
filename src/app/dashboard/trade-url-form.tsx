"use client";

import { useState } from "react";

export default function TradeUrlForm({ currentTradeUrl }: { currentTradeUrl: string }) {
  const [tradeUrl, setTradeUrl] = useState(currentTradeUrl);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch("/api/me/trade-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tradeUrl })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save trade URL.");
      setStatus("Saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save trade URL.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <h2 className="text-xl font-bold">Steam trade URL</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Add the URL buyers will use to send you a trade offer. Treat this link as sensitive.
      </p>
      <input
        className="input mt-4"
        value={tradeUrl}
        onChange={(event) => setTradeUrl(event.target.value)}
        placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
      />
      <button className="btn-primary mt-4 w-full" disabled={saving} type="submit">
        {saving ? "Saving..." : "Save trade URL"}
      </button>
      {status ? <p className="mt-3 text-sm text-slate-300">{status}</p> : null}
    </form>
  );
}
