import Link from "next/link";

export const outline = "border border-gold/70 text-gold transition hover:bg-gold hover:text-black";

export function PageHero({ eyebrow, title, subtitle, intro }: { eyebrow: string; title: string; subtitle?: string; intro?: string }) {
  return (
    <section className="border-b border-white/15 bg-[#0b0b0b] text-[#e9e4d8]">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
        <p className="label-caps text-gold">{eyebrow}</p>
        <h1 className="mt-4 text-3xl font-normal leading-[1.05] tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 font-display text-xl italic text-gold md:text-2xl">{subtitle}</p>}
        <span className="mt-7 block h-px w-14 bg-gold" />
        {intro && <p className="mt-7 max-w-3xl text-sm leading-relaxed text-white/60 md:text-base">{intro}</p>}
      </div>
    </section>
  );
}

export function Cta({ title, text, button }: { title: string; text: string; button: string }) {
  return (
    <section className="bg-black px-5 py-20 text-center text-white md:py-28">
      <h2 className="mx-auto max-w-3xl text-3xl font-normal leading-tight tracking-tight md:text-4xl">{title}</h2>
      <span className="mx-auto mt-6 block h-px w-14 bg-gold" />
      <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">{text}</p>
      <Link href="/booking" className={`mt-9 inline-block px-8 py-4 text-xs uppercase tracking-[0.2em] ${outline}`}>{button}</Link>
    </section>
  );
}

export function Points({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((t) => (
        <li key={t} className={`flex gap-3 text-sm leading-relaxed ${dark ? "text-white/70" : "text-white/65"}`}>
          <span className="text-gold">—</span><span>{t.trim()}</span>
        </li>
      ))}
    </ul>
  );
}

export function Faqs({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="border-t border-white/15">
      {items.map((f) => (
        <details key={f.question} className="border-b border-white/12 py-5">
          <summary className="cursor-pointer list-none text-base font-medium">{f.question}</summary>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
