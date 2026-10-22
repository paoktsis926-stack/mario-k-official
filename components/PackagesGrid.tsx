"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Points } from "./Ui";
import { slugOf } from "@/lib/events";
import { packageSlug } from "@/lib/packageSlug";

export default function PackagesGrid({ packages, eventTypes }: { packages: any[]; eventTypes: any[] }) {
  const [selectedEvent, setSelectedEvent] = useState("");
  const visiblePackages = useMemo(
    () => selectedEvent
      ? packages.filter((pkg) => pkg.slugs?.includes(selectedEvent))
      : packages,
    [packages, selectedEvent],
  );

  return (
    <div>
      <section className="mb-10 border border-black bg-white p-6 md:p-8" aria-labelledby="package-finder-title">
        <p className="label-caps text-gold">Βρείτε το κατάλληλο πακέτο</p>
        <h2 id="package-finder-title" className="mt-3 text-xl font-semibold uppercase md:text-2xl">Για ποια εκδήλωση ενδιαφέρεστε;</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#555]">Επιλέξτε τον τύπο της εκδήλωσης για να δείτε μόνο τα πακέτα που αντιστοιχούν σε αυτήν.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="package-event-filter" className="sr-only">Τύπος εκδήλωσης</label>
          <select
            id="package-event-filter"
            value={selectedEvent}
            onChange={(event) => setSelectedEvent(event.target.value)}
            className="min-h-12 w-full border border-black/20 bg-white px-4 text-sm text-black sm:max-w-md"
          >
            <option value="">Όλες οι εκδηλώσεις</option>
            {eventTypes.map((event: any) => (
              <option key={event.id} value={slugOf(event.name)}>{event.name}</option>
            ))}
          </select>
          {selectedEvent && (
            <button type="button" onClick={() => setSelectedEvent("")} className="min-h-12 border border-black px-5 text-xs uppercase tracking-wider transition hover:bg-black hover:text-white">
              Εμφάνιση όλων
            </button>
          )}
        </div>
        <p className="mt-4 text-xs text-[#666]" aria-live="polite">
          {selectedEvent ? `Βρέθηκαν ${visiblePackages.length} ${visiblePackages.length === 1 ? "πακέτο" : "πακέτα"} για την εκδήλωσή σας.` : `Διαθέσιμα πακέτα: ${packages.length}.`}
        </p>
      </section>

      {visiblePackages.length ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {visiblePackages.map((k) => {
            const servedEvents = eventTypes.filter((event) => k.slugs?.includes(slugOf(event.name)));
            const detailsHref = `/paketa/${packageSlug(k.name)}`;
            const bookingHref = `/booking?${selectedEvent ? `event=${encodeURIComponent(selectedEvent)}&` : ""}package=${encodeURIComponent(k.name)}`;
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
                <h3 className="mt-1 text-2xl font-semibold uppercase">{k.name}</h3>
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
                <div className="mt-auto flex flex-col gap-3 pt-8">
                  <Link href={detailsHref} className="block border border-black px-5 py-4 text-center text-xs uppercase tracking-[0.18em] transition hover:border-gold hover:text-gold">Αναλυτικές πληροφορίες</Link>
                  <Link href={bookingHref} className="block bg-black px-5 py-4 text-center text-xs uppercase tracking-[0.18em] text-white transition hover:bg-gold hover:text-black">Επιλογή πακέτου</Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-black/15 p-8 text-sm leading-6 text-[#555]">
          Δεν βρέθηκε πακέτο για αυτήν την κατηγορία. Επιλέξτε «Όλες οι εκδηλώσεις» ή στείλτε αίτημα για να εξετάσουμε τις ανάγκες σας.
          <div className="mt-5"><Link href="/booking" className="inline-block bg-black px-5 py-4 text-xs uppercase tracking-wider text-white">Στείλτε αίτημα</Link></div>
        </div>
      )}
    </div>
  );
}
