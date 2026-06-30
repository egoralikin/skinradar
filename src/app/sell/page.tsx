import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import SellClient from "./sell-client";

export const dynamic = "force-dynamic";

export default async function SellPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/steam/login");
  return <SellClient />;
}
