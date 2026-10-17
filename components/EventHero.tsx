"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { slugOf, copy, waLink, shortLabel } from "@/lib/events";

type Ev = { id: string; name: string; image_url: string | null };

export default function EventHero({ events, headline, text, image, eyebrow, cta, wa, video }: { wa: string; video?: string; events: Ev[]; headline: string; text: string; image: string; eyebrow: string; cta: string }) {
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
    <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-black text-white">
      <div className="absolute inset-y-0 right-0 w-full md:w-[62%]">
        {video ? <video src={video} poster={bg} autoPlay muted loop playsInline className="hero-par h-full w-full object-cover object-[50%_20%] grayscale" /> : <img key={bg} src={bg} alt="" className="hero-par h-full w-full object-cover object-[50%_20%] grayscale" />}
        <div className="absolute inset-0 opacity-70 mix-blend-multiply transition-colors duration-500" style={{ background: "linear-gradient(180deg, var(--accent), #0b0620 90%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent md:bg-gradient-to-r md:from-black md:via-black/35 md:to-transparent" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-5 pb-10 md:justify-center md:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">{eyebrow}</p>
          <h1 className="mt-5 text-3xl font-bold leading-[1.15] md:text-[2.6rem]" style={{ fontFamily: "var(--font-comfortaa), var(--font-inter), sans-serif" }}>{c ? c.h : headline}</h1>
          <p className="mt-5 line-clamp-2 max-w-md text-sm leading-7 text-white/75">{c ? c.t : text}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href={ev ? `/booking?event=${ev}` : "/booking"} className="bg-white px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition hover:opacity-90">{cta}</Link>
            <Link href="/paketa" className="text-[11px] uppercase tracking-[0.18em] text-white/80 transition hover:text-white">Δείτε τα πακέτα →</Link>
            <a href={waLink(wa, ev)} target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-[0.18em] text-white/80 transition hover:text-white">WhatsApp →</a>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
        <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/55">Για ποια εκδήλωση ψάχνεις DJ;</p>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0">
          {chips.map((e) => {
            const s = slugOf(e.name);
            return <button key={s} onClick={() => pick(s)} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] transition ${ev === s ? "border-white bg-white text-black" : "border-white/30 text-white/85 hover:border-white"}`}>{shortLabel[s] ?? e.name}</button>;
          })}
        </div>
      </div>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 z-20 h-12 w-full" aria-hidden="true"><path d="M0 80V56h600c50 0 60-32 120-32s70 32 120 32h600v24z" fill="#fff" /></svg>
    </section>
  );
}
