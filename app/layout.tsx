import type { Metadata, Viewport } from "next";
import { Inter, Comfortaa, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import Banner from "@/components/Banner";
import { Analytics } from "@vercel/analytics/next";
import SiteChrome from "@/components/SiteChrome";
import GoogleAnalyticsConsent from "@/components/GoogleAnalyticsConsent";
import { g, packages, mixes } from "@/lib/content";
import MiniPlayer from "@/components/MiniPlayer";
import Assistant from "@/components/Assistant";

const base = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "mario-k-official.vercel.app"}`;
const prices = packages.map((p) => p.price);
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  name: g.brand_name,
  url: base,
  image: g.logo_url,
  telephone: g.phone,
  email: g.email,
  description: "DJ για γάμους, βαπτίσεις, πάρτι και εταιρικές εκδηλώσεις στην Αλεξανδρούπολη και σε όλο τον Έβρο.",
  areaServed: ["Αλεξανδρούπολη", "Έβρος", "Ξάνθη", "Κομοτηνή", "Ορεστιάδα"],
  priceRange: `${Math.min(...prices)}€ - ${Math.max(...prices)}€`,
  sameAs: [g.instagram_url, g.tiktok_url],
};

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "greek"] });
const comfortaa = Comfortaa({ variable: "--font-comfortaa", subsets: ["latin", "greek"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: "MARIO K — DJ & Entertainment | Γάμοι, Βαπτίσεις, Πάρτι",
  description: "Ο MARIO K για γάμους, βαπτίσεις, πάρτι και εταιρικές εκδηλώσεις. DJ, karaoke, παιχνίδια, ήχος και φωτισμός με επαγγελματικό εξοπλισμό, σε Αλεξανδρούπολη και σε όλο τον Έβρο.",
  keywords: "DJ, DJ Mario K, DJ Αλεξανδρούπολη, DJ Έβρος, γάμος, βάπτιση, πάρτι, εταιρική εκδήλωση, karaoke, ήχος, φωτισμός, DJ service",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  openGraph: { title: "MARIO K — DJ & Entertainment", siteName: g.brand_name, locale: "el_GR", type: "website", images: ["https://media.base44.com/images/public/6ac5f8673cefccb19a9f86d3/0ea58aad1_generated_image.png"] },
};

export const viewport: Viewport = { themeColor: "#0b0b0b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" suppressHydrationWarning className={`${inter.variable} ${comfortaa.variable} ${cormorant.variable} antialiased`}>
      <head>
      </head>
      <body className="min-h-screen bg-white text-black">
        <GoogleAnalyticsConsent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{ __html: "try{var q=new URLSearchParams(location.search),r=q.get('ref')||q.get('utm_source');if(r)localStorage.setItem('src',r.replace(/[^a-zA-Z0-9_-]/g,'').slice(0,30));if(location.pathname.startsWith('/dj/')){var e=q.get('event')||location.pathname.split('/')[2];if(e)document.documentElement.dataset.event=e}else{delete document.documentElement.dataset.event}}catch(e){}" }} />
        <SiteChrome header={<><Banner /><Header /></>} footer={<Footer />} floating={<><FloatingContact /><MiniPlayer tracks={mixes.filter((m) => m.url.includes("soundcloud.com")).map((m) => ({ title: m.title, url: m.url.split("?")[0] }))} />{process.env.ANTHROPIC_API_KEY ? <Assistant /> : null}</>}>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
