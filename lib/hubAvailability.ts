// Ζωντανή διαθεσιμότητα μίας ημερομηνίας από το DJ PRO HUB (Railway). Read-only.
// Ίδια πηγή με το /api/availability που χρησιμοποιεί η φόρμα κράτησης.
export type DateStatus = "available" | "pending" | "unavailable" | "unknown";

export async function getDateStatus(date: string): Promise<DateStatus> {
  const base = process.env.RAILWAY_API_BASE?.replace(/\/+$/, ""), key = process.env.RAILWAY_API_KEY;
  if (!base || !key || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "unknown";
  try {
    const r = await fetch(`${base}/api/functions/publicAvailability?date=${date}`, { headers: { "x-api-key": key }, cache: "no-store", signal: AbortSignal.timeout(4000) });
    if (!r.ok) return "unknown";
    const j = await r.json();
    return j.status === "available" || j.status === "pending" || j.status === "unavailable" ? j.status : "unknown";
  } catch {
    return "unknown";
  }
}
