import type { Metadata } from "next";
import { Inter, Comfortaa, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import Banner from "@/components/Banner";
import { Analytics } from "@vercel/analytics/next";
import SiteChrome from "@/components/SiteChrome";
import { g, packages } from "@/lib/content";

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
  openGraph: { title: "MARIO K — DJ & Entertainment", siteName: g.brand_name, locale: "el_GR", type: "website", images: ["https://media.base44.com/images/public/6ac5f8673cefccb19a9f86d3/0ea58aad1_generated_image.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" suppressHydrationWarning className={`${inter.variable} ${comfortaa.variable} ${cormorant.variable} antialiased`}>
      <body className="min-h-screen bg-white text-black">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{ __html: "try{var e=new URLSearchParams(location.search).get('event')||localStorage.getItem('ev');if(e)document.documentElement.dataset.event=e}catch(e){}" }} />
        <SiteChrome header={<><Banner /><Header /></>} footer={<Footer />} floating={<FloatingContact />}>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
