import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackages } from "@/lib/hubCatalog";
import { eventTypes, site } from "@/lib/content";
import { PageHero, Cta, Points } from "@/components/Ui";
import { packageSlug } from "@/lib/packageSlug";
import { slugOf } from "@/lib/events";

type Props = { params: Promise<{ slug: string }> };

async function findPackage(slug: string) {
  const packages = await getPackages();
  return packages.find((pkg) => packageSlug(pkg.name) === slug);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const pkg = await findPackage(slug);
  if (!pkg) return { title: "Πακέτο DJ | MARIO K" };
  return {
    title: `${pkg.name} — Πακέτο DJ | MARIO K`,
    description: `${pkg.name}: ${pkg.duration || "Μουσική κάλυψη"} με παροχές για την εκδήλωσή σας. Δείτε τις λεπτομέρειες και στείλτε αίτημα ενδιαφέροντος.`,
    alternates: { canonical: `/paketa/${packageSlug(pkg.name)}` },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const [pkg, packages] = await Promise.all([findPackage(slug), getPackages()]);
  if (!pkg) notFound();

  const servedEvents = eventTypes.filter((event) => pkg.slugs?.includes(slugOf(event.name)));
  const bookingHref = `/booking?package=${encodeURIComponent(pkg.name)}`;
  const p = site.packages;

  return (
    <>
      <PageHero eyebrow="Αναλυτική παρουσίαση πακέτου" title={pkg.name} subtitle={pkg.tagline || "Πακέτο υπηρεσιών MARIO K"} intro={pkg.best_for || "Δείτε τις παροχές και τη διάρκεια του πακέτου."} />
      <section className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-20">
        <Link href="/paketa" className="mb-8 inline-flex text-xs uppercase tracking-[0.16em] text-[#555] transition hover:text-gold">← Όλα τα πακέτα</Link>
        <div className={`border p-6 md:p-10 ${pkg.highlight ? "border-gold bg-gold/[0.05]" : "border-black"}`}>
          <div className="flex flex-col gap-4 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-caps text-gold">MARIO K · DJ & Entertainment</p>
              <h2 className="mt-3 text-2xl font-semibold uppercase md:text-3xl">{pkg.name}</h2>
              {pkg.duration && <p className="mt-2 text-sm text-[#555]">Διάρκεια: {pkg.duration}</p>}
            </div>
            <p className="text-3xl font-light">{pkg.price_text}</p>
          </div>

          {servedEvents.length > 0 && (
            <div className="border-b border-black/10 py-6">
              <h3 className="label-caps text-black/60">Κατάλληλο για</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {servedEvents.map((event) => <span key={event.id} className="border border-gold px-3 py-2 text-xs">{event.name}</span>)}
              </div>
            </div>
          )}

          <div className="grid gap-8 py-7 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Τι περιλαμβάνει</h3>
              <Points items={pkg.features || []} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Προαιρετικές πρόσθετες υπηρεσίες</h3>
              {pkg.extras?.length ? (
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[#555]">
                  {pkg.extras.map((extra: string) => <li key={extra} className="border-b border-black/10 pb-3">• {extra}</li>)}
                </ul>
              ) : <p className="mt-4 text-sm leading-6 text-[#555]">Οι πρόσθετες υπηρεσίες εξετάζονται ανάλογα με τις ανάγκες της εκδήλωσης.</p>}
            </div>
          </div>

          <p className="border-t border-black/10 pt-5 text-xs leading-6 text-[#666]">{p.note}</p>
          <Link href={bookingHref} className="mt-6 block bg-black px-5 py-4 text-center text-xs uppercase tracking-[0.18em] text-white transition hover:bg-gold hover:text-black">Συνέχεια με αυτό το πακέτο</Link>
        </div>
        {packages.length > 1 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold uppercase">Σύγκριση με άλλα πακέτα</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {packages.filter((other) => other.name !== pkg.name).map((other) => (
                <Link key={other.name} href={`/paketa/${packageSlug(other.name)}`} className="flex items-center justify-between gap-4 border border-black/15 p-4 transition hover:border-gold">
                  <span className="text-sm font-medium">{other.name}</span>
                  <span className="whitespace-nowrap text-sm">{other.price_text} ↗</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      <Cta title={p.cta_title} text={p.cta_text} button={p.cta_button} />
    </>
  );
}
