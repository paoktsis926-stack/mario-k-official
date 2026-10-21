import { site, photos, eventTypes } from "@/lib/content";
import { PageHero, Cta } from "@/components/Ui";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata = {
  title: "Φωτογραφίες από Εκδηλώσεις & DJ Sets | MARIO K",
  description: "Δείτε φωτογραφίες από γάμους, βαπτίσεις, private parties και εταιρικές εκδηλώσεις με DJ MARIO K.",
  alternates: { canonical: "/gallery" },
};
const p = site.photos;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Gallery" title={p.title} subtitle={p.subtitle} intro={p.intro} />
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
        <GalleryGrid photos={photos} eventTypes={eventTypes} />
      </section>
      <Cta title="Η δική σας εκδήλωση, η επόμενη." text="Στείλτε μας ημερομηνία και περιοχή για να ελέγξουμε τη διαθεσιμότητα." button="Ζητήστε Διαθεσιμότητα" />
    </>
  );
}
