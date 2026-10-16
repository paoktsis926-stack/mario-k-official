import { site, faq } from "@/lib/content";
import { PageHero, Cta, Faqs } from "@/components/Ui";

export const metadata = { title: "Συχνές Ερωτήσεις — MARIO K" };
const f = site.faq;
const cats = [...new Set(faq.map((x) => x.category))];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="FAQ" title={f.title} subtitle={f.subtitle} intro={f.intro} />
      <section className="mx-auto max-w-4xl px-5 py-12 md:py-20">
        {cats.map((c) => (
          <div key={c} className="mb-14">
            <h2 className="mb-4 text-xl font-bold uppercase">{c}</h2>
            <Faqs items={faq.filter((x) => x.category === c)} />
          </div>
        ))}
        <p className="text-sm text-white/60">{f.note}</p>
      </section>
      <Cta title="Έχετε άλλη απορία;" text={f.note} button="Επικοινωνία" />
    </>
  );
}
