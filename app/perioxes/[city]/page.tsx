import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const locations = {
  alexandroupoli: {
    name: "Αλεξανδρούπολη",
    title: "DJ στην Αλεξανδρούπολη για γάμους, βαπτίσεις και πάρτι",
    description: "DJ υπηρεσίες στην Αλεξανδρούπολη για γάμους, βαπτίσεις, γενέθλια, ιδιωτικά πάρτι και εταιρικές εκδηλώσεις, με μουσική προσαρμοσμένη στο κοινό και την ατμόσφαιρα της βραδιάς.",
    localText: "Για εκδηλώσεις στην Αλεξανδρούπολη, η μουσική ροή, η ηχητική κάλυψη και ο φωτισμός οργανώνονται με βάση τον χώρο, το πλήθος των καλεσμένων και το πρόγραμμα της βραδιάς. Στείλτε ημερομηνία και χώρο για να επιβεβαιωθεί η διαθεσιμότητα και οι τεχνικές ανάγκες.",
    planningText: "Πριν διαμορφωθεί η πρόταση, είναι χρήσιμο να γνωρίζουμε αν η εκδήλωση γίνεται σε αίθουσα, κτήμα, ξενοδοχείο ή εξωτερικό χώρο, καθώς και αν ο χώρος διαθέτει δικό του ηχητικό εξοπλισμό.",
  },
  komotini: {
    name: "Κομοτηνή",
    title: "DJ στην Κομοτηνή για γάμους και εκδηλώσεις",
    description: "Μουσική κάλυψη από DJ για γάμους, βαπτίσεις, ιδιωτικά πάρτι και εκδηλώσεις στην Κομοτηνή. Η επιλογή μουσικής και ο σχεδιασμός προσαρμόζονται στις ανάγκες κάθε εκδήλωσης.",
    localText: "Για εκδήλωση στην Κομοτηνή, η πρόταση διαμορφώνεται σύμφωνα με το είδος της διοργάνωσης, τον χώρο και τις μουσικές προτιμήσεις σας. Η διαθεσιμότητα και οι ανάγκες μετακίνησης ή εξοπλισμού επιβεβαιώνονται πριν από την οριστικοποίηση της προσφοράς.",
    planningText: "Για ακριβέστερη προσφορά, αναφέρετε τον χώρο, τον εκτιμώμενο αριθμό καλεσμένων, τη διάρκεια της μουσικής κάλυψης και αν απαιτούνται ηχεία, φωτισμός ή πρόσθετος εξοπλισμός.",
  },
  orestiada: {
    name: "Ορεστιάδα",
    title: "DJ στην Ορεστιάδα για γάμους, βαπτίσεις και πάρτι",
    description: "DJ για κοινωνικές και ιδιωτικές εκδηλώσεις στην Ορεστιάδα, με μουσική, ηχητική κάλυψη και φωτισμό ανάλογα με τον χώρο και το είδος της εκδήλωσης.",
    localText: "Για γάμους, βαπτίσεις και πάρτι στην Ορεστιάδα, το μουσικό πρόγραμμα και ο εξοπλισμός σχεδιάζονται βάσει του χώρου και του αριθμού καλεσμένων. Επικοινωνήστε με την ημερομηνία και τις βασικές λεπτομέρειες ώστε να ελεγχθούν διαθεσιμότητα και τεχνικές απαιτήσεις.",
    planningText: "Ο χώρος, ο αριθμός καλεσμένων και η ώρα έναρξης βοηθούν να υπολογιστούν οι ανάγκες ήχου και φωτισμού. Αν υπάρχει πρόγραμμα εισόδου, πρώτου χορού ή άλλων συγκεκριμένων στιγμών, μπορείτε να το αναφέρετε από την αρχή.",
  },
  samothraki: {
    name: "Σαμοθράκη",
    title: "DJ στη Σαμοθράκη για γάμους και ιδιωτικές εκδηλώσεις",
    description: "DJ υπηρεσίες για γάμους, πάρτι και ιδιωτικές εκδηλώσεις στη Σαμοθράκη. Η διαθεσιμότητα, η μεταφορά εξοπλισμού και οι τεχνικές ανάγκες επιβεβαιώνονται πριν από κάθε κράτηση.",
    localText: "Για εκδηλώσεις στη Σαμοθράκη, χρειάζεται έγκαιρη συνεννόηση για την ημερομηνία, τον χώρο και τη μεταφορά του εξοπλισμού. Πριν από την προσφορά επιβεβαιώνονται η διαθεσιμότητα, οι συνθήκες πρόσβασης και οι τεχνικές απαιτήσεις της εκδήλωσης.",
    planningText: "Επειδή η οργάνωση σε νησί μπορεί να απαιτεί πρόσθετο συντονισμό, επικοινωνήστε όσο το δυνατόν νωρίτερα και συμπεριλάβετε την ημερομηνία, την τοποθεσία, τη διάρκεια και τον εξοπλισμό που χρειάζεται ο χώρος.",
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
  const faqs = [
    {
      question: `Πώς μπορώ να μάθω αν ο MARIO K είναι διαθέσιμος για εκδήλωση στην ${item.name};`,
      answer: "Στείλτε αίτημα από τη φόρμα κράτησης με την ημερομηνία, τον χώρο και το είδος της εκδήλωσης. Η διαθεσιμότητα επιβεβαιώνεται πριν από οποιαδήποτε οριστικοποίηση.",
    },
    {
      question: "Τι πληροφορίες χρειάζονται για να λάβω προσφορά;",
      answer: "Χρήσιμα στοιχεία είναι η ημερομηνία, η τοποθεσία, το είδος της εκδήλωσης, ο εκτιμώμενος αριθμός καλεσμένων και η διάρκεια της μουσικής κάλυψης.",
    },
    {
      question: "Περιλαμβάνονται ήχος και φωτισμός;",
      answer: "Οι τεχνικές ανάγκες εξαρτώνται από τον χώρο, το μέγεθος της εκδήλωσης και τον υπάρχοντα εξοπλισμό. Οι απαιτήσεις και το αντίστοιχο κόστος επιβεβαιώνονται στην προσφορά.",
    },
    {
      question: "Μπορώ να ζητήσω συγκεκριμένα τραγούδια ή να δηλώσω μουσικές προτιμήσεις;",
      answer: "Ναι. Μπορείτε να αναφέρετε μουσικές προτιμήσεις, τραγούδια που θέλετε να ακουστούν και επιλογές που προτιμάτε να αποφευχθούν κατά την επικοινωνία.",
    },
  ];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: item.title,
        description: item.description,
        areaServed: { "@type": "City", name: item.name },
        provider: { "@type": "Person", name: "MARIO K" },
        serviceType: "DJ, μουσική και τεχνική κάλυψη εκδηλώσεων",
        url: `https://mario-k-official.vercel.app/perioxes/${city}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main className="bg-[#f5f2eb] text-[#111]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="bg-black px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="label-caps text-gold">MARIO K · DJ & Entertainment</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">{item.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">{item.description}</p>
          <Link href="/booking" className="mt-8 inline-block bg-[#c6a45a] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-black">Ζητήστε προσφορά</Link>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <h2 className="text-2xl font-semibold md:text-3xl">Μουσική και τεχνική κάλυψη για την εκδήλωσή σας στην {item.name}</h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-black/65">{item.localText}</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/65">{item.planningText}</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/65">Η μουσική, ο εξοπλισμός και το πρόγραμμα προσαρμόζονται στο είδος της εκδήλωσης, στον χώρο και στις προτιμήσεις σας. Για να ελέγξουμε τη διαθεσιμότητα, στείλτε την ημερομηνία, την τοποθεσία και λίγες πληροφορίες μέσω της φόρμας κράτησης.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/booking?event=wedding" className="border border-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white">Γάμος</Link>
          <Link href="/booking?event=baptism" className="border border-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white">Βάπτιση</Link>
          <Link href="/booking?event=private-party" className="border border-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white">Ιδιωτικό πάρτι</Link>
          <Link href="/booking?event=corporate" className="border border-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white">Εταιρική εκδήλωση</Link>
        </div>
      </section>
      <section className="border-t border-black/10 px-5 py-14 md:py-18">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold md:text-3xl">Συχνές ερωτήσεις για DJ στην {item.name}</h2>
          <div className="mt-7 divide-y divide-black/15 border-y border-black/15">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-semibold marker:hidden">{faq.question}<span aria-hidden="true" className="float-right text-gold group-open:rotate-45">+</span></summary>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-black/65">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/ypiresies" className="border-b border-[#c6a45a] pb-1">Υπηρεσίες DJ</Link>
            <Link href="/paketa" className="border-b border-[#c6a45a] pb-1">Πακέτα εκδηλώσεων</Link>
            <Link href="/odigos-mousikis-gamou" className="border-b border-[#c6a45a] pb-1">Οδηγός μουσικής γάμου</Link>
            <Link href="/booking" className="border-b border-[#c6a45a] pb-1">Έλεγχος διαθεσιμότητας</Link>
          </div>
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
