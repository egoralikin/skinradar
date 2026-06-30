"use client";

import { useState } from "react";

export default function OfferForm({ listingId, sellerTradeUrl }: { listingId: string; sellerTradeUrl: string }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function registerInterest() {
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/listings/${listingId}/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not register interest.");
      setStatus("Seller can now see your interest in their dashboard.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not register interest.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <textarea className="input min-h-28" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Optional message to seller..." />
      <button className="btn-primary w-full" onClick={registerInterest} disabled={loading} type="button">
        {loading ? "Sending..." : "Tell seller I'm interested"}
      </button>
      {sellerTradeUrl ? (
        <a href={sellerTradeUrl} target="_blank" rel="noreferrer" className="btn-secondary w-full">
          Open seller Steam trade URL
        </a>
      ) : (
        <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
          Seller has not added a trade URL yet. Use the interest button so they can contact you.
        </p>
      )}
      {status ? <p className="text-sm text-slate-300">{status}</p> : null}
    </div>
  );
}
