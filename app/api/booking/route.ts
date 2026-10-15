import { NextResponse } from "next/server";

const strFields = ["first_name","last_name","phone","email","event_type","event_date","event_time","area","venue"] as const;
const fail = (message: string, status: number) => NextResponse.json({ success: false, message }, { status });

export async function POST(request: Request) {
  const apiBase = process.env.DJPRO_API_BASE?.replace(/\/+$/, "");
  const apiKey = process.env.DJPRO_API_KEY;
  if (!apiBase || !apiKey) return fail("Η υπηρεσία κρατήσεων δεν είναι διαθέσιμη αυτή τη στιγμή.", 500);

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return fail("Μη έγκυρα δεδομένα.", 400); }

  const clean: Record<string, unknown> = {};
  for (const f of strFields) {
    const v = body[f];
    if (typeof v !== "string" || !v.trim() || v.length > 200) return fail("Συμπληρώστε σωστά όλα τα υποχρεωτικά πεδία.", 400);
    clean[f] = v.trim();
  }
  const guests = body.guest_count;
  if (typeof guests !== "number" || !Number.isInteger(guests) || guests < 1 || guests > 5000) return fail("Μη έγκυρος αριθμός καλεσμένων.", 400);
  clean.guest_count = guests;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email as string)) return fail("Μη έγκυρο email.", 400);
  const date = new Date(clean.event_date as string);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (isNaN(date.getTime()) || date < today) return fail("Η ημερομηνία πρέπει να είναι μελλοντική.", 400);

  clean.package = typeof body.package === "string" ? body.package.slice(0, 100) : "";
  clean.message = typeof body.message === "string" ? body.message.slice(0, 2000) : "";
  clean.source = "Next.js Website";
  clean.external_id = typeof body.external_id === "string" ? body.external_id.slice(0, 100) : undefined;

  try {
    const res = await fetch(`${apiBase}/apiCreateBookingRequest`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(clean),
      cache: "no-store",
    });
    let data: Record<string, unknown>;
    try { data = await res.json(); } catch { return fail("Άκυρη απάντηση από το σύστημα κρατήσεων.", 502); }
    if (res.status === 401) return fail("Αποτυχία σύνδεσης με το σύστημα κρατήσεων.", 502);
    return NextResponse.json(data, { status: res.status });
  } catch {
    return fail("Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά ή καλέστε μας.", 502);
  }
}
