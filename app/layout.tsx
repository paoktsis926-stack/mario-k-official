import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import SiteChrome from "@/components/SiteChrome";
import { g } from "@/lib/content";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "greek"] });
const garamond = EB_Garamond({ variable: "--font-garamond", subsets: ["latin", "greek"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "MARIO K — DJ & Entertainment | Γάμοι, Βαπτίσεις, Πάρτι",
  description: "Ο MARIO K για γάμους, βαπτίσεις, πάρτι και εταιρικές εκδηλώσεις. DJ, karaoke, παιχνίδια, ήχος και φωτισμός με επαγγελματικό εξοπλισμό, σε Αλεξανδρούπολη και σε όλο τον Έβρο.",
  keywords: "DJ, DJ Mario K, DJ Αλεξανδρούπολη, DJ Έβρος, γάμος, βάπτιση, πάρτι, εταιρική εκδήλωση, karaoke, ήχος, φωτισμός, DJ service",
  openGraph: { title: "MARIO K — DJ & Entertainment", siteName: g.brand_name, locale: "el_GR", type: "website", images: ["https://media.base44.com/images/public/6ac5f8673cefccb19a9f86d3/0ea58aad1_generated_image.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={`${inter.variable} ${garamond.variable} antialiased`}>
      <body className="min-h-screen bg-[#0a0a0a] text-[#e9e4d8]">
        <SiteChrome header={<Header />} footer={<Footer />} floating={<FloatingContact />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
