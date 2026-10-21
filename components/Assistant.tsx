"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };
const hello: Msg = { role: "assistant", content: "Γεια σας! Είμαι ο βοηθός του MARIO K. Πείτε μου τι εκδήλωση ετοιμάζετε και θα σας βοηθήσω με πακέτα, τιμές και το επόμενο βήμα." };

function Bubble({ m }: { m: Msg }) {
  const mm = m.content.match(/\[\[BOOK([^\]]*)\]\]/);
  const text = m.content.replace(/\[\[BOOK[^\]]*\]\]/, "").trim();
  const ev = mm?.[1].match(/event=([\w-]+)/)?.[1];
  const pkg = mm?.[1].match(/package=([^\s\]]+)/)?.[1];
  const date = mm?.[1].match(/date=(\d{4}-\d{2}-\d{2})/)?.[1];
  return (
    <div className={m.role === "user" ? "ml-8 text-right" : "mr-8"}>
      <p className={`inline-block whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-left text-sm leading-6 ${m.role === "user" ? "bg-black text-white" : "bg-[#f1efe9] text-black"}`}>{text}</p>
      {mm && <Link href={`/booking?event=${ev ?? ""}${pkg ? `&package=${encodeURIComponent(pkg)}` : ""}${date ? `&date=${date}` : ""}&src=ai`} className="mt-2 block rounded-full bg-gold px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-black">Ζητήστε προσφορά →</Link>}
    </div>
  );
}

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([hello]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open, busy]);

  async function send() {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: t }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(1) }) }).then((x) => x.json());
      setMsgs([...next, { role: "assistant", content: r.reply || r.message || "Κάτι πήγε στραβά, δοκιμάστε ξανά." }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Δεν μπόρεσα να απαντήσω. Καλέστε μας ή στείλτε μήνυμα στο WhatsApp." }]);
    }
    setBusy(false);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-28 right-3 z-50 flex h-[70vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-black/15 bg-white text-black shadow-2xl md:bottom-24 md:right-24 md:h-[480px]">
          <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
            <p className="text-sm font-semibold">Βοηθός MARIO K</p>
            <button onClick={() => setOpen(false)} aria-label="Κλείσιμο" className="text-lg leading-none text-white/70 hover:text-white">×</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => <Bubble key={i} m={m} />)}
            {busy && <p className="text-xs text-black/50">Γράφει…</p>}
            <div ref={end} />
          </div>
          <div className="flex gap-2 border-t border-black/10 p-3">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} maxLength={500} placeholder="Γράψτε εδώ…" className="min-w-0 flex-1 rounded-full border border-black/20 px-4 py-2 text-sm outline-none focus:border-gold" />
            <button onClick={send} disabled={busy} className="rounded-full bg-gold px-4 text-sm font-semibold text-black disabled:opacity-50">→</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="fixed bottom-16 right-3 z-40 rounded-full bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black shadow-lg md:bottom-8 md:right-24">{open ? "Κλείσιμο" : "Ρώτα τον βοηθό"}</button>
    </>
  );
}
