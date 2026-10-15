/* eslint-disable @next/next/no-img-element */
import { site, photos, eventName } from "@/lib/content";
import { PageHero, Cta } from "@/components/Ui";

export const metadata = { title: "Φωτογραφίες & Gallery — MARIO K" };
const p = site.photos;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Gallery" title={p.title} subtitle={p.subtitle} intro={p.intro} />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((x) => (
            <figure key={x.title} className="border border-black">
              {x.video_url ? (
                <video src={x.video_url} controls preload="metadata" playsInline className="aspect-[4/3] w-full bg-black object-cover" />
              ) : (
                <img src={x.image_url!} alt={x.title} loading="lazy" className="aspect-[4/3] w-full object-cover grayscale" />
              )}
              <figcaption className="p-4">
                <p className="label-caps text-gold">{eventName(x.event_type_id)}</p>
                <p className="mt-1 text-sm">{x.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <Cta title="Η δική σας εκδήλωση, η επόμενη." text="Στείλτε μας ημερομηνία και περιοχή για να ελέγξουμε τη διαθεσιμότητα." button="Ζητήστε Διαθεσιμότητα" />
    </>
  );
}
