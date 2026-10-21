import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.RAILWAY_API_BASE?.replace(/\/+$/, "");
  const key = process.env.RAILWAY_API_KEY;
  if (!base || !key) return NextResponse.json({ dates: [] });

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
    if (!response.ok) return NextResponse.json({ dates: [] });
    const data = await response.json().catch(() => ({}));
    const dates = Array.isArray(data.dates)
      ? data.dates.filter((date: unknown) => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date))
      : [];
    return NextResponse.json({ dates });
  } catch {
    return NextResponse.json({ dates: [] });
  }
}
