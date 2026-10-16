
const packages = [
  { name: "Basic", price: "150€" },
  { name: "Party", price: "250€" },
  { name: "VIP", price: "300€" },
];

export default function BachelorettePage() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#F5F1E8]">
      <header className="border-b border-white/10 px-6 py-6 md:px-16">
        <a href="/" className="text-sm tracking-widest text-[#C7A66A]">
          ← MARIO K OFFICIAL
        </a>
      </header>

      <section className="px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs tracking-[0.35em] text-[#C7A66A]">
            BACHELORETTE PARTY
          </p>
          <h1 className="mt-7 max-w-4xl text-5xl font-light leading-tight md:text-8xl">
            Η βραδιά σας.
            <span className="text-[#C7A66A]"> Οι κανόνες σας.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-8 text-white/50 md:text-base">
            Μουσική και διασκέδαση για ένα ιδιωτικό bachelorette,
            προσαρμοσμένο στη δική σας παρέα.
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
                0{index + 1} / PACKAGE
              </p>
              <h2 className="mt-6 text-3xl font-light">{pkg.name}</h2>
              <p className="mt-5 text-4xl font-light">{pkg.price}</p>
              <div className="mt-8 border-t border-white/10" />
              <a
                href={`/booking?event=bachelorette&package=${encodeURIComponent(pkg.name)}`}
                className="mt-8 block border border-[#C7A66A]/60 px-5 py-4 text-center text-xs tracking-[0.18em] text-[#C7A66A] transition hover:bg-[#C7A66A] hover:text-black"
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
