"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useEffect, useState } from "react";
import { Points } from "./Ui";
import EventChips from "./EventChips";
import { slugOf, applyTheme } from "@/lib/events";

export default function PackagesGrid({ packages, eventTypes }: { packages: any[]; eventTypes: any[] }) {
  const [ev, setEv] = useState("");
  useEffect(() => { setEv(document.documentElement.dataset.event || ""); }, []);
  const f = ev ? packages.filter((p) => p.slugs?.includes(ev)) : packages;
  const list = f.length ? f : packages;
  return (
    <>
      <EventChips events={eventTypes} value={ev} onChange={(s) => { setEv(s); applyTheme(s); }} />
      <div className="grid gap-5 lg:grid-cols-3">
        {list.map((k) => (
          <article key={k.name} className={`flex flex-col border p-8 ${k.highlight ? "border-gold bg-gold/[0.06]" : "border-black"}`}>
            <p className="label-caps text-gold">{k.tagline}</p>
            <h2 className="mt-3 text-2xl font-semibold uppercase">{k.name}</h2>
            <p className="mt-4 text-3xl font-light">{k.price_text}</p>
            <p className="mt-1 text-sm text-gold">{k.duration}</p>
            {k.best_for && <p className="mt-5 text-sm text-[#555]">{k.best_for}</p>}
            <Points items={k.features} />
            <p className="label-caps mt-8 text-black/50">Προαιρετικά extras</p>
            <p className="mt-2 text-xs leading-6 text-[#555]">{k.extras.join(" · ")}</p>
            <Link href={`/booking?${ev ? `event=${ev}&` : ""}package=${k.name}`} className="mt-8 block bg-black px-5 py-4 text-center text-xs uppercase tracking-[0.18em] text-white transition hover:bg-gold hover:text-black">Επιλογή πακέτου</Link>
          </article>
        ))}
      </div>
    </>
  );
}
