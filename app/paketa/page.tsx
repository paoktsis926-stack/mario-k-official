import { site, eventTypes } from "@/lib/content";
import { getPackages } from "@/lib/hubCatalog";
import { PageHero, Cta } from "@/components/Ui";
import PackagesGrid from "@/components/PackagesGrid";

export const metadata = {
  title: "Πακέτα DJ για Γάμους, Βαπτίσεις & Πάρτι | MARIO K",
  description: "Δείτε πακέτα DJ για γάμους, βαπτίσεις, γενέθλια, bachelor και ιδιωτικά πάρτι. Επιλογές διάρκειας και υπηρεσιών με εξατομικευμένη προσφορά.",
  alternates: { canonical: "/paketa" },
};
const p = site.packages;

export default async function Page() {
  const packages = await getPackages();
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
