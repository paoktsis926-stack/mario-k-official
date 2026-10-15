"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

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
    "w-full border border-white/15 bg-[#101010] p-4 text-white outline-none focus:border-[#C7A66A]";

  const labelClass = "mb-2 block text-sm text-white/60";

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-12 text-[#F5F1E8] md:px-16 md:py-20">
      <a href="/" className="text-sm tracking-widest text-[#C7A66A]">
        ← MARIO K OFFICIAL
      </a>

      <header className="mx-auto max-w-3xl py-16 text-center">
        <p className="text-xs tracking-[0.35em] text-[#C7A66A]">
          BOOKING ENQUIRY
        </p>
        <h1 className="mt-6 text-4xl font-light md:text-6xl">
          Ας σχεδιάσουμε{" "}
          <span className="text-[#C7A66A]">την εκδήλωσή σας.</span>
        </h1>
        <p className="mt-5 text-sm leading-7 text-white/50">
          Συμπληρώστε τα στοιχεία σας για να επικοινωνήσουμε μαζί σας.
        </p>
      </header>

      {requestCode ? (
        <section className="mx-auto max-w-2xl border border-white/10 p-8 text-center">
          <h2 className="text-2xl text-[#C7A66A]">
            Το αίτημα καταχωρίστηκε
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Λάβαμε το αίτημά σας και θα επικοινωνήσουμε μαζί σας σύντομα.
          </p>
          <p className="mt-4 text-sm">
            Κωδικός αιτήματος:{" "}
            <span className="text-[#C7A66A]">{requestCode}</span>
          </p>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
          <div>
            <label className={labelClass}>Τύπος εκδήλωσης *</label>
            <select
              required
              value={event}
              onChange={(e) => {
                const nextEvent = e.target.value;
                setEvent(nextEvent);
                updateField("package", "");
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

          <label className="flex items-start gap-3 text-xs leading-6 text-white/60">
            <input type="checkbox" required className="mt-1" />
            <span>Συναινώ στην επεξεργασία των στοιχείων μου σύμφωνα με την <a href="/privacy" className="text-[#C7A66A] underline">Πολιτική Απορρήτου</a>. *</span>
          </label>

          {error && (
            <p role="alert" className="border border-red-900/60 p-4 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#C7A66A]/60 px-6 py-5 text-xs tracking-[0.2em] text-[#C7A66A] transition hover:bg-[#C7A66A] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "ΓΙΝΕΤΑΙ ΚΑΤΑΧΩΡΙΣΗ..." : "ΑΠΟΣΤΟΛΗ ΑΙΤΗΜΑΤΟΣ"}
          </button>

          <p className="text-xs leading-6 text-white/35">
            Τα πεδία με * είναι υποχρεωτικά.
          </p>
        </form>
      )}

      <footer className="mx-auto mt-20 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/35">
        MARIO K OFFICIAL
      </footer>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#080808]" />}>
      <BookingForm />
    </Suspense>
  );
}