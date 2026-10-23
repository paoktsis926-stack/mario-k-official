"use client";

import Link from "next/link";
import { telHref, waHref } from "@/lib/content";
import { outline } from "./Ui";

const items: [string, string, string][] = [
  [telHref, "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z", "Κλήση"],
  [waHref, "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", "WhatsApp"],
  ["/booking", "M22 2 11 13M22 2l-7 20-4-9-9-4z", "Κράτηση"],
];

export default function FloatingContact() {
  return (
    <>
    <div className="fixed bottom-8 right-5 z-40 hidden flex-col gap-3 md:flex">
      {items.map(([h, d, l]) => {
        const icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
        const cls = `flex h-14 w-14 items-center justify-center bg-black/80 ${outline}`;
        return h.startsWith("/") ? <Link key={l} href={h} aria-label={l} className={cls}>{icon}</Link> : <a key={l} href={h} aria-label={l} className={cls}>{icon}</a>;
      })}
    </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/15 bg-black text-center text-[11px] uppercase tracking-[0.15em] text-white md:hidden">
        <a href={telHref} className="py-4">Κλήση</a>
        <a href={waHref} className="border-x border-white/15 py-4">WhatsApp</a>
        <Link href="/booking" className="bg-gold py-4 font-semibold text-black">Κράτηση</Link>
      </nav>
    </>
  );
}
