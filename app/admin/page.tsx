"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext<any[]>([]);
const IMG = /(image_url|video_url|portrait|logo_url|hero_image)$/;
const inp = "mt-1 w-full border border-black/30 bg-white p-2 text-sm text-black";
const btn = "border border-black px-3 py-1 text-xs hover:bg-black hover:text-white";
const tabs: [string, string][] = [["packages", "Πακέτα"], ["faq", "FAQ"], ["photos", "Φωτογραφίες"], ["services", "Υπηρεσίες"], ["eventTypes", "Εκδηλώσεις"], ["reviews", "Κριτικές Google"], ["site", "Κείμενα σελίδων"]];

const blank = (x: any): any =>
  Array.isArray(x) ? [] : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, blank(v)])) : typeof x === "number" ? 0 : typeof x === "boolean" ? false : "";

function Field({ k, v, set }: { k: string; v: any; set: (x: any) => void }) {
  const [busy, setBusy] = useState(false);
  if (typeof v === "boolean") return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} />{k}</label>;
  if (typeof v === "number") return <label className="block text-xs">{k}<input type="number" className={inp} value={v} onChange={(e) => set(Number(e.target.value))} /></label>;
  const s = v ?? "";
  async function upload(f: File) {
    setBusy(true);
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd }).then((x) => x.json()).catch(() => ({ ok: false, message: "Σφάλμα δικτύου" }));
    setBusy(false);
    r.ok ? set(r.url) : alert(r.message);
  }
  return (
    <label className="block text-xs">{k}
      {s.length > 80 || s.includes("\n") ? <textarea rows={4} className={inp} value={s} onChange={(e) => set(e.target.value)} /> : <input className={inp} value={s} readOnly={k === "id"} onChange={(e) => set(e.target.value)} />}
      {IMG.test(k) && (
        <span className="mt-1 flex items-center gap-3">
          {s && !/\.(mp4|mov)$/i.test(s) && /* eslint-disable-next-line @next/next/no-img-element */ <img src={s} alt="" className="h-12 w-12 object-cover" />}
          <input type="file" accept="image/*" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          {busy && "Ανεβαίνει…"}
        </span>
      )}
    </label>
  );
}

function Node({ k, v, set }: { k: string; v: any; set: (x: any) => void }) {
  const events = useContext(Ctx);
  if (k === "event_type_id") return <label className="block text-xs">Εκδήλωση<select className={inp} value={v ?? ""} onChange={(e) => set(e.target.value)}><option value="">—</option>{events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></label>;
  if (k === "event_types" && Array.isArray(v)) return <div className="text-xs">Για ποιες εκδηλώσεις<div className="mt-1 grid gap-1">{events.map((e) => <label key={e.id} className="flex gap-2 text-sm"><input type="checkbox" checked={v.includes(e.id)} onChange={(c) => set(c.target.checked ? [...v, e.id] : v.filter((x: string) => x !== e.id))} />{e.name}</label>)}</div></div>;
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x === "string"))
      return <label className="block text-xs">{k} (μία γραμμή ανά στοιχείο)<textarea rows={Math.min(8, v.length + 1)} className={inp} value={v.join("\n")} onChange={(e) => set(e.target.value.split("\n"))} /></label>;
    const move = (i: number, d: number) => { const a = [...v]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(a); };
    return (
      <div>
        {k && <p className="text-xs font-bold uppercase">{k}</p>}
        {v.map((it, i) => (
          <details key={i} className="my-2 border border-black/30 bg-white p-3">
            <summary className="cursor-pointer text-sm font-medium">{it.name || it.question || it.title || `#${i + 1}`}</summary>
            <div className="mt-3 space-y-3"><Node k="" v={it} set={(x) => set(v.map((y: any, j: number) => (j === i ? x : y)))} />
              <div className="flex gap-2"><button className={btn} onClick={() => move(i, -1)}>↑</button><button className={btn} onClick={() => move(i, 1)}>↓</button><button className={btn} onClick={() => confirm("Διαγραφή;") && set(v.filter((_: any, j: number) => j !== i))}>Διαγραφή</button></div></div>
          </details>
        ))}
        <button className={btn} onClick={() => set([...v, blank(v[0] ?? {})])}>+ Προσθήκη</button>
      </div>
    );
  }
  if (v && typeof v === "object")
    return <div className="space-y-3">{Object.entries(v).map(([kk, vv]) => <Node key={kk} k={kk} v={vv} set={(x) => set({ ...v, [kk]: x })} />)}</div>;
  return <Field k={k} v={v} set={set} />;
}

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [sha, setSha] = useState("");
  const [tab, setTab] = useState("packages");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [login, setLogin] = useState(false);

  async function load() {
    const r = await fetch("/api/admin/content").then((x) => x.json()).catch(() => ({ ok: false, message: "Σφάλμα δικτύου" }));
    if (r.ok) { if (!r.data.reviews) r.data.reviews = [{ name: "", stars: 5, text: "", date: "", visible: false }]; setData(r.data); setSha(r.sha); setLogin(false); setMsg(""); } else { setLogin(true); setMsg(r.message === "Μη εξουσιοδοτημένο." ? "" : r.message); }
  }
  useEffect(() => { load(); }, []);

  async function doLogin() {
    const r = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password: pw }) }).then((x) => x.json());
    r.ok ? load() : setMsg(r.message);
  }
  async function save() {
    setMsg("Αποθήκευση…");
    const r = await fetch("/api/admin/content", { method: "PUT", body: JSON.stringify({ data, sha }) }).then((x) => x.json()).catch(() => ({ ok: false, message: "Σφάλμα δικτύου" }));
    if (r.ok) { setSha(r.sha); setMsg("✓ Αποθηκεύτηκε. Το site ενημερώνεται σε 1–2 λεπτά."); } else setMsg(r.message);
  }

  if (login) return (
    <main className="mx-auto max-w-sm px-5 py-24 text-black">
      <h1 className="text-2xl font-bold">Admin</h1>
      <input type="password" placeholder="Κωδικός" className={inp} value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doLogin()} />
      <button className={`${btn} mt-3`} onClick={doLogin}>Είσοδος</button>
      {msg && <p className="mt-4 text-sm text-red-700">{msg}</p>}
    </main>
  );
  if (!data) return <main className="p-10 text-black">{msg || "Φόρτωση…"}</main>;

  return (
    <Ctx.Provider value={data.eventTypes}>
      <main className="mx-auto max-w-4xl px-5 py-10 text-black">
        <div className="sticky top-0 z-10 -mx-5 flex flex-wrap items-center gap-2 border-b border-black bg-white px-5 py-3">
          {tabs.map(([t, l]) => <button key={t} onClick={() => setTab(t)} className={`${btn} ${tab === t ? "bg-black text-white" : ""}`}>{l}</button>)}
          <button onClick={save} className="ml-auto bg-[#c2a86a] px-5 py-2 text-xs font-bold uppercase">Αποθήκευση</button>
        </div>
        {msg && <p className="mt-4 text-sm">{msg}</p>}
        <div className="mt-6 space-y-3"><Node k="" v={data[tab]} set={(x) => setData({ ...data, [tab]: x })} /></div>
        <p className="mt-10 text-xs text-black/50">Οι εικόνες ανεβαίνουν στο GitHub (έως 4MB). Βίντεο: βάλε link.</p>
      </main>
    </Ctx.Provider>
  );
}
