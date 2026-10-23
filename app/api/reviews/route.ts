import { NextResponse } from "next/server";

const fail = (message: string, status: number) => NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return fail("Μη έγκυρα δεδομένα.", 400); }
  if (typeof body.website === "string" && body.website.trim()) return fail("Μη έγκυρο αίτημα.", 400);

  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    if (!token) return fail("Ολοκληρώστε τον έλεγχο προστασίας.", 400);
    try {
      const check = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      const verdict = await check.json().catch(() => ({}));
      if (!check.ok || verdict.success !== true) return fail("Ο έλεγχος προστασίας απέτυχε. Δοκιμάστε ξανά.", 400);
    } catch { return fail("Ο έλεγχος προστασίας δεν είναι διαθέσιμος. Δοκιμάστε ξανά.", 503); }
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";
  const rating = Number(body.rating);
  if (name.length < 2 || name.length > 100) return fail("Συμπληρώστε σωστά το όνομά σας.", 400);
  if (comment.length < 8 || comment.length > 2000) return fail("Η κριτική πρέπει να έχει 8–2.000 χαρακτήρες.", 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return fail("Επιλέξτε βαθμολογία από 1 έως 5.", 400);

  const base = process.env.RAILWAY_API_BASE?.replace(/\/+$/, "").replace(/\/api\/functions$/i, "").replace(/\/api$/i, "");
  const key = process.env.RAILWAY_API_KEY;
  if (!base || !key) return fail("Η αποστολή κριτικών δεν είναι προσωρινά διαθέσιμη.", 503);
  try {
    const response = await fetch(`${base}/api/functions/publicSiteReview`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key },
      body: JSON.stringify({ name, comment, rating }),
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok !== true) return fail(typeof data?.error === "string" ? data.error : "Η κριτική δεν καταχωρίστηκε.", response.status >= 500 ? 502 : response.status);
    return NextResponse.json({ ok: true, message: data.duplicate ? "Η ίδια κριτική έχει ήδη σταλεί." : "Η κριτική καταχωρίστηκε και θα εμφανιστεί μετά την έγκριση." });
  } catch { return fail("Δεν ήταν δυνατή η επικοινωνία με το σύστημα. Δοκιμάστε ξανά.", 503); }
}
