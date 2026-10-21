/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { g, telHref } from "@/lib/content";
import { outline } from "./Ui";

export const nav: [string, string][] = [
  ["ΑΡΧΙΚΗ", "/"], ["ΥΠΗΡΕΣΙΕΣ", "/ypiresies"], ["ΠΑΚΕΤΑ", "/paketa"], ["MIXES", "/mixes"], ["ΦΩΤΟΓΡΑΦΙΕΣ", "/gallery"],
  ["ΧΩΡΟΙ", "/synergazomenoi-xoroi"], ["ΣΧΕΤΙΚΑ", "/sxetika"], ["FAQ", "/syxnes-erotiseis"], ["ΕΠΙΚΟΙΝΩΝΙΑ", "/booking"],
];

const topNav = nav.filter(([, h]) => !["/", "/synergazomenoi-xoroi", "/syxnes-erotiseis"].includes(h));
const mobileNav: [string, string][] = [
  ["ΑΡΧΙΚΗ", "/"], ["ΥΠΗΡΕΣΙΕΣ", "/ypiresies"], ["ΠΑΚΕΤΑ", "/paketa"],
  ["MIXES", "/mixes"], ["ΦΩΤΟΓΡΑΦΙΕΣ", "/gallery"], ["ΧΩΡΟΙ", "/synergazomenoi-xoroi"],
  ["ΣΧΕΤΙΚΑ", "/sxetika"], ["FAQ", "/syxnes-erotiseis"], ["ΕΠΙΚΟΙΝΩΝΙΑ / ΚΡΑΤΗΣΗ", "/booking"],
];

const ig = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>;
const tt = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.4 2 4.2 5 4.5" /></svg>;
export const phoneIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>;

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-3 md:px-10">
        <Link href="/"><img src={g.logo_url} alt={g.logo_alt || g.brand_name} className="h-12 w-auto mix-blend-screen" /></Link>
        <nav className="hidden items-center gap-7 text-[11px] tracking-[0.18em] text-white/80 xl:flex">
          {topNav.map(([l, h]) => <Link key={h} href={h} className="transition hover:text-gold">{l}</Link>)}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <a href={g.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/80 hover:text-gold">{ig}</a>
          <a href={g.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white/80 hover:text-gold">{tt}</a>
          <a href={telHref} className={`flex items-center gap-3 px-5 py-3 text-xs tracking-[0.15em] ${outline}`}>{phoneIcon}{g.phone}</a>
        </div>
        <details className="relative xl:hidden">
          <summary className="cursor-pointer list-none border border-white/30 px-4 py-3 text-xs tracking-widest">ΜΕΝΟΥ</summary>
          <div className="absolute right-0 mt-2 flex max-h-[70vh] w-[min(18rem,calc(100vw-2rem))] flex-col gap-1 overflow-y-auto border border-white/10 bg-black p-3 text-xs tracking-[0.12em] shadow-xl">
            {mobileNav.map(([l, h]) => <Link key={h} href={h} className="min-h-11 px-3 py-3 hover:bg-white/10">{l}</Link>)}
            <a href={telHref} className="text-gold">{g.phone}</a>
          </div>
        </details>
      </div>
    </header>
  );
}
