"use client";

import { useEffect } from "react";

type Gtag = (command: string, eventName: string, params?: Record<string, string>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export default function ContactClickTracking() {
  useEffect(() => {
    function trackContactClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href")?.trim() || "";
      const normalized = href.toLowerCase();
      const gtag = window.gtag;
      if (!gtag) return;

      if (normalized.startsWith("tel:")) {
        gtag("event", "click_phone", { contact_method: "phone" });
        return;
      }

      let isWhatsApp = normalized.includes("wa.me/") ||
        normalized.includes("api.whatsapp.com/") ||
        normalized.includes("web.whatsapp.com/");

      if (!isWhatsApp && /^https?:\/\//i.test(href)) {
        try {
          isWhatsApp = new URL(href).hostname.toLowerCase().endsWith("whatsapp.com");
        } catch {
          isWhatsApp = false;
        }
      }

      if (isWhatsApp) {
        gtag("event", "click_whatsapp", { contact_method: "whatsapp" });
      }
    }

    document.addEventListener("click", trackContactClick, true);
    return () => document.removeEventListener("click", trackContactClick, true);
  }, []);

  return null;
}
