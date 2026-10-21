import { site } from "@/lib/content";
import { PageHero, Cta, Points } from "@/components/Ui";

export const metadata = {
  title: "Περιοχές Κάλυψης DJ | Αλεξανδρούπολη, Έβρος & Ελλάδα",
  description: "DJ και μουσική κάλυψη εκδηλώσεων στην Αλεξανδρούπολη, τον Έβρο, τη Θράκη, τη Θεσσαλονίκη και σε όλη την Ελλάδα κατόπιν συνεννόησης.",
  alternates: { canonical: "/synergazomenoi-xoroi" },
};
const v = site.venues;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Χώροι" title={v.title} subtitle={v.subtitle} intro={v.intro} />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <h2 className="text-2xl font-bold uppercase">{v.sourcing_title}</h2>
          <p className="mt-5 text-sm leading-7 text-[#444]">{v.sourcing_text}</p>
          <Points items={v.sourcing_points} />
        </div>
        <div className="border border-black p-8">
          <h2 className="text-2xl font-bold uppercase">{v.coverage_title}</h2>
          <Points items={v.coverage_points} />
          <p className="mt-6 text-sm leading-7 text-[#555]">{v.coverage_note}</p>
        </div>
      </section>
      <Cta title={v.cta_title} text={v.cta_text} button={v.cta_button} />
    </>
  );
}
