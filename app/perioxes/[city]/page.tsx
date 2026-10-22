import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const locations = {
  alexandroupoli: {
    name: "Αλεξανδρούπολη",
    title: "DJ στην Αλεξανδρούπολη για γάμους, βαπτίσεις και πάρτι",
    description: "DJ υπηρεσίες στην Αλεξανδρούπολη για γάμους, βαπτίσεις, γενέθλια, ιδιωτικά πάρτι και εταιρικές εκδηλώσεις, με μουσική προσαρμοσμένη στο κοινό και την ατμόσφαιρα της βραδιάς.",
  },
  komotini: {
    name: "Κομοτηνή",
    title: "DJ στην Κομοτηνή για γάμους και εκδηλώσεις",
    description: "Μουσική κάλυψη από DJ για γάμους, βαπτίσεις, ιδιωτικά πάρτι και εκδηλώσεις στην Κομοτηνή. Η επιλογή μουσικής και ο σχεδιασμός προσαρμόζονται στις ανάγκες κάθε εκδήλωσης.",
  },
  orestiada: {
    name: "Ορεστιάδα",
    title: "DJ στην Ορεστιάδα για γάμους, βαπτίσεις και πάρτι",
    description: "DJ για κοινωνικές και ιδιωτικές εκδηλώσεις στην Ορεστιάδα, με μουσική, ηχητική κάλυψη και φωτισμό ανάλογα με τον χώρο και το είδος της εκδήλωσης.",
  },
  samothraki: {
    name: "Σαμοθράκη",
    title: "DJ στη Σαμοθράκη για γάμους και ιδιωτικές εκδηλώσεις",
    description: "DJ υπηρεσίες για γάμους, πάρτι και ιδιωτικές εκδηλώσεις στη Σαμοθράκη. Η διαθεσιμότητα, η μεταφορά εξοπλισμού και οι τεχνικές ανάγκες επιβεβαιώνονται πριν από κάθε κράτηση.",
  },
} as const;

type CitySlug = keyof typeof locations;

export function generateStaticParams() {
  return Object.keys(locations).map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  if (!(city in locations)) return { title: "Περιοχή — MARIO K", robots: { index: false, follow: true } };
  const item = locations[city as CitySlug];
  return {
    title: `${item.title} | MARIO K`,
    description: item.description,
    alternates: { canonical: `/perioxes/${city}` },
    openGraph: { title: item.title, description: item.description, url: `/perioxes/${city}`, type: "website" },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  if (!(city in locations)) notFound();
  const item = locations[city as CitySlug];
  const otherCities = Object.entries(locations).filter(([slug]) => slug !== city);
  return (
    <main className="bg-[#f5f2eb] text-[#111]">
      <section className="bg-black px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="label-caps text-gold">MARIO K · DJ & Entertainment</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">{item.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">{item.description}</p>
          <Link href="/booking" className="mt-8 inline-block bg-[#c6a45a] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-black">Ζητήστε προσφορά</Link>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <h2 className="text-2xl font-semibold md:text-3xl">Μουσική και τεχνική κάλυψη για την εκδήλωσή σας</h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-black/65">Η μουσική, ο εξοπλισμός και το πρόγραμμα διαμορφώνονται με βάση το είδος της εκδήλωσης, τον χώρο και τις προτιμήσεις σας. Για να ελέγξουμε τη διαθεσιμότητα, στείλτε την ημερομηνία, την τοποθεσία και λίγες πληροφορίες για την εκδήλωση μέσω της φόρμας κράτησης.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/booking?event=wedding" className="border border-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white">Γάμος</Link>
          <Link href="/booking?event=baptism" className="border border-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white">Βάπτιση</Link>
          <Link href="/booking?event=private-party" className="border border-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white">Ιδιωτικό πάρτι</Link>
          <Link href="/booking?event=corporate" className="border border-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white">Εταιρική εκδήλωση</Link>
        </div>
      </section>
      <section className="border-y border-black/10 bg-white px-5 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-semibold">Περιοχές εξυπηρέτησης</h2>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            {otherCities.map(([slug, location]) => <Link key={slug} href={`/perioxes/${slug}`} className="border-b border-[#c6a45a] pb-1 text-sm">{location.name}</Link>)}
          </div>
        </div>
      </section>
    </main>
  );
}
