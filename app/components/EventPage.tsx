
type EventPageProps = {
  title: string;
  subtitle: string;
};

export default function EventPage({
  title,
  subtitle,
}: EventPageProps) {
  return (
    <main className="min-h-screen bg-[#080808] px-6 py-16 text-[#F5F1E8] md:px-16">
      <a
        href="/"
        className="text-sm tracking-widest text-[#C7A66A]"
      >
        ← MARIO K OFFICIAL
      </a>

      <section className="mx-auto max-w-4xl py-24 text-center">
        <p className="text-xs tracking-[0.35em] text-[#C7A66A]">
          MARIO K · DJ SERVICES
        </p>

        <h1 className="mt-8 text-4xl font-light md:text-6xl">
          {title}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/55">
          {subtitle}
        </p>

        <a
          href={`/booking?event=${title === "Γενέθλια" ? "birthday" : title === "Private Parties" ? "private-party" : title === "Corporate Events" ? "corporate" : "opening"}`}
          className="mt-10 inline-block border border-[#C7A66A]/60 px-8 py-5 text-xs tracking-[0.2em] text-[#C7A66A] hover:bg-[#C7A66A] hover:text-black"
        >
          ΖΗΤΗΣΤΕ ΠΡΟΣΦΟΡΑ
        </a>
      </section>

      <footer className="border-t border-white/10 pt-6 text-xs text-white/35">
        MARIO K OFFICIAL
      </footer>
    </main>
  );
}
