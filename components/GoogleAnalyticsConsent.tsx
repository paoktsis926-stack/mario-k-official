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
    const openSettings = () => setShowSettings(true);
    window.addEventListener("mk-open-cookie-settings", openSettings);
    return () => window.removeEventListener("mk-open-cookie-settings", openSettings);
  }, []);

  function choose(value: Exclude<Consent, null>) {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("consent", "update", { analytics_storage: value === "accepted" ? "granted" : "denied" });
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
          aria-modal="true"
          aria-describedby="cookie-consent-description"
          className="cookie-consent-panel fixed inset-x-2 bottom-2 z-[100] mx-auto w-auto max-w-xl border border-white/15 bg-[#111] p-4 text-white shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold">Ρυθμίσεις cookies</p>
            {consent !== null && <button type="button" onClick={() => setShowSettings(false)} aria-label="Κλείσιμο ρυθμίσεων cookies" className="grid h-9 w-9 shrink-0 place-items-center border border-white/20 text-lg leading-none hover:bg-white/10">×</button>}
          </div>
          <p id="cookie-consent-description" className="mt-2 text-xs leading-5 text-white/75">
            Το Google Analytics χρησιμοποιείται μόνο με τη συγκατάθεσή σας για στατιστικά επισκεψιμότητας. Μπορείτε να αλλάξετε την επιλογή σας οποτεδήποτε από το υποσέλιδο.
          </p>
          <div className="cookie-consent-actions mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="min-h-11 px-3 py-3 text-xs font-semibold text-black" style={{ background: "#d7b56d" }}
            >
              Αποδοχή analytics
            </button>
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="min-h-11 border border-white/30 px-3 py-3 text-xs text-white hover:bg-white/10"
            >
              Απόρριψη analytics
            </button>
          </div>
        </section>
      )}


    </>
  );
}
