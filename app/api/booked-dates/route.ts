import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.RAILWAY_API_BASE?.replace(/\/+$/, "");
  const key = process.env.RAILWAY_API_KEY;
  if (!base || !key) return NextResponse.json({ dates: [], status: "unknown" }, { status: 503, headers: { "Cache-Control": "no-store" } });

  try {
    const response = await fetch(`${base}/api/functions/publicSiteData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
      },
      body: JSON.stringify({ action: "bookedDates" }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return NextResponse.json({ dates: [], status: "unknown" }, { status: 503, headers: { "Cache-Control": "no-store" } });
    const data = await response.json().catch(() => null);
    if (!data || !Array.isArray(data.dates)) {
      return NextResponse.json({ dates: [], status: "unknown" }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }
    const dates = data.dates.filter((date: unknown) => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date));
    return NextResponse.json({ dates, status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ dates: [], status: "unknown" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
