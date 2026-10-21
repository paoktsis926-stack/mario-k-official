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
    const r = await fetch(`${base}/api/functions/publicCatalog`, { headers: { "x-api-key": key }, signal: AbortSignal.timeout(6000) });
    const j = await r.json();
    if (!r.ok || !Array.isArray(j.packages) || !j.packages.length) return fallback;
    // Keep event-specific site offers unless the HUB has a package with the exact same name.
    const remote = new Map<string, { price: number; price_max?: number; duration?: string; short_description?: string; included_features?: string[] }>(
      j.packages.filter((p: any) => typeof p.name === "string").map((p: any) => [p.name.trim().toLowerCase(), p])
    );
    return fallback.map((p) => {
      const hub = remote.get(p.name.trim().toLowerCase());
      if (!hub) return p;
      const price = typeof hub.price === "number" && Number.isFinite(hub.price) ? hub.price : p.price;
      const max = typeof hub.price_max === "number" && Number.isFinite(hub.price_max) ? hub.price_max : price;
      return { ...p, price, price_text: max > price ? `${price}–${max}€` : `${price}€`,
        duration: hub.duration || p.duration, best_for: hub.short_description || p.best_for,
        features: Array.isArray(hub.included_features) && hub.included_features.length ? hub.included_features : p.features };
    });
  } catch { return fallback; }
}
