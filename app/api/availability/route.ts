import { NextResponse } from "next/server";

// Ζωντανή διαθεσιμότητα από το DJ PRO HUB (Railway). Read-only.
export async function GET(request: Request) {
  const base = process.env.RAILWAY_API_BASE?.replace(/\/+$/, "");
  const key = process.env.RAILWAY_API_KEY;
  const date = new URL(request.url).searchParams.get("date") || "";
  if (!base || !key || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ status: "unknown" });
  try {
    const r = await fetch(`${base}/api/functions/publicAvailability?date=${date}`, { headers: { "x-api-key": key }, cache: "no-store" });
    if (!r.ok) return NextResponse.json({ status: "unknown" });
    const j = await r.json();
    return NextResponse.json({ status: ["available", "pending", "unavailable"].includes(j.status) ? j.status : "unknown" });
  } catch {
    return NextResponse.json({ status: "unknown" });
  }
}
