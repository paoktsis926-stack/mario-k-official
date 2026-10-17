/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { g, telHref, waHref } from "@/lib/content";
import { nav, phoneIcon } from "./Header";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-5 py-14 text-white md:px-10">
      <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-3">
        <div>
          <img src={g.logo_url} alt={g.brand_name} className="h-16 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">{g.footer_note}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs tracking-[0.15em] text-white/70">
          {nav.map(([l, h]) => <Link key={h} href={h} className="hover:text-gold">{l}</Link>)}
        </div>
        <div className="space-y-3 text-sm text-white/70">
          <a href={telHref} className="flex items-center gap-3 hover:text-gold">{phoneIcon}{g.phone}</a>
          <a href={waHref} className="block hover:text-gold">WhatsApp</a>
          <a href={`mailto:${g.email}`} className="block hover:text-gold">{g.email}</a>
          <p className="text-white/45">{g.location}</p>
          <p className="flex gap-5 pt-2">
            <a href={g.instagram_url} className="hover:text-gold">Instagram</a>
            <a href={g.tiktok_url} className="hover:text-gold">TikTok</a>
          </p>
        </div>
      </div>
      <p className="mx-auto mt-12 flex max-w-[1500px] flex-col justify-between gap-2 border-t border-white/10 pt-6 text-[11px] tracking-widest text-white/40 md:flex-row">
        <span>© 2026 {g.brand_name} · ALL RIGHTS RESERVED</span>
        <span><Link href="/blog" className="mr-5 hover:text-gold">ΑΡΘΡΑ</Link><Link href="/privacy" className="hover:text-gold">ΠΟΛΙΤΙΚΗ ΑΠΟΡΡΗΤΟΥ</Link></span>
      </p>
    </footer>
  );
}
