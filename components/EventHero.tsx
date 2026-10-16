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
    <section className="relative flex min-h-[calc(100svh-4.5rem)] items-end justify-center overflow-hidden bg-black px-5 pb-20 text-center text-white md:pb-24">
      <img key={bg} src={bg} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_18%] grayscale" />
      <div className="absolute inset-0 opacity-70 mix-blend-multiply transition-colors duration-500" style={{ background: "linear-gradient(180deg, var(--accent), #0b0620 90%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
      <div className="relative z-10 w-full max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/80">{eyebrow}</p>
        <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-5xl" style={{ fontFamily: "var(--font-comfortaa), var(--font-inter), sans-serif" }}>{c ? c.h : headline}</h1>
        <p className="mx-auto mt-3 line-clamp-2 max-w-xl text-xs leading-6 text-white/85 md:line-clamp-none md:text-sm md:leading-7">{c ? c.t : text}</p>
        <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-white/70">Για ποια εκδήλωση ψάχνεις DJ;</p>
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto whitespace-nowrap px-5 pb-1 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0">
          {chips.map((e) => {
            const s = slugOf(e.name);
            return <button key={s} onClick={() => pick(s)} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs transition ${ev === s ? "border-white bg-white text-black" : "border-white/50 text-white hover:border-white"}`}>{e.name}</button>;
          })}
        </div>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link href={ev ? `/booking?event=${ev}` : "/booking"} className="bg-white px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-black transition hover:opacity-90">{cta}</Link>
          <Link href="/paketa" className="border border-white/70 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:bg-white hover:text-black">Δείτε τα πακέτα</Link>
        </div>
      </div>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-12 w-full" aria-hidden="true"><path d="M0 80V56h600c50 0 60-32 120-32s70 32 120 32h600v24z" fill="#fff" /></svg>
    </section>
  );
}
