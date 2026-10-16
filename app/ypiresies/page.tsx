import { site, services } from "@/lib/content";
import { PageHero, Cta } from "@/components/Ui";

export const metadata = { title: "Υπηρεσίες — MARIO K" };
const s = site.services;

function Group({ title, text, cat }: { title: string; text: string; cat: string }) {
  return (
    <div className="mt-16">
      <h2 className="text-xl font-semibold uppercase md:text-2xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#555]">{text}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.filter((x) => x.category === cat).map((x) => (
          <div key={x.name} className="border border-black p-7">
            <p className="label-caps text-gold">{x.tagline}</p>
            <h3 className="mt-3 text-lg font-bold">{x.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Υπηρεσίες" title={s.title} subtitle={s.subtitle} intro={s.intro.replace(/\s+([.,])/g, "$1")} />
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <Group title={s.personal_title} text={s.personal_text} cat="personal" />
        <Group title={s.partners_title} text={s.partners_text} cat="partner" />
        <p className="mt-8 border border-black p-6 text-sm leading-relaxed text-[#555]">{s.partners_notice}</p>
      </section>
      <Cta title={s.cta_title} text={s.cta_text} button={s.cta_button} />
    </>
  );
}
