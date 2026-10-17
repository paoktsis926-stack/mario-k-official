import { site, packages, eventTypes } from "@/lib/content";
import { PageHero, Cta } from "@/components/Ui";
import PackagesGrid from "@/components/PackagesGrid";

export const metadata = { title: "Πακέτα Υπηρεσιών — MARIO K" };
const p = site.packages;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Πακέτα" title={p.title} subtitle={p.subtitle} intro={p.intro} />
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
        <p className="mb-10 border border-black p-6 text-sm leading-relaxed text-[#555]">{p.note}</p>
        <PackagesGrid packages={packages} eventTypes={eventTypes} />
      </section>
      <Cta title={p.cta_title} text={p.cta_text} button={p.cta_button} />
    </>
  );
}
