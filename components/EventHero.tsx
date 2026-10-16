"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { slugOf, copy } from "@/lib/events";

type Ev = { id: string; name: string; image_url: string | null };

export default function EventHero({ events, headline, text, image, eyebrow, cta }: { events: Ev[]; headline: string; text: string; image: string; eyebrow: string; cta: string }) {
  const [ev, setEv] = useState("");
  useEffect(() => { setEv(document.documentElement.dataset.event || ""); }, []);

  function pick(s: string) {
    const next = ev === s ? "" : s;
    setEv(next);
    const root = document.documentElement;
    try {
      if (next) { root.dataset.event = next; localStorage.setItem("ev", next); history.replaceState(null, "", `?event=${next}`); }
      else { delete root.dataset.event; localStorage.removeItem("ev"); history.replaceState(null, "", location.pathname); }
    } catch {}
  }

  const chips = events.filter((e, i, a) => a.findIndex((x) => slugOf(x.name) === slugOf(e.name)) === i);
  const cur = events.find((e) => slugOf(e.name) === ev);
  const c = ev ? copy[ev] : null;
  const bg = cur?.image_url || image;

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-black px-6 pb-28 pt-16 text-center text-white">
      <img key={bg} src={bg} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
      <div className="absolute inset-0 opacity-90 mix-blend-multiply transition-colors duration-500" style={{ background: "linear-gradient(160deg, var(--accent), #0b0620 85%)" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      <div className="relative z-10 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.35em] text-white/80">{eyebrow}</p>
        <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl" style={{ fontFamily: "var(--font-comfortaa), var(--font-inter), sans-serif" }}>{c ? c.h : headline}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/85 md:text-base">{c ? c.t : text}</p>
        <p className="mt-8 text-[11px] uppercase tracking-[0.25em] text-white/70">Για ποια εκδήλωση ψάχνεις DJ;</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {chips.map((e) => {
            const s = slugOf(e.name);
            return <button key={s} onClick={() => pick(s)} className={`rounded-full border px-4 py-2 text-xs tracking-wide transition ${ev === s ? "border-white bg-white text-black" : "border-white/50 text-white hover:border-white"}`}>{e.name}</button>;
          })}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 md:flex-row">
          <Link href={ev ? `/booking?event=${ev}` : "/booking"} className="bg-white px-8 py-4 text-xs uppercase tracking-[0.2em] text-black transition hover:opacity-90">{cta}</Link>
          <Link href="/paketa" className="border border-white/70 px-8 py-4 text-xs uppercase tracking-[0.2em] transition hover:bg-white hover:text-black">Δείτε τα πακέτα</Link>
        </div>
      </div>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-14 w-full" aria-hidden="true"><path d="M0 80V56h600c50 0 60-32 120-32s70 32 120 32h600v24z" fill="#fff" /></svg>
    </section>
  );
}
