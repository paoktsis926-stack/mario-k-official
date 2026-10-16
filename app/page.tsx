/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { site, eventTypes, packages, photos, faq, reviews, GOOGLE_REVIEW_URL } from "@/lib/content";
import { Cta, Faqs, Points, outline } from "@/components/Ui";

const h = site.home;

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[88vh] items-end justify-center bg-black px-6 pb-24 text-center text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${h.hero_image})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        <div className="relative z-10 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">{h.hero_eyebrow}</p>
          <h1 className="mt-6 font-[family-name:var(--font-script)] text-4xl font-bold leading-tight md:text-6xl" style={{ fontFamily: "var(--font-comfortaa)" }}>{h.hero_headline}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/75 md:text-base">{h.hero_text}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 md:flex-row">
            <Link href="/paketa" className="bg-gold px-8 py-4 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-white">{h.hero_cta}</Link>
            <Link href="/booking" className={`px-8 py-4 text-xs uppercase tracking-[0.2em] ${outline}`}>{h.hero_cta_secondary}</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <p className="label-caps text-gold">Εκδηλώσεις</p>
        <h2 className="mt-4 text-3xl font-bold uppercase md:text-5xl">{h.event_title}</h2>
        <span className="mt-6 block h-[3px] w-16 bg-gold" />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#555] md:text-base">{h.event_text}</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((e) => (
            <Link key={e.id} href="/booking" className="group relative block aspect-[4/3] overflow-hidden bg-black">
              {e.image_url && <img src={e.image_url} alt={e.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-90" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-lg font-bold uppercase">{e.name}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/70">{e.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-black bg-[#f7f5f0] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="label-caps text-gold">Πακέτα</p>
          <h2 className="mt-4 text-3xl font-bold uppercase md:text-5xl">{h.packages_title}</h2>
          <span className="mt-6 block h-[3px] w-16 bg-gold" />
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#555] md:text-base">{h.packages_text}</p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {packages.map((p) => (
              <article key={p.name} className={`flex flex-col border bg-white p-8 ${p.highlight ? "border-gold" : "border-black"}`}>
                {p.highlight && <p className="label-caps text-gold">{p.tagline}</p>}
                <h3 className="mt-2 text-2xl font-bold uppercase">{p.name}</h3>
                <p className="mt-3 text-4xl font-light">{p.price}€</p>
                <p className="mt-1 text-sm text-gold">{p.duration}</p>
                <p className="mt-4 flex-1 text-sm text-[#555]">{p.best_for}</p>
                <Link href={`/booking?package=${p.name}`} className="mt-6 block border border-black px-5 py-4 text-center text-xs uppercase tracking-[0.18em] transition hover:bg-black hover:text-white">Επιλογή</Link>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#555]">Οι τιμές είναι ενδεικτικές. <Link href="/paketa" className="underline">Δείτε αναλυτικά τα πακέτα</Link></p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <p className="label-caps text-gold">Highlights</p>
        <h2 className="mt-4 text-3xl font-bold uppercase md:text-5xl">{h.photos_title}</h2>
        <span className="mt-6 block h-[3px] w-16 bg-gold" />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#555] md:text-base">{h.photos_text}</p>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.filter((p) => p.image_url).slice(0, 4).map((p) => (
            <img key={p.title} src={p.image_url!} alt={p.title} loading="lazy" className="aspect-square w-full object-cover grayscale" />
          ))}
        </div>
        <Link href="/gallery" className="mt-8 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Όλο το υλικό ↗</Link>
      </section>

      <section className="bg-black px-5 py-20 text-white md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="label-caps text-gold">Γιατί MARIO K</p>
          <h2 className="mt-4 text-3xl font-bold uppercase md:text-5xl">{h.why_title}</h2>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/60 md:text-base">{h.why_text}</p>
          <Points items={h.why_points} dark />
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="border-t border-black bg-[#f7f5f0] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="label-caps text-gold">Κριτικές</p>
            <h2 className="mt-4 text-3xl font-bold uppercase md:text-5xl">Τι λένε οι πελάτες μας</h2>
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

      <section className="mx-auto max-w-4xl px-5 py-20 md:py-28">
        <p className="label-caps text-gold">FAQ</p>
        <h2 className="mt-4 text-3xl font-bold uppercase md:text-5xl">{h.faq_title}</h2>
        <p className="mb-10 mt-6 text-sm leading-relaxed text-[#555]">{h.faq_text}</p>
        <Faqs items={faq.slice(0, 5)} />
        <Link href="/syxnes-erotiseis" className="mt-8 inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Όλες οι ερωτήσεις ↗</Link>
      </section>

      <Cta title={h.cta_title} text={h.cta_text} button={h.cta_button} />
    </>
  );
}
