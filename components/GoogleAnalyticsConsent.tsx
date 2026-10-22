"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type Consent = "accepted" | "rejected" | null;
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalyticsConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("ga-consent");
    if (saved === "accepted" || saved === "rejected") setConsent(saved);
  }, []);

  function choose(value: Exclude<Consent, null>) {
    if (value === "rejected") {
      const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
      gtag?.("consent", "update", { analytics_storage: "denied" });
    }
    window.localStorage.setItem("ga-consent", value);
    setConsent(value);
    setShowSettings(false);
  }

  return (
    <>
      {consent === "accepted" && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});`}
          </Script>
        </>
      )}

      {(consent === null || showSettings) && (
        <section
          role="dialog"
          aria-label="Ρυθμίσεις cookies"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl border border-white/15 bg-[#111] p-4 text-white shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-5"
        >
          <p className="text-sm font-semibold">Ρυθμίσεις cookies</p>
          <p className="mt-2 text-xs leading-5 text-white/75">
            Χρησιμοποιούμε το Google Analytics για στατιστικά επισκεψιμότητας.
            Το Analytics ενεργοποιείται μόνο αν επιλέξετε αποδοχή. Μπορείτε να
            αλλάξετε την επιλογή σας από τις ρυθμίσεις cookies.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="bg-[#d7b56d] px-4 py-2 text-xs font-semibold text-black"
            >
              Αποδοχή analytics
            </button>
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="border border-white/30 px-4 py-2 text-xs text-white"
            >
              Απόρριψη
            </button>
          </div>
        </section>
      )}

      {consent !== null && !showSettings && (
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className="fixed bottom-2 left-2 z-[90] bg-black/80 px-2.5 py-1.5 text-[10px] text-white/80"
        >
          Ρυθμίσεις cookies
        </button>
      )}
    </>
  );
}
