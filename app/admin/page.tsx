"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import { createContext, useContext, useEffect, useState } from "react";
import { seedPosts } from "@/lib/content";

const Ctx = createContext<any[]>([]);
const L: Record<string, string> = {
  name: "Όνομα", image_alt: "Εναλλακτικό κείμενο φωτογραφίας (SEO)", hero_image_alt: "Εναλλακτικό κείμενο φωτογραφίας hero (SEO)", portrait_alt: "Εναλλακτικό κείμενο πορτρέτου (SEO)", logo_alt: "Εναλλακτικό κείμενο λογοτύπου (SEO)", hero_video: "Βίντεο hero (link αρχείου .mp4)", reels: "Reels (κάθετα βίντεο)", slug: "Διεύθυνση άρθρου (λατινικά, χωρίς κενά)", excerpt: "Σύντομη περίληψη", body: "Κείμενο άρθρου (κενή γραμμή = νέα παράγραφος, ## = υπότιτλος)", link: "Link (προαιρετικό, π.χ. /booking)", url: "Link (SoundCloud ή YouTube)", price: "Τιμή (€)", duration: "Διάρκεια", tagline: "Υπότιτλος", best_for: "Ιδανικό για",
  features: "Τι περιλαμβάνει (μία γραμμή ανά στοιχείο)", extras: "Προαιρετικά extras (μία γραμμή το καθένα)",
  highlight: "Προτεινόμενο πακέτο (με έμφαση)", event_types: "Για ποιες εκδηλώσεις ισχύει", question: "Ερώτηση", answer: "Απάντηση",
  category: "Κατηγορία", title: "Τίτλος", image_url: "Φωτογραφία", video_url: "Βίντεο (link)", event_type_id: "Εκδήλωση",
  description: "Περιγραφή", stars: "Αστέρια (1 έως 5)", text: "Κείμενο", date: "Ημερομηνία", visible: "Εμφάνιση στο site",
  phone: "Τηλέφωνο", email: "Email", whatsapp: "WhatsApp (με κωδικό χώρας)", instagram_url: "Instagram link", tiktok_url: "TikTok link",
  location: "Περιοχή", footer_note: "Κείμενο στο footer", brand_name: "Όνομα brand", logo_url: "Λογότυπο", hero_image: "Φωτογραφία hero",
  hero_headline: "Τίτλος hero", hero_text: "Κείμενο hero", hero_eyebrow: "Μικρός τίτλος hero", hero_cta: "Κουμπί 1", hero_cta_secondary: "Κουμπί 2",
  intro: "Εισαγωγή", subtitle: "Υπότιτλος", cta_title: "Τίτλος τελικού κουμπιού", cta_text: "Κείμενο τελικού κουμπιού", cta_button: "Κείμενο κουμπιού",
  note: "Σημείωση", portrait: "Φωτογραφία πορτρέτου", bio_title: "Τίτλος βιογραφικού", bio_text: "Βιογραφικό",
};
const P: Record<string, string> = {
  home: "Αρχική σελίδα", global: "Στοιχεία επικοινωνίας & γενικά", services: "Σελίδα Υπηρεσίες", packages: "Σελίδα Πακέτα",
  photos: "Σελίδα Φωτογραφίες", venues: "Σελίδα Χώροι", about: "Σελίδα Σχετικά", faq: "Σελίδα FAQ", contact: "Σελίδα Επικοινωνία",
};
const tabs: [string, string][] = [["packages", "Πακέτα"], ["faq", "FAQ"], ["photos", "Φωτογραφίες"], ["services", "Υπηρεσίες"], ["eventTypes", "Εκδηλώσεις"], ["media", "Βίντεο"], ["banner", "Banner"], ["posts", "Blog"], ["mixes", "Mixes"], ["reviews", "Κριτικές"], ["site", "Κείμενα & στοιχεία"]];
const pretty = (k: string) => L[k] ?? k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
const IMG = /(image_url|portrait|logo_url|hero_image)$/;
const inp = "mt-1 w-full rounded border border-black/25 bg-white p-2.5 text-sm text-black focus:border-[#c2a86a] focus:outline-none";
const btn = "rounded border border-black/70 px-3 py-1.5 text-xs hover:bg-black hover:text-white disabled:opacity-40";
const blank = (x: any): any => Array.isArray(x) ? [] : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, blank(v)])) : typeof x === "number" ? 0 : typeof x === "boolean" ? false : "";

function Field({ k, v, set }: { k: string; v: any; set: (x: any) => void }) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState("");
  if (typeof v === "boolean") return <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" className="h-4 w-4" checked={v} onChange={(e) => set(e.target.checked)} />{pretty(k)}</label>;
  if (typeof v === "number") return <label className="block text-sm"><span className="font-medium">{pretty(k)}</span><input type="number" className={inp} value={v} onChange={(e) => set(Number(e.target.value))} /></label>;
  const s = v ?? "";
  async function upload(f: File) {
    setPreview(URL.createObjectURL(f)); setBusy(true);
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd }).then((x) => x.json()).catch(() => ({ ok: false, message: "Σφάλμα δικτύου" }));
    setBusy(false);
    if (r.ok) set(r.url); else { setPreview(""); alert(r.message); }
  }
  return (
    <label className="block text-sm"><span className="font-medium">{pretty(k)}</span>
      {IMG.test(k) ? (
        <span className="mt-2 flex flex-wrap items-center gap-4">
          {(preview || s) && <img src={preview || s} alt="" className="h-24 w-24 rounded object-cover" />}
          <span className="flex flex-col gap-2"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />{busy && <span className="text-xs">Ανεβαίνει…</span>}<span className="text-xs text-black/60">{s ? "Υπάρχει φωτογραφία — επίλεξε αρχείο για αντικατάσταση." : "Δεν έχει οριστεί φωτογραφία."}</span></span>
        </span>
      ) : (s.length > 70 || s.includes("\n") ? <textarea rows={k === "body" ? 14 : 4} className={inp} value={s} onChange={(e) => set(e.target.value)} /> : <input className={inp} value={s} onChange={(e) => set(e.target.value)} />)}
    </label>
  );
}

function Node({ k, v, set }: { k: string; v: any; set: (x: any) => void }) {
  const events = useContext(Ctx);
  if (k === "id") return null;
  if (k === "event_type_id") return <label className="block text-sm"><span className="font-medium">{pretty(k)}</span><select className={inp} value={v ?? ""} onChange={(e) => set(e.target.value)}><option value="">— καμία —</option>{events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></label>;
  if (k === "event_types" && Array.isArray(v)) return <div className="text-sm"><span className="font-medium">{pretty(k)}</span><div className="mt-2 grid gap-2 sm:grid-cols-2">{events.map((e) => <label key={e.id} className="flex items-center gap-2"><input type="checkbox" checked={v.includes(e.id)} onChange={(c) => set(c.target.checked ? [...v, e.id] : v.filter((x: string) => x !== e.id))} />{e.name}</label>)}</div></div>;
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x === "string"))
      return <label className="block text-sm"><span className="font-medium">{pretty(k)}{L[k] ? "" : " (μία γραμμή ανά στοιχείο)"}</span><textarea rows={Math.min(8, v.length + 1)} className={inp} value={v.join("\n")} onChange={(e) => set(e.target.value.split("\n"))} /></label>;
    const move = (i: number, d: number) => { const a = [...v]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(a); };
    return (
      <div>
        {k && <p className="mb-2 text-sm font-semibold">{P[k] ?? pretty(k)}</p>}
        {v.map((it: any, i: number) => (
          <details key={i} className="mb-3 rounded border border-black/20 bg-white p-4">
            <summary className="cursor-pointer font-medium">{it.name || it.question || it.title || (it.text && String(it.text).slice(0, 50)) || `Νέο στοιχείο ${i + 1}`}</summary>
            <div className="mt-4 space-y-4"><Node k="" v={it} set={(x) => set(v.map((y: any, j: number) => (j === i ? x : y)))} />
              <div className="flex flex-wrap gap-2 border-t border-black/10 pt-4"><button className={btn} onClick={() => move(i, -1)}>↑ Πάνω</button><button className={btn} onClick={() => move(i, 1)}>↓ Κάτω</button><button className={`${btn} ml-auto text-red-700`} onClick={() => confirm("Να διαγραφεί αυτό το στοιχείο;") && set(v.filter((_: any, j: number) => j !== i))}>Διαγραφή</button></div></div>
          </details>
        ))}
        <button className={btn} onClick={() => set([...v, blank(v[0] ?? {})])}>+ Προσθήκη νέου</button>
      </div>
    );
  }
  if (v && typeof v === "object") {
    const body = <div className="space-y-4">{Object.entries(v).map(([kk, vv]) => <Node key={kk} k={kk} v={vv} set={(x) => set({ ...v, [kk]: x })} />)}</div>;
    return k ? <details className="rounded border border-black/20 bg-white p-4"><summary className="cursor-pointer font-semibold">{P[k] ?? pretty(k)}</summary><div className="mt-4">{body}</div></details> : body;
  }
  return <Field k={k} v={v} set={set} />;
}

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [saved, setSaved] = useState("");
  const [sha, setSha] = useState("");
  const [tab, setTab] = useState("packages");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [login, setLogin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const dirty = data !== null && JSON.stringify(data) !== saved;

  async function load() {
    const r = await fetch("/api/admin/content").then((x) => x.json()).catch(() => ({ ok: false, message: "Σφάλμα δικτύου" }));
    if (r.ok) {
      if (!r.data.media) {
        const rv = (r.data.photos || []).filter((p: any) => p.video_url).map((p: any) => ({ title: p.title, video_url: p.video_url, visible: true }));
        r.data.media = { hero_video: "", reels: rv.length ? rv : [{ title: "", video_url: "", visible: false }] };
      }
      if (!r.data.banner) r.data.banner = { text: "", link: "", visible: false };
      if (!r.data.posts) r.data.posts = seedPosts;
      if (!r.data.mixes) r.data.mixes = [{ title: "Greek Deep House Mix", url: "https://soundcloud.com/djmario_k-814023128/greek-deep-house-mix-by-dj", description: "", visible: true }];
      if (!r.data.reviews) r.data.reviews = [{ name: "", stars: 5, text: "", date: "", visible: false }];
      setData(r.data); setSaved(JSON.stringify(r.data)); setSha(r.sha); setLogin(false); setMsg(null);
    } else { setLogin(true); if (r.message !== "Μη εξουσιοδοτημένο.") setMsg({ ok: false, t: r.message }); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  async function doLogin() {
    const r = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password: pw }) }).then((x) => x.json());
    if (r.ok) load(); else setMsg({ ok: false, t: r.message });
  }
  async function logout() {
    if (dirty && !confirm("Έχεις αλλαγές που δεν αποθηκεύτηκαν. Έξοδος;")) return;
    await fetch("/api/admin/login", { method: "DELETE" });
    setData(null); setLogin(true); setPw("");
  }
  async function migrateImages() {
    if (dirty) { setMsg({ ok: false, t: "Αποθήκευσε πρώτα τις αλλαγές σου πριν από τη μεταφορά φωτογραφιών." }); return; }
    setMigrating(true); setMsg(null);
    const r = await fetch("/api/admin/migrate-images", { method: "POST" }).then((x) => x.json()).catch(() => ({ ok: false, message: "Σφάλμα δικτύου κατά τη μεταφορά." }));
    setMigrating(false);
    if (r.ok) { await load(); setMsg({ ok: true, t: r.message }); }
    else setMsg({ ok: false, t: r.message || "Αποτυχία μεταφοράς φωτογραφιών." });
  }

  async function save() {
    setSaving(true); setMsg(null);
    const r = await fetch("/api/admin/content", { method: "PUT", body: JSON.stringify({ data, sha }) }).then((x) => x.json()).catch(() => ({ ok: false, message: "Σφάλμα δικτύου" }));
    setSaving(false);
    if (r.ok) { setSha(r.sha); setSaved(JSON.stringify(data)); setMsg({ ok: true, t: "Αποθηκεύτηκε. Οι αλλαγές θα φανούν στο site σε 1–2 λεπτά." }); }
    else setMsg({ ok: false, t: r.message });
  }

  if (login) return (
    <main className="mx-auto max-w-sm px-5 py-24 text-black">
      <h1 className="text-2xl font-bold">MARIO K · Διαχείριση</h1>
      <input type="password" placeholder="Κωδικός" className={`${inp} mt-6`} value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doLogin()} />
      <button className={`${btn} mt-3`} onClick={doLogin}>Είσοδος</button>
      {msg && <p className="mt-4 text-sm text-red-700">{msg.t}</p>}
    </main>
  );
  if (!data) return <main className="p-10 text-black">{msg?.t || "Φόρτωση…"}</main>;

  return (
    <Ctx.Provider value={data.eventTypes}>
      <div className="min-h-screen bg-[#f7f5f0] text-black">
        <header className="sticky top-0 z-10 border-b border-black bg-white">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-5 py-3">
            <strong className="text-sm uppercase tracking-widest">MARIO K · Διαχείριση</strong>
            <a href="/" target="_blank" className="text-xs underline">Προβολή site ↗</a>
            <button onClick={logout} className="text-xs underline">Έξοδος</button>
            <button onClick={save} disabled={!dirty || saving} className="ml-auto rounded bg-[#c2a86a] px-5 py-2 text-xs font-bold uppercase disabled:opacity-40">{saving ? "Αποθήκευση…" : dirty ? "Αποθήκευση αλλαγών" : "Όλα αποθηκευμένα"}</button>
          </div>
          <nav className="mx-auto flex max-w-4xl gap-2 overflow-x-auto whitespace-nowrap px-5 pb-3">
            {tabs.map(([t, l]) => <button key={t} onClick={() => setTab(t)} className={`${btn} ${tab === t ? "bg-black text-white" : ""}`}>{l}</button>)}
          </nav>
        </header>
        <main className="mx-auto max-w-4xl px-5 py-8">
          {msg && <p className={`mb-6 rounded border p-4 text-sm ${msg.ok ? "border-green-700 bg-green-50 text-green-900" : "border-red-700 bg-red-50 text-red-900"}`}>{msg.t}</p>}
          {dirty && <p className="mb-6 text-xs text-black/60">Έχεις αλλαγές που δεν έχουν αποθηκευτεί.</p>}
          {tab === "reviews" && <p className="mb-6 text-sm text-black/70">Βάλε τις κριτικές όπως ακριβώς τις έγραψαν οι πελάτες. Τικάρισε «Εμφάνιση στο site» για να εμφανιστεί η κάθε μία.</p>}
          {tab === "photos" && <section className="mb-6 rounded border border-black/15 bg-white p-4"><h2 className="font-semibold">Βιβλιοθήκη φωτογραφιών</h2><p className="mt-2 text-sm text-black/70">Μεταφέρει τις παλιές φωτογραφίες από Base44 στη φιλοξενία του site, ενημερώνει τις καταχωρίσεις και προσθέτει αρχικό alt text για SEO. Γίνεται μία συγκεντρωτική ενημέρωση του site.</p><button className={`${btn} mt-3`} disabled={migrating || dirty} onClick={migrateImages}>{migrating ? "Μεταφορά φωτογραφιών…" : "Μεταφορά παλιών φωτογραφιών από Base44"}</button>{dirty && <p className="mt-2 text-xs text-amber-800">Αποθήκευσε πρώτα τις αλλαγές για να ενεργοποιηθεί η μεταφορά.</p>}</section>}
          <Node k="" v={data[tab]} set={(x) => setData({ ...data, [tab]: x })} />
          <p className="mt-10 text-xs text-black/50">Εικόνες έως 4MB. Για βίντεο βάλε link. Οι αλλαγές ανεβαίνουν στο GitHub και το site ενημερώνεται μόνο του.</p>
        </main>
      </div>
    </Ctx.Provider>
  );
}
