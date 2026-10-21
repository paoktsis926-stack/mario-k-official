// Εντοπίζει ημερομηνίες μέσα στο κείμενο του πελάτη (ελληνικά/αγγλικά/αριθμητικά) και τις
// επιστρέφει ως "YYYY-MM-DD". Χρησιμοποιείται από τον βοηθό για να ελέγξει ζωντανά τη διαθεσιμότητα.
// Δεκτές μορφές: 12/6/2027 · 12.6.2027 · 12-6-2027 · 2027-06-12 · 12/6 · 12 Ιουνίου 2027 · 12 Ιουνίου · June 12.
// Αγνοεί ημερομηνίες στο παρελθόν ή πάνω από ~3 χρόνια μπροστά.

const MONTHS: Record<string, number> = {
  ιαν: 1, φεβ: 2, μαρ: 3, απρ: 4, μαι: 5, ιουν: 6, ιουλ: 7, αυγ: 8, σεπ: 9, οκτ: 10, νοε: 11, δεκ: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const pad = (n: number) => String(n).padStart(2, "0");
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function build(y: number, m: number, d: number, today: Date): string | null {
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  const t0 = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (dt.getTime() < t0 || dt.getTime() > t0 + 3 * 366 * 864e5) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}
// Χωρίς έτος: η πρώτη μελλοντική εμφάνιση της ημερομηνίας.
function noYear(m: number, d: number, today: Date): string | null {
  const y = today.getUTCFullYear();
  return build(y, m, d, today) ?? build(y + 1, m, d, today);
}
const fullYear = (y: string) => (y.length === 2 ? 2000 + Number(y) : Number(y));

export function extractDates(text: string, today: Date = new Date()): string[] {
  const t = norm(text);
  const found: string[] = [];
  const add = (v: string | null) => { if (v && !found.includes(v)) found.push(v); };

  // 2027-06-12
  for (const m of t.matchAll(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/g)) add(build(Number(m[1]), Number(m[2]), Number(m[3]), today));
  // 12/6/2027 · 12.6.27 · 12-6-2027
  for (const m of t.matchAll(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}|\d{2})\b/g)) add(build(fullYear(m[3]), Number(m[2]), Number(m[1]), today));
  // 12/6 (μόνο με κάθετο, ώστε να μη μπερδεύεται με «2.5 ώρες» ή «10-12»)
  for (const m of t.matchAll(/(^|[^\d/.-])(\d{1,2})\/(\d{1,2})(?![\d/.])/g)) add(noYear(Number(m[3]), Number(m[2]), today));
  // 12 Ιουνίου 2027 · 12 ιουνιου · 12 June
  for (const m of t.matchAll(/\b(\d{1,2})\s*(?:ης|η|ο|st|nd|rd|th)?\s+(?:του\s+|of\s+)?([α-ωςa-z]{3,})\.?(?:\s+(20\d{2}))?/g)) {
    const mo = MONTHS[m[2].slice(0, 3)] ?? MONTHS[m[2].slice(0, 4)];
    if (!mo) continue;
    add(m[3] ? build(Number(m[3]), mo, Number(m[1]), today) : noYear(mo, Number(m[1]), today));
  }
  // June 12, 2027 · June 12
  for (const m of t.matchAll(/\b([a-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(20\d{2}))?\b/g)) {
    const mo = MONTHS[m[1].slice(0, 3)];
    if (!mo || !/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.test(m[1])) continue;
    add(m[3] ? build(Number(m[3]), mo, Number(m[2]), today) : noYear(mo, Number(m[2]), today));
  }
  return found.slice(0, 2);
}
