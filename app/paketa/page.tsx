import Link from "next/link";
import { site, packages, eventTypes } from "@/lib/content";
import { PageHero, Cta, Points } from "@/components/Ui";

export const metadata = { title: "Πακέτα Υπηρεσιών — MARIO K" };
const p = site.packages;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Πακέτα" title={p.title} subtitle={p.subtitle} intro={p.intro} />
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
        <p className="mb-10 border border-white/15 p-6 text-sm leading-relaxed text-white/60">{p.note}</p>
        <div className="grid gap-5 lg:grid-cols-3">
          {packages.map((k) => (
            <article key={k.name} className={`flex flex-col border p-8 ${k.highlight ? "border-gold bg-gold/[0.05]" : "border-white/15"}`}>
              <p className="label-caps text-gold">{k.tagline}</p>
              <h2 className="mt-3 text-3xl font-normal">{k.name}</h2>
              <p className="mt-4 text-3xl font-light">{k.price}€</p>
              <p className="mt-1 text-sm text-gold">{k.duration}</p>
              <p className="mt-5 text-sm text-white/60">Ιδανικό για: {k.best_for}</p>
              <Points items={k.features} />
              <p className="label-caps mt-8 text-white/45">Προαιρετικά extras</p>
              <p className="mt-2 text-xs leading-6 text-white/60">{k.extras.join(" · ")}</p>
              <p className="mt-4 text-xs text-white/45">{k.event_types.map((id) => eventTypes.find((e) => e.id === id)?.name).filter(Boolean).join(" · ")}</p>
              <Link href={`/booking?package=${k.name}`} className="mt-8 block border border-white/15 px-5 py-4 text-center text-xs uppercase tracking-[0.18em] transition hover:bg-gold hover:text-black">Επιλογή πακέτου</Link>
            </article>
          ))}
        </div>
      </section>
      <Cta title={p.cta_title} text={p.cta_text} button={p.cta_button} />
    </>
  );
}
