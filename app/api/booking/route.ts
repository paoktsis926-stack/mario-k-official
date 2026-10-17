import { NextResponse, after } from "next/server";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
async function sendMail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY, from = process.env.MAIL_FROM;
  if (!key || !from || !to) return;
  await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to, subject, html }) }).catch(() => {});
}


const strFields = ["first_name","last_name","phone","email","event_type","event_date","event_time","area","venue"] as const;
const fail = (message: string, status: number) => NextResponse.json({ success: false, message }, { status });

export async function POST(request: Request) {
  const apiBase = process.env.DJPRO_API_BASE?.replace(/\/+$/, "");
  const apiKey = process.env.DJPRO_API_KEY;
  if (!apiBase || !apiKey) { console.error("[booking] Λείπει DJPRO_API_BASE ή DJPRO_API_KEY από το .env.local"); return fail("Η υπηρεσία κρατήσεων δεν είναι διαθέσιμη αυτή τη στιγμή.", 500); }

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
  clean.source = "Next.js Website" + (typeof body.src === "string" && /^[\w-]{1,60}$/.test(body.src) ? ` · ${body.src}` : "");
  clean.external_id = typeof body.external_id === "string" ? body.external_id.slice(0, 100) : undefined;

  try {
    const res = await fetch(`${apiBase}/apiCreateBookingRequest`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(clean),
      cache: "no-store",
    });
    const raw = await res.text();
    if (!res.ok) console.error("[booking] DJ PRO HUB απάντησε", res.status, raw.slice(0, 500));
    let data: Record<string, unknown>;
    try { data = JSON.parse(raw); } catch { return fail("Άκυρη απάντηση από το σύστημα κρατήσεων.", 502); }
    if (res.status === 401) return fail("Αποτυχία σύνδεσης με το σύστημα κρατήσεων.", 502);
    if (!res.ok || data.success !== true) {
      const m = [data.message, data.error, data.detail].find((x) => typeof x === "string" && x);
      return fail(`Σφάλμα συστήματος (${res.status}): ${m ?? raw.slice(0, 200)}`, res.status >= 400 ? res.status : 502);
    }
    const code = esc(data.request_code);
    after(async () => {
      const rows = Object.entries(clean).map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("");
      await sendMail(process.env.NOTIFY_EMAIL || "", `Νέο αίτημα ${code}: ${esc(clean.event_type)} ${esc(clean.event_date)}`, `<h3>Νέο αίτημα κράτησης ${code}</h3><table cellpadding="6">${rows}</table>`);
      if (process.env.CUSTOMER_MAIL === "on")
        await sendMail(String(clean.email), "Λάβαμε το αίτημά σας — MARIO K", `<p>Γεια σας ${esc(clean.first_name)},</p><p>Λάβαμε το αίτημά σας (κωδικός <b>${code}</b>) για τις ${esc(clean.event_date)}. Θα επικοινωνήσουμε μαζί σας σύντομα για να επιβεβαιώσουμε τη διαθεσιμότητα.</p><p>MARIO K</p>`);
    });
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("[booking] Αποτυχία σύνδεσης με", apiBase, e);
    return fail("Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά ή καλέστε μας.", 502);
  }
}
