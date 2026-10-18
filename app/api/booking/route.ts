import { NextResponse, after } from "next/server";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
async function sendMail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY, from = process.env.MAIL_FROM;
  if (!key || !from || !to) return;
  await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to, subject, html }) }).catch(() => {});
}

const strFields = ["first_name", "last_name", "phone", "email", "event_type", "event_date", "event_time", "area", "venue"] as const;
const fail = (message: string, status: number, extra: Record<string, unknown> = {}) => NextResponse.json({ success: false, message, ...extra }, { status });

// Αντιστοίχιση τύπων του site → ετικέτες που αναγνωρίζει το HUB (publicTypeMap). Η αρχική επιλογή του πελάτη μένει στα σχόλια.
const hubType: Record<string, { type: string; prefix: string }> = {
  wedding: { type: "wedding", prefix: "" },
  baptism: { type: "baptism", prefix: "" },
  "private-party": { type: "party", prefix: "" },
  bachelorette: { type: "bachelorette", prefix: "" },
  club: { type: "Club", prefix: "[Club / Bar] " },
  corporate: { type: "Εταιρικό", prefix: "" },
  karaoke: { type: "party", prefix: "[Karaoke Party & Games] " },
};

let catalog: { at: number; list: { package_id: string; name: string }[] } | null = null;
async function findPackageId(base: string, key: string, label: unknown) {
  const name = String(label ?? "").split("—")[0].trim().toLowerCase();
  if (!name) return "";
  try {
    if (!catalog || Date.now() - catalog.at > 300_000) {
      const r = await fetch(`${base}/publicCatalog`, { headers: { "x-api-key": key }, cache: "no-store", signal: AbortSignal.timeout(5000) });
      const j = await r.json();
      catalog = { at: Date.now(), list: Array.isArray(j.packages) ? j.packages : [] };
    }
    return catalog.list.find((p) => p.name.toLowerCase() === name || p.name.toLowerCase().startsWith(name))?.package_id ?? "";
  } catch { return ""; }
}

export async function POST(request: Request) {
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
  const slug = typeof body.event_slug === "string" && hubType[body.event_slug] ? body.event_slug : "";
  const waitlist = body.waitlist === true;

  let code = "", id = "", via = "";

  // 1) ΚΥΡΙΑ διαδρομή: DJ PRO HUB (Railway)
  const rb = process.env.RAILWAY_API_BASE?.replace(/\/+$/, ""), rk = process.env.RAILWAY_API_KEY;
  if (rb && rk && slug) {
    try {
      const pkgId = await findPackageId(rb, rk, clean.package);
      const m = hubType[slug];
      const pkgNote = clean.package && !pkgId ? `Πακέτο: ${clean.package}\n` : "";
      const r = await fetch(`${rb}/publicSiteBooking`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": rk },
        body: JSON.stringify({
          full_name: `${clean.first_name} ${clean.last_name}`.trim(), phone: clean.phone, email: clean.email,
          preferred_date: clean.event_date, event_type: m.type, location: clean.area, venue: clean.venue,
          guest_count: clean.guest_count, start_time: clean.event_time,
          comments: `${m.prefix}${pkgNote}${clean.message}`.slice(0, 1000),
          wants_bachelor: slug === "bachelorette" ? "yes" : "no", package_id: pkgId, how_found: String(clean.source), waitlist,
        }),
        cache: "no-store", signal: AbortSignal.timeout(9000),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok && j.id) { id = String(j.id); code = `MK-${id.slice(-6).toUpperCase()}`; via = "hub"; }
      else if (r.status === 409) return fail(`${j.error || "Η ημερομηνία δεν είναι διαθέσιμη."} Μπορείτε να δηλώσετε ενδιαφέρον για λίστα αναμονής ή να διαλέξετε άλλη ημερομηνία.`, 409, { waitlist_offer: true });
      else if (r.status >= 400 && r.status < 500 && ![401, 403, 429].includes(r.status)) return fail(String(j.error || "Μη έγκυρο αίτημα."), 400);
      else console.error("[hub]", r.status, JSON.stringify(j).slice(0, 300));
    } catch (e) { console.error("[hub]", e); }
  }

  // 2) ΕΦΕΔΡΙΚΗ διαδρομή: Base44 (μόνο αν το HUB δεν απάντησε)
  if (!via) {
    const apiBase = process.env.DJPRO_API_BASE?.replace(/\/+$/, ""), apiKey = process.env.DJPRO_API_KEY;
    if (!apiBase || !apiKey) return fail("Η υπηρεσία κρατήσεων δεν είναι διαθέσιμη αυτή τη στιγμή. Καλέστε μας.", 503);
    try {
      const res = await fetch(`${apiBase}/apiCreateBookingRequest`, { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey }, body: JSON.stringify(clean), cache: "no-store", signal: AbortSignal.timeout(9000) });
      const data = await res.json().catch(() => ({} as Record<string, unknown>));
      if (res.status === 409) return fail("Το αίτημα έχει ήδη καταχωριστεί. Επικοινωνήστε μαζί μας για επιβεβαίωση.", 409);
      if (!res.ok || data.success !== true) { console.error("[base44]", res.status, JSON.stringify(data).slice(0, 300)); return fail("Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά ή καλέστε μας.", 502); }
      code = String(data.request_code ?? ""); id = String(data.id ?? ""); via = "base44";
    } catch (e) { console.error("[base44]", e); return fail("Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά ή καλέστε μας.", 502); }
  }

  const c = esc(code);
  after(async () => {
    const rows = Object.entries(clean).map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("");
    await sendMail(process.env.NOTIFY_EMAIL || "", `Νέο αίτημα ${c}: ${esc(clean.event_type)} ${esc(clean.event_date)}`, `<h3>Νέο αίτημα κράτησης ${c}${waitlist ? " (λίστα αναμονής)" : ""}</h3><p>Καταχωρίστηκε μέσω: ${esc(via)}</p><table cellpadding="6">${rows}</table>`);
    if (process.env.CUSTOMER_MAIL === "on")
      await sendMail(String(clean.email), "Λάβαμε το αίτημά σας — MARIO K", `<p>Γεια σας ${esc(clean.first_name)},</p><p>Λάβαμε το αίτημά σας (κωδικός <b>${c}</b>) για τις ${esc(clean.event_date)}. Θα επικοινωνήσουμε μαζί σας σύντομα για να επιβεβαιώσουμε τη διαθεσιμότητα.</p><p>MARIO K</p>`);
  });
  return NextResponse.json({ success: true, request_code: code, id, via });
}
