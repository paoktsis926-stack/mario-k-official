"use client";

import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { g, telHref, waHref } from "@/lib/content";
import { applyTheme } from "@/lib/events";

const eventOptions = [
  { value: "wedding", label: "Γάμος", api: "Γάμος" },
  { value: "baptism", label: "Βάφτιση", api: "Άλλο" },
  { value: "private-party", label: "Πάρτι / Ιδιωτική εκδήλωση", api: "Party" },
  { value: "bachelorette", label: "Bachelorette / Bachelor Party", api: "Bachelorette" },
  { value: "club", label: "Club / Bar", api: "Άλλο" },
  { value: "corporate", label: "Εταιρική εκδήλωση", api: "Άλλο" },
  { value: "karaoke", label: "Karaoke Party & Games", api: "Άλλο" },
];

const allPackages = ["Essential — 300€", "Signature — 500€", "Full Production — 900€"];
const packagesByEvent: Record<string, string[]> = Object.fromEntries(eventOptions.map((o) => [o.value, allPackages]));

const getSrc = () => {
  try { return [new URLSearchParams(location.search).get("src"), localStorage.getItem("src")].filter(Boolean).join("-").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 60); } catch { return ""; }
};

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

  const initialEvent = eventOptions.some(
    (item) => item.value === requestedEvent
  )
    ? requestedEvent
    : "";

  const [event, setEvent] = useState(initialEvent);
  const [form, setForm] = useState<BookingFormData>({
    ...initialForm,
    package:
      packagesByEvent[initialEvent]?.find((item) =>
        item.startsWith(requestedPackage)
      ) || "",
  });

  const [loading, setLoading] = useState(false);
  const [requestCode, setRequestCode] = useState("");
  const [error, setError] = useState("");

  const [avail, setAvail] = useState("");
  const [offer, setOffer] = useState(false);
  const wl = useRef(false);
  useEffect(() => {
    if (!form.date) { setAvail(""); return; }
    const ac = new AbortController();
    fetch(`/api/availability?date=${form.date}`, { signal: ac.signal }).then((r) => r.json()).then((j) => setAvail(j.status || "")).catch(() => {});
    return () => ac.abort();
  }, [form.date]);

  const selectedEvent = eventOptions.find((item) => item.value === event);

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

      const payload = {
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
        message: (selectedEvent.api === "Άλλο" ? `[${selectedEvent.label}] ` : "") + form.message.trim(),
        source: "Next.js Website",
        external_id: `web-${crypto.randomUUID()}`,
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

      setRequestCode(
        typeof data.request_code === "string" ? data.request_code : ""
      );
    } catch (err) {
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
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
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
              {(packagesByEvent[event] || []).map((item) => (
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