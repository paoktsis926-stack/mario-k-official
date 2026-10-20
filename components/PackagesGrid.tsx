"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Points } from "./Ui";
import { slugOf } from "@/lib/events";

export default function PackagesGrid({ packages, eventTypes }: { packages: any[]; eventTypes: any[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {packages.map((k) => {
        const servedEvents = eventTypes.filter((event) => k.slugs?.includes(slugOf(event.name)));
        return (
          <article key={k.name} className={`flex flex-col border p-8 ${k.highlight ? "border-gold bg-gold/[0.06]" : "border-black"}`}>
            {servedEvents.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2" aria-label="Κατηγορίες εκδηλώσεων">
                {servedEvents.map((event: any) => (
                  <span key={event.id} className="border border-gold px-2 py-1 text-[10px] uppercase tracking-wider text-gold">{event.name}</span>
                ))}
              </div>
            )}
            {k.tagline && <p className="label-caps text-gold">{k.tagline}</p>}
            <h2 className="mt-1 text-2xl font-semibold uppercase">{k.name}</h2>
            <p className="mt-4 text-3xl font-light">{k.price_text}</p>
            <p className="mt-1 text-sm text-gold">{k.duration}</p>
            {k.best_for && <p className="mt-5 text-sm text-[#555]">{k.best_for}</p>}
            <Points items={k.features} />
            {k.extras?.length > 0 && (
              <>
                <p className="label-caps mt-8 text-black/50">Προαιρετικά extras</p>
                <p className="mt-2 text-xs leading-6 text-[#555]">{k.extras.join(" · ")}</p>
              </>
            )}
            <Link href={`/booking?package=${encodeURIComponent(k.name)}`} className="mt-8 block bg-black px-5 py-4 text-center text-xs uppercase tracking-[0.18em] text-white transition hover:bg-gold hover:text-black">Επιλογή πακέτου</Link>
          </article>
        );
      })}
    </div>
  );
}
