/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { site, eventTypes, packages as staticPackages, photos, faq, reviews, mixes, g, media, reels, GOOGLE_REVIEW_URL } from "@/lib/content";
import { Cta, Faqs, Points, outline } from "@/components/Ui";
import MixEmbed from "@/components/MixEmbed";
import { getPackages } from "@/lib/hubCatalog";
import EventHero from "@/components/EventHero";
import Reels from "@/components/Reels";
import { slugOf } from "@/lib/events";

const h = site.home;

export default async function Home() {
  const packages = await getPackages().catch(() => staticPackages);
  return (
    <div className="site-home">
      <EventHero events={eventTypes} headline={h.hero_headline} text={h.hero_text} image={h.hero_image} eyebrow={h.hero_eyebrow} cta={h.hero_cta_secondary} wa={g.whatsapp} video={media.hero_video} />

      <div className="overflow-x-auto border-y border-black bg-black py-4 text-white">
        <p className="mx-auto flex w-max items-center gap-6 px-6 text-[11px] uppercase tracking-[0.25em] text-white/70">
          {eventTypes.map((e, i) => <span key={e.id} className="flex items-center gap-6">{i > 0 && <span className="text-gold">◆</span>}{e.name}</span>)}
        </p>
      </div>

      <section className="reveal home-events mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="label-caps text-gold">Εκδηλώσεις</p>
        <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{h.event_title}</h2>
        <span className="mt-6 block h-[3px] w-16 bg-gold" />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#555] md:text-base">{h.event_text}</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((e) => (
            <Link key={e.id} href={`/booking?event=${slugOf(e.name)}`} className="group relative block aspect-[4/3] overflow-hidden bg-black">
              {e.image_url && <img src={e.image_url} alt={e.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-90" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-base font-semibold uppercase">{e.name}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/70">{e.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="reveal home-about mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[2fr_3fr] md:gap-16 md:px-8 md:py-20">
        <img src={site.about.portrait} alt="MARIO K" loading="lazy" className="aspect-[4/5] w-full object-cover grayscale" />
        <div>
          <p className="label-caps text-gold">Ο DJ</p>
          <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{site.about.bio_title}</h2>
          <span className="mt-6 block h-px w-14 bg-gold" />
          <p className="mt-6 text-sm leading-7 text-[#555] md:text-base">{site.about.bio_text.split("\n\n")[0]}</p>
          <Points items={site.about.experience_points.slice(0, 3)} />
          <Link href="/sxetika" className="mt-8 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Γνωρίστε με καλύτερα ↗</Link>
        </div>
      </section>

      <section className="reveal home-packages border-y border-black bg-[#f7f5f0] px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="label-caps text-gold">Πακέτα</p>
          <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{h.packages_title}</h2>
          <span className="mt-6 block h-[3px] w-16 bg-gold" />
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#555] md:text-base">{h.packages_text}</p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {packages.map((p) => (
              <article key={p.name} className={`flex flex-col border bg-white p-8 ${p.highlight ? "border-gold" : "border-black"}`}>
                {p.highlight && <p className="label-caps text-gold">{p.tagline}</p>}
                <h3 className="mt-2 text-2xl font-bold uppercase">{p.name}</h3>
                <p className="mt-3 text-3xl font-light">{p.price_text}</p>
                <p className="mt-1 text-sm text-gold">{p.duration}</p>
                <p className="mt-4 flex-1 text-sm text-[#555]">{p.best_for}</p>
                <Link href={`/booking?package=${encodeURIComponent(p.name)}`} className="mt-6 block border border-black px-5 py-4 text-center text-xs uppercase tracking-[0.18em] transition hover:bg-black hover:text-white">Επιλογή</Link>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#555]">Οι τιμές είναι ενδεικτικές. <Link href="/paketa" className="underline">Δείτε αναλυτικά τα πακέτα</Link></p>
        </div>
      </section>

      <section className="reveal home-highlights mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="label-caps text-gold">Highlights</p>
        <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{h.photos_title}</h2>
        <span className="mt-6 block h-[3px] w-16 bg-gold" />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#555] md:text-base">{h.photos_text}</p>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.filter((p) => p.image_url).slice(0, 4).map((p) => (
            <img key={p.title} src={p.image_url!} alt={p.title} loading="lazy" className="aspect-square w-full object-cover grayscale" />
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

      {reviews.length > 0 && (
        <section className="reveal home-reviews border-t border-black bg-[#f7f5f0] px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="label-caps text-gold">Κριτικές</p>
            <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">Τι λένε οι πελάτες μας</h2>
            <span className="mt-6 block h-[3px] w-16 bg-gold" />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {reviews.map((r) => (
                <figure key={r.name + r.text.slice(0, 12)} className="flex flex-col border border-black bg-white p-8">
                  <p className="text-gold">{"★".repeat(Math.max(1, Math.min(5, r.stars)))}</p>
                  <blockquote className="mt-4 flex-1 text-sm leading-7 text-[#444]">{r.text}</blockquote>
                  <figcaption className="mt-6 text-xs uppercase tracking-[0.15em]">{r.name}<span className="ml-2 text-black/40">Google{r.date ? ` · ${r.date}` : ""}</span></figcaption>
                </figure>
              ))}
            </div>
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Γράψτε κι εσείς κριτική στο Google ↗</a>
          </div>
        </section>
      )}

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
