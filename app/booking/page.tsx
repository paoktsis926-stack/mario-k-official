"use client";

import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { g, telHref, waHref } from "@/lib/content";
import { applyTheme } from "@/lib/events";

const eventOptions = [
  { value: "wedding", label: "Γάμος", api: "Γάμος" },
  { value: "baptism", label: "Βάπτιση", api: "Βάπτιση" },
  { value: "bachelorette", label: "Bachelor / Bachelorette", api: "Bachelor / Bachelorette" },
  { value: "private-party", label: "Πάρτι / Ιδιωτική εκδήλωση", api: "Πάρτι / Ιδιωτική εκδήλωση" },
  { value: "birthday", label: "Γενέθλια ενηλίκων", api: "Γενέθλια ενηλίκων" },
  { value: "beachbar", label: "Beach Bar / Club", api: "Beach Bar / Club" },
];

const packageSlugByEvent: Record<string, string> = {
  opening: "corporate",
  beachbar: "club",
  birthday: "private-party",
  reunion: "private-party",
  "carnival-adult": "private-party",
  "carnival-kids": "private-party",
};

const packageMatchesEvent = (pkg: { slugs: string[] }, slug: string) =>
  pkg.slugs.includes(slug) || pkg.slugs.includes(packageSlugByEvent[slug] || "");


function trackBookingEvent(name: string, eventType?: string) {
  const gtag = (window as Window & { gtag?: (command: string, eventName: string, params?: Record<string, string>) => void }).gtag;
  gtag?.("event", name, { ...(eventType ? { event_type: eventType } : {}) });
}

const getSrc = () => {
  try { return [new URLSearchParams(location.search).get("src"), localStorage.getItem("src")].filter(Boolean).join("-").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 60); } catch { return ""; }
};

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void;
    onTurnstileExpired?: () => void;
    onTurnstileError?: () => void;
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  area: string;
  venue: string;
  guestCount: string;
  package: string;
  message: string;
};

const initialForm: BookingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  area: "",
  venue: "",
  guestCount: "",
  package: "",
  message: "",
};

function BookingForm() {
  const searchParams = useSearchParams();
  const requestedEvent = searchParams.get("event") || "";
  const requestedPackage = searchParams.get("package") || "";
  const requestedDateRaw = searchParams.get("date") || "";
  // Ημερομηνία από τον βοηθό (ή σύνδεσμο): μόνο έγκυρη μορφή και όχι στο παρελθόν.
  const requestedDate = /^\d{4}-\d{2}-\d{2}$/.test(requestedDateRaw) && requestedDateRaw >= new Date().toISOString().slice(0, 10) ? requestedDateRaw : "";

  const initialEvent = eventOptions.some(
    (item) => item.value === requestedEvent
  )
    ? requestedEvent
    : "";

  const [event, setEvent] = useState(initialEvent);
  const [form, setForm] = useState<BookingFormData>({ ...initialForm, date: requestedDate });

  const [loading, setLoading] = useState(false);
  const [requestCode, setRequestCode] = useState("");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  useEffect(() => {
    window.onTurnstileSuccess = (token) => setTurnstileToken(token);
    window.onTurnstileExpired = () => setTurnstileToken("");
    window.onTurnstileError = () => setTurnstileToken("");
    return () => { delete window.onTurnstileSuccess; delete window.onTurnstileExpired; delete window.onTurnstileError; };
  }, []);

  const [avail, setAvail] = useState("");
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [bookedDatesStatus, setBookedDatesStatus] = useState<"loading" | "ok" | "unknown">("loading");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const base = requestedDate ? new Date(`${requestedDate}T12:00:00`) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  useEffect(() => {
    fetch("/api/booked-dates", { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error("Η διαθεσιμότητα δεν είναι διαθέσιμη."); return r.json(); })
      .then((j) => {
        if (!Array.isArray(j.dates) || j.status !== "ok") throw new Error("Μη έγκυρη απάντηση διαθεσιμότητας.");
        setBookedDates(j.dates.filter((d: unknown) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)));
        setBookedDatesStatus("ok");
      })
      .catch(() => { setBookedDates([]); setBookedDatesStatus("unknown"); });
  }, []);
  const [pkgs, setPkgs] = useState<{ label: string; name: string; slugs: string[] }[]>([]);
  useEffect(() => {
    fetch("/api/packages")
      .then((r) => { if (!r.ok) throw new Error("Δεν φορτώθηκαν τα πακέτα."); return r.json(); })
      .then((l) => { if (Array.isArray(l)) setPkgs(l); })
      .catch(() => setPkgs([]));
  }, []);

  useEffect(() => {
    if (!requestedPackage || !event || !pkgs.length) return;
    const wanted = requestedPackage.trim().toLowerCase();
    const match = pkgs.find((p) =>
      packageMatchesEvent(p, event) &&
      p.name.trim().toLowerCase() === wanted
    );
    if (match) setForm((previous) => previous.package ? previous : { ...previous, package: match.label });
  }, [event, pkgs, requestedPackage]);
  const [offer, setOffer] = useState(false);
  const wl = useRef(false);
  const idempotencyKey = useRef("");
  useEffect(() => {
    if (!form.date) { setAvail(""); return; }
    setAvail("unknown");
    const ac = new AbortController();
    fetch(`/api/availability?date=${form.date}`, { signal: ac.signal, cache: "no-store" }).then((r) => r.json()).then((j) => setAvail(["available", "pending", "unavailable"].includes(j.status) ? j.status : "unknown")).catch(() => setAvail("unknown"));
    return () => ac.abort();
  }, [form.date]);

  const selectedEvent = eventOptions.find((item) => item.value === event);
  const monthYear = calendarMonth.getFullYear();
  const monthIndex = calendarMonth.getMonth();
  const monthLabel = calendarMonth.toLocaleDateString("el-GR", { month: "long", year: "numeric" });
  const monthOffset = (new Date(monthYear, monthIndex, 1).getDay() + 6) % 7;
  const monthDays = new Date(monthYear, monthIndex + 1, 0).getDate();
  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  function updateField(field: keyof BookingFormData, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!selectedEvent) {
        throw new Error("Επιλέξτε τύπο εκδήλωσης.");
      }
      if (!form.date || avail === "" || avail === "unknown") {
        throw new Error("Δεν ήταν δυνατή η επιβεβαίωση διαθεσιμότητας για την ημερομηνία. Δοκιμάστε ξανά ή επικοινωνήστε μαζί μας τηλεφωνικά.");
      }
      if (avail === "unavailable" && !wl.current) {
        throw new Error("Η ημερομηνία φαίνεται κλεισμένη. Επιλέξτε άλλη ημερομηνία ή χρησιμοποιήστε τη λίστα αναμονής.");
      }
      if (turnstileSiteKey && !turnstileToken) {
        throw new Error("Ολοκληρώστε τον έλεγχο προστασίας πριν από την αποστολή.");
      }
      trackBookingEvent("booking_form_submit", event);

      if (!idempotencyKey.current) idempotencyKey.current = `web-${crypto.randomUUID()}`;
      const honeypotValue = String(new FormData(e.currentTarget).get("website") ?? "");
      const payload = {
        website: honeypotValue,
        turnstileToken,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        event_type: selectedEvent.api,
        event_date: form.date,
        event_time: form.time,
        area: form.area.trim(),
        venue: form.venue.trim(),
        guest_count: Number(form.guestCount),
        package: form.package || "",
        src: getSrc(),
        event_slug: event,
        waitlist: wl.current,
        message: form.message.trim(),
        source: "Next.js Website",
        external_id: idempotencyKey.current,
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      wl.current = false;
      setOffer(!!data.waitlist_offer);
      if (data.waitlist_offer) throw new Error(String(data.message));

      if (response.status === 409 || data.is_duplicate) {
        throw new Error(
          "Το αίτημα έχει ήδη καταχωριστεί. Επικοινωνήστε μαζί μας για επιβεβαίωση."
        );
      }

      if (!response.ok || data.success !== true) {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "Η καταχώριση απέτυχε. Δοκιμάστε ξανά."
        );
      }

      trackBookingEvent("generate_lead", event);
      setRequestCode(
        typeof data.request_code === "string" ? data.request_code : ""
      );
    } catch (err) {
      trackBookingEvent("booking_request_error", event);
      setError(
        err instanceof Error
          ? err.message
          : "Παρουσιάστηκε σφάλμα κατά την αποστολή."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-black/20 bg-white p-3.5 text-black outline-none focus:border-gold";

  const labelClass = "mb-2 block text-xs font-medium uppercase tracking-wider text-black/60";

  return (
    <main className="bg-white text-black">
      <section className="bg-black px-5 py-14 text-center text-white md:py-20">
        <p className="label-caps text-gold">Κράτηση</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl" style={{ fontFamily: "var(--font-comfortaa), var(--font-inter), sans-serif" }}>
          Ας σχεδιάσουμε <span className="text-gold">την εκδήλωσή σας.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">Συμπληρώστε τα στοιχεία σας και θα επικοινωνήσουμε μαζί σας για να επιβεβαιώσουμε τη διαθεσιμότητα.</p>
      </section>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:py-16 lg:grid-cols-[1fr_320px]">
        <div>
      {requestCode ? (
        <section className="border border-black/15 p-8 text-center">
          <h2 className="text-2xl text-gold">
            Το αίτημα καταχωρίστηκε
          </h2>
          <p className="mt-4 text-sm leading-7 text-black/60">
            Λάβαμε το αίτημά σας και θα επικοινωνήσουμε μαζί σας σύντομα.
          </p>
          <p className="mt-4 text-sm">
            Κωδικός αιτήματος:{" "}
            <span className="font-semibold text-gold">{requestCode}</span>
          </p>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          {turnstileSiteKey && (
            <div className="space-y-2">
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
              <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-callback="onTurnstileSuccess" data-expired-callback="onTurnstileExpired" data-error-callback="onTurnstileError" />
              <p className="text-xs text-black/50">Έλεγχος προστασίας από αυτοματοποιημένα αιτήματα.</p>
            </div>
          )}
          <div>
            <label className={labelClass}>Τύπος εκδήλωσης *</label>
            <select
              required
              value={event}
              onChange={(e) => {
                const nextEvent = e.target.value;
                setEvent(nextEvent);
                updateField("package", "");
                applyTheme(nextEvent);
                window.history.replaceState(
                  null,
                  "",
                  nextEvent ? `/booking?event=${nextEvent}` : "/booking"
                );
              }}
              className={inputClass}
            >
              <option value="">Επιλέξτε εκδήλωση</option>
              {eventOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Όνομα *</label>
              <input
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Επώνυμο *</label>
              <input
                required
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Email *</label>
              <input
                required
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Τηλέφωνο *</label>
              <input
                required
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Ημερομηνία εκδήλωσης *</label>
              <div className="mb-3 border border-black/15 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <button type="button" aria-label="Προηγούμενος μήνας" onClick={() => setCalendarMonth(new Date(monthYear, monthIndex - 1, 1))} className="px-3 py-2 text-lg hover:bg-black/5">‹</button>
                  <p className="text-sm font-semibold capitalize">{monthLabel}</p>
                  <button type="button" aria-label="Επόμενος μήνας" onClick={() => setCalendarMonth(new Date(monthYear, monthIndex + 1, 1))} className="px-3 py-2 text-lg hover:bg-black/5">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"].map((day) => <span key={day} className="py-1 text-[10px] font-semibold text-black/45">{day}</span>)}
                  {Array.from({ length: monthOffset }, (_, i) => <span key={`empty-${i}`} />)}
                  {Array.from({ length: monthDays }, (_, i) => {
                    const day = i + 1;
                    const iso = `${monthYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const booked = bookedDates.includes(iso);
                    const past = iso < todayISO;
                    const selected = form.date === iso;
                    return <button key={iso} type="button" disabled={booked || past} aria-pressed={selected} aria-label={`${day} ${monthLabel}${booked ? ", κλεισμένη ημερομηνία" : ""}`} title={booked ? "Κλεισμένη ημερομηνία" : undefined} onClick={() => updateField("date", iso)} className={`aspect-square min-w-0 text-xs transition ${booked ? "cursor-not-allowed bg-red-100 text-red-700 line-through" : past ? "cursor-not-allowed text-black/25" : selected ? "bg-gold font-bold text-black" : "hover:bg-black/10"}`}>
                      {day}
                    </button>;
                  })}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-black/55">
                  <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-gold" /> Επιλεγμένη</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-red-100 ring-1 ring-red-200" /> Κλεισμένη</span>
                </div>
              </div>
              {bookedDatesStatus === "unknown" && <p role="status" className="mb-3 border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Δεν φορτώθηκε το ημερολόγιο κρατήσεων. Οι ημερομηνίες δεν πρέπει να θεωρηθούν ελεύθερες· θα ελέγξουμε τη διαθεσιμότητα πριν γίνει δεκτό το αίτημα.</p>}
              <input
                required
                type="date"
                min={todayISO}
                value={form.date}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!bookedDates.includes(value)) updateField("date", value);
                }}
                className={inputClass}
              />
              {avail === "available" && <p className="mt-2 text-xs text-green-700">✓ Η ημερομηνία φαίνεται διαθέσιμη (θα την επιβεβαιώσουμε).</p>}
              {avail === "pending" && <p className="mt-2 text-xs text-amber-700">Υπάρχει ήδη αίτημα για αυτή την ημέρα. Μπορείτε να στείλετε το δικό σας και θα σας ενημερώσουμε.</p>}
              {avail === "unavailable" && <p className="mt-2 text-xs text-red-700">Η ημερομηνία φαίνεται κλεισμένη. Μπορείτε να στείλετε αίτημα για λίστα αναμονής ή να διαλέξετε άλλη.</p>}
            </div>
            <div>
              <label className={labelClass}>Ώρα εκδήλωσης *</label>
              <input
                required
                type="time"
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Περιοχή *</label>
              <input
                required
                value={form.area}
                onChange={(e) => updateField("area", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Χώρος εκδήλωσης *</label>
              <input
                required
                value={form.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Αριθμός καλεσμένων *</label>
            <input
              required
              type="number"
              min="1"
              step="1"
              value={form.guestCount}
              onChange={(e) => updateField("guestCount", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Πακέτο ενδιαφέροντος</label>
            <select
              value={form.package}
              onChange={(e) => updateField("package", e.target.value)}
              className={inputClass}
            >
              <option value="">Δεν έχω αποφασίσει</option>
              {pkgs.filter((p) => packageMatchesEvent(p, event)).map((p) => p.label).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Πρόσθετες πληροφορίες</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              className={inputClass}
            />
          </div>

          <label className="flex items-start gap-3 text-xs leading-6 text-black/60">
            <input type="checkbox" required className="mt-1" />
            <span>Συναινώ στην επεξεργασία των στοιχείων μου σύμφωνα με την <a href="/privacy" className="text-gold underline">Πολιτική Απορρήτου</a>. *</span>
          </label>

          {error && (
            <p role="alert" className="border border-red-300 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </p>
          )}
          {offer && (
            <button type="submit" onClick={() => { wl.current = true; }} disabled={loading} className="w-full border border-black px-6 py-4 text-xs uppercase tracking-[0.18em] transition hover:bg-black hover:text-white">
              Εγγραφή σε λίστα αναμονής για αυτή την ημερομηνία
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold px-6 py-5 text-xs tracking-[0.2em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "ΓΙΝΕΤΑΙ ΚΑΤΑΧΩΡΙΣΗ..." : "ΑΠΟΣΤΟΛΗ ΑΙΤΗΜΑΤΟΣ"}
          </button>

          <p className="text-xs leading-6 text-black/45">
            Τα πεδία με * είναι υποχρεωτικά.
          </p>
        </form>
      )}

        </div>
        <aside className="h-fit space-y-6 border border-black/15 p-6 lg:sticky lg:top-24">
          <div>
            <p className="label-caps text-gold">Προτιμάτε να μιλήσουμε;</p>
            <a href={telHref} className="mt-4 block text-lg font-semibold">{g.phone}</a>
            <a href={waHref} className="mt-1 block text-sm underline">Μήνυμα στο WhatsApp</a>
          </div>
          <div className="border-t border-black/10 pt-6">
            <p className="label-caps text-gold">Τι γίνεται μετά</p>
            <ol className="mt-4 space-y-3 text-sm text-black/65">
              <li>1. Λαμβάνουμε το αίτημά σας.</li>
              <li>2. Ελέγχουμε τη διαθεσιμότητα.</li>
              <li>3. Επικοινωνούμε μαζί σας με την προσφορά.</li>
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white" />}>
      <BookingForm />
    </Suspense>
  );
}