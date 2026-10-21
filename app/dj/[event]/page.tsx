/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { site, eventTypes, faq, reviews, g } from "@/lib/content";
import { getPackages } from "@/lib/hubCatalog";
import { slugOf, copy, lpSlugs, lpLabel, waLink } from "@/lib/events";
import { Faqs, Points } from "@/components/Ui";
import BookLink from "@/components/BookLink";
import SetTheme from "@/components/SetTheme";

export function generateStaticParams() {
  return Object.keys(lpSlugs).map((event) => ({ event }));
}

export async function generateMetadata({ params }: { params: Promise<{ event: string }> }) {
  const event = (await params).event;
  const slug = lpSlugs[event];
  const ev = slug ? eventTypes.find((e) => slugOf(e.name) === slug) : undefined;
  return slug ? {
    title: `DJ για ${lpLabel[slug]} στην Αλεξανδρούπολη & τον Έβρο — MARIO K`,
    description: copy[slug].t,
    alternates: { canonical: `/dj/${event}` },
    openGraph: {
      title: `DJ για ${lpLabel[slug]} — MARIO K`,
      description: copy[slug].t,
      type: "website",
      ...(ev?.image_url ? { images: [{ url: ev.image_url, alt: `DJ για ${lpLabel[slug]} στην Αλεξανδρούπολη` }] } : {}),
    },
  } : { robots: { index: false, follow: true } };
}

export default async function Page({ params }: { params: Promise<{ event: string }> }) {
  const lp = (await params).event;
  const slug = lpSlugs[lp];
  if (!slug) notFound();
  const ev = eventTypes.find((e) => slugOf(e.name) === slug);
  const packages = await getPackages();
  const pk = packages.filter((p) => p.slugs.includes(slug));
  const list = pk.length ? pk : packages;
  const btn = "px-7 py-4 text-[11px] uppercase tracking-[0.18em] transition";
  return (
    <>
      <SetTheme slug={slug} />
      <section className="relative flex min-h-[80svh] items-end overflow-hidden bg-black px-5 pb-16 text-white md:items-center md:px-8">
        <img src={ev?.image_url || site.home.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
        <div className="absolute inset-0 opacity-70 mix-blend-multiply" style={{ background: "linear-gradient(180deg, var(--accent), #0b0620 90%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:bg-gradient-to-r md:from-black md:via-black/60" />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/80">DJ για {lpLabel[slug]} · Αλεξανδρούπολη & Έβρος</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl" style={{ fontFamily: "var(--font-comfortaa), var(--font-inter), sans-serif" }}>{copy[slug].h}</h1>
            <p className="mt-4 text-sm leading-7 text-white/85">{copy[slug].t}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <BookLink event={slug} lp={`lp-${lp}`} className={`${btn} bg-white text-black hover:opacity-90`}>Ζητήστε προσφορά</BookLink>
              <a href={waLink(g.whatsapp, slug)} target="_blank" rel="noopener noreferrer" className={`${btn} border border-white/70 hover:bg-white hover:text-black`}>WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="label-caps text-gold">Γιατί MARIO K</p>
        <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">{site.home.why_title}</h2>
        <Points items={site.home.why_points} />
      </section>

      <section className="border-y border-black bg-[#f7f5f0] px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="label-caps text-gold">Πακέτα</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {list.map((p) => (
              <article key={p.name} className={`flex flex-col border bg-white p-7 ${p.highlight ? "border-gold" : "border-black"}`}>
                <h3 className="text-xl font-semibold uppercase">{p.name}</h3>
                <p className="mt-2 text-3xl font-light">{p.price_text}</p>
                <p className="mt-1 text-sm text-gold">{p.duration}</p>
                <p className="mt-4 flex-1 text-sm text-[#555]">{p.best_for}</p>
                <BookLink event={slug} pkg={p.name} lp={`lp-${lp}`} className="mt-6 block bg-black px-5 py-4 text-center text-xs uppercase tracking-[0.18em] text-white hover:bg-gold hover:text-black">Επιλογή</BookLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <p className="label-caps text-gold">Κριτικές</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <figure key={r.name + r.text.slice(0, 10)} className="border border-black p-6">
                <p className="text-gold">{"★".repeat(Math.max(1, Math.min(5, r.stars)))}</p>
                <blockquote className="mt-3 text-sm leading-7 text-[#444]">{r.text}</blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-[0.15em]">{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <p className="label-caps mb-6 text-gold">Συχνές ερωτήσεις</p>
        <Faqs items={faq.slice(0, 4)} />
      </section>

      <section className="bg-black px-5 py-16 text-center text-white">
        <h2 className="mx-auto max-w-2xl text-2xl font-semibold md:text-4xl" style={{ fontFamily: "var(--font-comfortaa), var(--font-inter), sans-serif" }}>Κλείστε την ημερομηνία σας</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/70">Στείλτε ημερομηνία και περιοχή και θα ελέγξουμε διαθεσιμότητα.</p>
        <BookLink event={slug} lp={`lp-${lp}`} className={`${btn} mt-8 inline-block bg-gold text-black hover:opacity-90`}>Ζητήστε προσφορά</BookLink>
      </section>
    </>
  );
}
