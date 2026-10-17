import { mixes, SOUNDCLOUD_PROFILE } from "@/lib/content";
import { PageHero, Cta } from "@/components/Ui";
import MixEmbed from "@/components/MixEmbed";

export const metadata = { title: "Mixes — MARIO K" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Mixes" title="Άκου τον ήχο" subtitle="Ο ήχος που θα ακούσετε στη δική σας βραδιά" intro="Λίγα από τα sets του MARIO K. Πάτησε play και δες αν ο ήχος σου ταιριάζει." />
      <section className="mx-auto max-w-4xl px-5 py-12 md:py-20">
        <div className="grid gap-8">
          {mixes.map((m) => (
            <div key={m.url}>
              <h2 className="mb-3 text-xl font-semibold">{m.title}</h2>
              {m.description && <p className="mb-3 text-sm text-[#555]">{m.description}</p>}
              <MixEmbed url={m.url} title={m.title} />
            </div>
          ))}
        </div>
        <a href={SOUNDCLOUD_PROFILE} target="_blank" rel="noopener noreferrer" className="mt-10 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Όλα τα mixes στο SoundCloud ↗</a>
      </section>
      <Cta title="Θέλεις αυτόν τον ήχο στη βραδιά σου;" text="Στείλε μας ημερομηνία και περιοχή για να ελέγξουμε διαθεσιμότητα." button="Ζητήστε Προσφορά" />
    </>
  );
}
