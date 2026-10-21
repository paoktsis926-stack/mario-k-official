/* eslint-disable @next/next/no-img-element */
import { site } from "@/lib/content";
import { PageHero, Cta, Points } from "@/components/Ui";

export const metadata = {
  title: "Σχετικά με τον DJ MARIO K | Εμπειρία & Εκδηλώσεις",
  description: "Γνωρίστε τον MARIO K, επαγγελματία DJ για γάμους, βαπτίσεις, private parties και εταιρικές εκδηλώσεις στην Αλεξανδρούπολη και σε όλη την Ελλάδα.",
  alternates: { canonical: "/sxetika" },
};
const a = site.about;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Σχετικά" title={a.title} subtitle={a.subtitle} intro={a.intro} />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1fr_1.4fr] md:px-8 md:py-24">
        <img src={a.portrait} alt="MARIO K" className="w-full object-cover grayscale" />
        <div>
          <h2 className="text-2xl font-bold uppercase">{a.bio_title}</h2>
          {a.bio_text.split("\n\n").map((t: string) => <p key={t.slice(0, 20)} className="mt-5 text-sm leading-7 text-[#444]">{t}</p>)}
          <h2 className="mt-12 text-2xl font-bold uppercase">{a.experience_title}</h2>
          <p className="mt-5 text-sm leading-7 text-[#444]">{a.experience_text}</p>
          <Points items={a.experience_points} />
        </div>
      </section>
      <section className="bg-black px-5 py-20 text-white md:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold uppercase">{a.philosophy_title}</h2>
            <p className="mt-5 text-sm leading-7 text-white/65">{a.philosophy_text}</p>
            <h3 className="mt-10 text-base font-semibold uppercase text-gold">{a.set_title}</h3>
            <Points items={a.set_points} dark />
          </div>
          <div>
            <h2 className="text-2xl font-bold uppercase">{a.process_title}</h2>
            <p className="mt-5 text-sm leading-7 text-white/65">{a.process_text}</p>
            <ol className="mt-6 space-y-4">
              {a.process_steps.map((s: string, i: number) => (
                <li key={s} className="flex gap-4 text-sm leading-relaxed text-white/75"><span className="text-gold">0{i + 1}</span><span>{s}</span></li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <h2 className="text-2xl font-bold uppercase">{a.values_title}</h2>
          <Points items={a.values_text.split("\n")} />
        </div>
        <div>
          <h2 className="text-2xl font-bold uppercase">{a.areas_title}</h2>
          <Points items={a.areas_points} />
          <p className="mt-6 text-sm leading-7 text-[#555]">{a.areas_note}</p>
        </div>
      </section>
      <Cta title={a.cta_title} text={a.cta_text} button={a.cta_button} />
    </>
  );
}
