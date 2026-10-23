"use client";

import { useEffect, useState, type FormEvent } from "react";
import Script from "next/script";

declare global {
  interface Window {
    onReviewTurnstileSuccess?: (token: string) => void;
    onReviewTurnstileExpired?: () => void;
    onReviewTurnstileError?: () => void;
  }
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ReviewSubmissionForm() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.onReviewTurnstileSuccess = (value) => setToken(value);
    window.onReviewTurnstileExpired = () => setToken("");
    window.onReviewTurnstileError = () => setToken("");
    return () => {
      delete window.onReviewTurnstileSuccess;
      delete window.onReviewTurnstileExpired;
      delete window.onReviewTurnstileError;
    };
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, rating, website: String(new FormData(e.currentTarget).get("website") || ""), turnstileToken: token }),
      });
      const data = await response.json();
      if (!response.ok || data.ok !== true) throw new Error(data.message || "Η αποστολή απέτυχε.");
      setMessage(data.message || "Η κριτική καταχωρίστηκε για έγκριση.");
      setName("");
      setComment("");
      setRating(5);
      setToken("");
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Η αποστολή απέτυχε. Δοκιμάστε ξανά.");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mt-10 border border-black/15 bg-white p-6 md:p-8">
      <h3 className="text-lg font-semibold">Αφήστε τη δική σας κριτική</h3>
      <p className="mt-2 text-sm leading-6 text-black/60">Οι κριτικές ελέγχονται πριν δημοσιευτούν και αποθηκεύονται στο DJ PRO HUB.</p>
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="review-website">Website</label>
        <input id="review-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block text-xs font-medium uppercase tracking-wider text-black/60">Όνομα
          <input required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full border border-black/20 p-3 text-sm text-black outline-none focus:border-[#b99a54]" />
        </label>
        <div>
          <span className="block text-xs font-medium uppercase tracking-wider text-black/60">Βαθμολογία</span>
          <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Βαθμολογία">
            {[1,2,3,4,5].map(n=><button key={n} type="button" aria-label={`${n} αστέρια`} aria-pressed={rating===n} onClick={()=>setRating(n)} className={`px-1 text-2xl ${n<=rating?"text-[#b99a54]":"text-black/20"}`}>★</button>)}
          </div>
        </div>
      </div>
      <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-black/60">Η κριτική σας
        <textarea required minLength={8} maxLength={2000} rows={4} value={comment} onChange={e=>setComment(e.target.value)} className="mt-2 w-full resize-y border border-black/20 p-3 text-sm text-black outline-none focus:border-[#b99a54]" />
      </label>
      {siteKey && <div className="mt-4"><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive"/><div className="cf-turnstile" data-sitekey={siteKey} data-callback="onReviewTurnstileSuccess" data-expired-callback="onReviewTurnstileExpired" data-error-callback="onReviewTurnstileError"/></div>}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy || (!!siteKey && !token)} className="bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white disabled:opacity-50">{busy?"Αποστολή…":"Υποβολή κριτικής"}</button>
        {message && <p role="status" className="max-w-md text-sm text-black/70">{message}</p>}
      </div>
    </form>
  );
}
