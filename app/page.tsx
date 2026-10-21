/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { site, eventTypes, packages as staticPackages, photos, faq, reviews, mixes, g, media, reels, GOOGLE_REVIEW_URL } from "@/lib/content";
import { Cta, Faqs, Points, outline } from "@/components/Ui";
import MixEmbed from "@/components/MixEmbed";
import { getPackages } from "@/lib/hubCatalog";
import EventHero from "@/components/EventHero";
import Reels from "@/components/Reels";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { slugOf } from "@/lib/events";

export const metadata = {
  title: "DJ στην Αλεξανδρούπολη για Γάμους, Βαπτίσεις & Πάρτι | MARIO K",
  description: "Επαγγελματίας DJ στην Αλεξανδρούπολη και τον Έβρο για γάμους, βαπτίσεις, bachelor parties, γενέθλια και ιδιωτικές εκδηλώσεις. Μουσική, ήχος και φωτισμός.",
  alternates: { canonical: "/" },
};

const h = site.home;

export default async function Home() {
  const packages = await getPackages().catch(() => staticPackages);
  return (
    <div className="site-home">
      <EventHero events={eventTypes} headline={h.hero_headline} text={h.hero_text} image={h.hero_image} imageAlt={h.hero_image_alt} eyebrow={h.hero_eyebrow} cta={h.hero_cta_secondary} wa={g.whatsapp} video={media.hero_video} />

      <div className="overflow-x-auto border-y border-black bg-black py-4 text-white">
        <p className="mx-auto flex w-max items-center gap-6 px-6 text-[11px] uppercase tracking-[0.25em] text-white/70">
          {eventTypes.map((e, i) => <span key={e.id} className="flex items-center gap-6">{i > 0 && <span className="text-gold">◆</span>}{e.name}</span>)}
        </p>
      </div>

      <section className="home-events mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="label-caps text-gold">Εκδηλώσεις & πακέτα</p>
        <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{h.event_title}</h2>
        <span className="mt-6 block h-[3px] w-16 bg-gold" />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#555] md:text-base">{h.event_text}</p>
        <div className="mt-10 space-y-8 md:space-y-10">
          {eventTypes.map((e) => {
            const slug = slugOf(e.name);
            const matchingPackages = packages.filter((p) => p.slugs.includes(slug));
            return (
              <section key={e.id} className="overflow-hidden border border-black/10 bg-white">
                <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-56 bg-black md:min-h-72">
                    {e.image_url && <Image src={e.image_url} alt={e.image_alt || `DJ για ${e.name} στην Αλεξανδρούπολη και τον Έβρο`} fill sizes="(max-width: 768px) 100vw, 40vw" loading="lazy" className="object-cover opacity-80" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                      <p className="label-caps text-gold">MARIO K · DJ & Entertainment</p>
                      <h3 className="mt-3 text-2xl font-semibold uppercase md:text-3xl">{e.name}</h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-white/75">{e.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col p-5 md:p-8">
                    <p className="label-caps text-gold">Διαθέσιμα πακέτα</p>
                    {matchingPackages.length ? (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {matchingPackages.map((p) => (
                          <article key={p.name} className={`flex flex-col border p-4 ${p.highlight ? "border-gold bg-[#faf7ef]" : "border-black/10"}`}>
                            <h4 className="text-base font-semibold uppercase">{p.name}</h4>
                            <p className="mt-2 text-2xl font-light">{p.price_text}</p>
                            {p.duration && <p className="mt-1 text-xs text-gold">{p.duration}</p>}
                            {p.best_for && <p className="mt-3 flex-1 text-sm leading-6 text-[#555]">{p.best_for}</p>}
                            {p.features?.length > 0 && <ul className="mt-3 space-y-1 text-xs leading-5 text-[#555]">{p.features.slice(0, 3).map((feature) => <li key={feature}>— {feature}</li>)}</ul>}
                            <Link href={`/booking?event=${slug}&package=${encodeURIComponent(p.name)}`} className="mt-5 inline-flex min-h-11 items-center justify-center border border-black bg-black px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:border-gold hover:bg-gold hover:text-black">Επιλογή πακέτου</Link>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-[#555]">Στείλτε τα στοιχεία της εκδήλωσής σας για να λάβετε εξατομικευμένη πρόταση.</p>
                    )}
                    <Link href={`/booking?event=${slug}`} className="mt-5 inline-flex min-h-11 w-fit items-center border-b border-gold pb-1 text-xs font-semibold uppercase tracking-[0.16em]">Έλεγχος διαθεσιμότητας για {e.name} ↗</Link>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="reveal home-about mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[2fr_3fr] md:gap-16 md:px-8 md:py-20">
        <Image src={site.about.portrait} alt={site.about.portrait_alt || "MARIO K, επαγγελματίας DJ για γάμους και εκδηλώσεις"} width={900} height={1125} sizes="(max-width: 768px) 100vw, 40vw" loading="lazy" className="aspect-[4/5] w-full object-cover grayscale" />
        <div>
          <p className="label-caps text-gold">Ο DJ</p>
          <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{site.about.bio_title}</h2>
          <span className="mt-6 block h-px w-14 bg-gold" />
          <p className="mt-6 text-sm leading-7 text-[#555] md:text-base">{site.about.bio_text.split("\n\n")[0]}</p>
          <Points items={site.about.experience_points.slice(0, 3)} />
          <Link href="/sxetika" className="mt-8 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Γνωρίστε με καλύτερα ↗</Link>
        </div>
      </section>

      <section className="reveal home-highlights mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="label-caps text-gold">Highlights</p>
        <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{h.photos_title}</h2>
        <span className="mt-6 block h-[3px] w-16 bg-gold" />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#555] md:text-base">{h.photos_text}</p>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.filter((p) => p.image_url).slice(0, 4).map((p) => (
            <Image key={p.title} src={p.image_url!} alt={p.image_alt || `Φωτογραφία εκδήλωσης DJ MARIO K: ${p.title}`} width={600} height={600} sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" className="aspect-square w-full object-cover grayscale" />
          ))}
        </div>
        <Link href="/gallery" className="mt-8 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Όλο το υλικό ↗</Link>
      </section>

      <section className="reveal home-process border-y border-black bg-[#f7f5f0] px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="label-caps text-gold">Πώς δουλεύουμε</p>
          <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{site.about.process_title}</h2>
          <span className="mt-6 block h-px w-14 bg-gold" />
          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            {site.about.process_steps.slice(0, 4).map((t: string, i: number) => (
              <li key={t} className="border border-black bg-white p-6"><span className="text-3xl font-light text-gold">0{i + 1}</span><p className="mt-3 text-sm leading-6 text-[#555]">{t}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {reels.length > 0 && (
        <section className="reveal home-reels mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <p className="label-caps text-gold">Reels</p>
          <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">Η ατμόσφαιρα σε κίνηση</h2>
          <span className="mt-6 block h-px w-14 bg-gold" />
          <div className="mt-10"><Reels items={reels} /></div>
        </section>
      )}

      {mixes.length > 0 && (
        <section className="reveal home-mixes mx-auto max-w-4xl px-5 py-14 md:py-20">
          <p className="label-caps text-gold">Mixes</p>
          <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">Άκου τον ήχο</h2>
          <span className="mt-6 block h-px w-14 bg-gold" />
          <div className="mt-10"><MixEmbed url={mixes[0].url} title={mixes[0].title} /></div>
          <Link href="/mixes" className="mt-6 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Όλα τα mixes ↗</Link>
        </section>
      )}

      <section className="reveal bg-black px-5 py-20 text-white md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="label-caps text-gold">Γιατί MARIO K</p>
          <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{h.why_title}</h2>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/60 md:text-base">{h.why_text}</p>
          <Points items={h.why_points} dark />
        </div>
      </section>

      <Suspense fallback={null}><GoogleReviewsSection fallbackReviews={reviews} googleReviewUrl={GOOGLE_REVIEW_URL} /></Suspense>

      <section className="reveal home-faq mx-auto max-w-4xl px-5 py-14 md:py-20">
        <p className="label-caps text-gold">FAQ</p>
        <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{h.faq_title}</h2>
        <p className="mb-10 mt-6 text-sm leading-relaxed text-[#555]">{h.faq_text}</p>
        <Faqs items={faq.slice(0, 5)} />
        <Link href="/syxnes-erotiseis" className="mt-8 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Όλες οι ερωτήσεις ↗</Link>
      </section>

      <Cta title={h.cta_title} text={h.cta_text} button={h.cta_button} />
    </div>
  );
}
