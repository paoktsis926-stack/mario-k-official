import { cacheLife } from "next/cache";
import { packages as fallback, type Pkg } from "@/lib/content";

const MAP: Record<string, string[]> = {
  wedding: ["wedding"], baptism: ["baptism"], bachelor: ["bachelorette"], pre_game: ["bachelorette"], beachbar: ["club"],
  party: ["private-party", "corporate", "karaoke"], private_party: ["private-party", "corporate", "karaoke"], reunion: ["private-party", "corporate"], birthday: ["private-party"],
};

function eventSlugs(eventType: string): string[] {
  const raw = (eventType || "").trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  // Πρώτα αναγνωρίζουμε ελληνικές τιμές, πριν αφαιρεθούν οι ελληνικοί χαρακτήρες.
  if (/γαμ|wedding/.test(raw)) return ["wedding"];
  if (/βαπτ|baptism|vaptisi|vaftisi/.test(raw)) return ["baptism"];
  if (/bachelor|bachelorette/.test(raw)) return ["bachelorette"];
  if (/beach.?bar|club|bar/.test(raw)) return ["club"];
  if (/εταιρ|corporate|company|opening|inauguration|εγκαιν/.test(raw)) return ["corporate"];
  if (/karaoke/.test(raw)) return ["karaoke"];
  if (/γενεθ|birthday|reunion|επανεν|party|παρτ|private|ιδιωτ|pre.?party/.test(raw)) return ["private-party"];
  const key = raw.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return MAP[key] ?? [];
}

// Τιμοκατάλογος απευθείας από το DJ PRO HUB. Αν το HUB δεν απαντήσει, μένουν τα τελευταία γνωστά πακέτα του site.
export async function getPackages(): Promise<Pkg[]> {
  "use cache";
  cacheLife("minutes");
  const base = process.env.RAILWAY_API_BASE?.replace(/\/+$/, ""), key = process.env.RAILWAY_API_KEY;
  if (!base || !key) return fallback;
  try {
    const r = await fetch(`${base}/publicCatalog`, { headers: { "x-api-key": key }, signal: AbortSignal.timeout(6000) });
    const j = await r.json();
    if (!r.ok || !Array.isArray(j.packages) || !j.packages.length) return fallback;
    const extras: string[] = (j.add_ons || []).slice(0, 8).map((a: { name: string; price: number }) => `${a.name}${a.price ? ` (+${a.price}€)` : ""}`);
    const star = fallback.filter((f) => f.highlight).map((f) => f.name.toLowerCase());
    return j.packages.map((p: { name: string; price: number; price_max: number; duration: string; short_description: string; included_features: string[]; event_type: string }) => ({
      name: p.name, price: p.price, price_text: p.price_max > p.price ? `${p.price}–${p.price_max}€` : `${p.price}€`,
      duration: p.duration || "", tagline: "", best_for: p.short_description || "", features: p.included_features || [], extras,
      highlight: star.some((s) => p.name.toLowerCase().startsWith(s)), slugs: fallback.find((f) => f.name.trim().toLowerCase() === p.name.trim().toLowerCase())?.slugs ?? eventSlugs(p.event_type),
    }));
  } catch {
    return fallback;
  }
}
