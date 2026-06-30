import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-black">Not found</h1>
      <p className="mt-3 text-slate-400">This listing does not exist or is no longer active.</p>
      <Link href="/market" className="btn-primary mt-8">Back to market</Link>
    </div>
  );
}
