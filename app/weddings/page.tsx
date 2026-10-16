
const packages = [
  {
    name: "Essential",
    price: "450€",
    duration: "Έως 6 ώρες",
    description: "Για έναν γάμο με προσεγμένη μουσική και προσωπικό χαρακτήρα.",
    features: [
      "DJ και μουσική κάλυψη",
      "Συνεννόηση πριν από την εκδήλωση",
      "Μουσικές προτιμήσεις και λίστα τραγουδιών προς αποφυγή",
      "Συντονισμός βασικών μουσικών στιγμών",
    ],
  },
  {
    name: "Party",
    price: "650€",
    duration: "Έως 7 ώρες",
    description: "Για μια ολοκληρωμένη γαμήλια βραδιά με περισσότερο χρόνο για διασκέδαση.",
    features: [
      "DJ και μουσική κάλυψη",
      "Συνάντηση πριν από τον γάμο",
      "Προσωποποιημένες μουσικές επιλογές",
      "Συντονισμός βασικών μουσικών στιγμών",
    ],
  },
  {
    name: "Signature",
    price: "850€",
    duration: "Έως 8 ώρες",
    description: "Για τη γαμήλια δεξίωση με έμφαση στη μουσική εμπειρία.",
    features: [
      "DJ και μουσική κάλυψη",
      "Αναλυτική μουσική προετοιμασία",
      "Προσωποποιημένη μουσική προσέγγιση",
      "Συντονισμός βασικών μουσικών στιγμών",
    ],
  },
];

export default function WeddingsPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#F5F1E8]">
      <header className="border-b border-white/10 px-6 py-6 md:px-16">
        <a
          href="/"
          className="text-sm tracking-widest text-[#C7A66A]"
        >
          ← MARIO K OFFICIAL
        </a>
      </header>

      <section className="px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs tracking-[0.35em] text-[#C7A66A]">
            WEDDING DJ EXPERIENCE
          </p>

          <h1 className="mt-7 max-w-4xl text-5xl font-light leading-tight md:text-8xl">
            Η μουσική της δικής σας
            <span className="text-[#C7A66A]"> ιστορίας.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-8 text-white/50 md:text-base">
            Κάθε γάμος έχει τη δική του ατμόσφαιρα. Επιλέξτε το
            πακέτο που ταιριάζει στη δική σας ημέρα και στις στιγμές
            που θέλετε να θυμάστε.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-16 md:pb-32">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {packages.map((pkg, index) => (
            <article
              key={pkg.name}
              className={`flex flex-col border p-7 md:p-8 ${
                index === 1
                  ? "border-[#C7A66A]/70 bg-[#C7A66A]/[0.04]"
                  : "border-white/10"
              }`}
            >
              <p className="text-xs tracking-[0.25em] text-[#C7A66A]">
                {index === 0
                  ? "01 / ESSENTIAL"
                  : index === 1
                  ? "02 / PARTY"
                  : "03 / SIGNATURE"}
              </p>

              <h2 className="mt-6 text-3xl font-light">
                {pkg.name}
              </h2>

              <p className="mt-4 text-4xl font-light">
                {pkg.price}
              </p>

              <p className="mt-2 text-sm text-[#C7A66A]">
                {pkg.duration}
              </p>

              <p className="mt-6 min-h-16 text-sm leading-7 text-white/50">
                {pkg.description}
              </p>

              <div className="my-7 border-t border-white/10" />

              <ul className="flex-1 space-y-4">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm leading-6 text-white/70"
                  >
                    <span className="text-[#C7A66A]">—</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`/booking?event=wedding&package=${encodeURIComponent(pkg.name)}`}
                className="mt-9 block border border-[#C7A66A]/60 px-5 py-4 text-center text-xs tracking-[0.18em] text-[#C7A66A] transition hover:bg-[#C7A66A] hover:text-black"
              >
                ΕΠΙΛΟΓΗ ΠΑΚΕΤΟΥ
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-7 text-xs tracking-widest text-white/35 md:px-16">
        MARIO K OFFICIAL
      </footer>
    </main>
  );
}
