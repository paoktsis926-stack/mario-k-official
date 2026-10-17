"use client";
import { slugOf, shortLabel } from "@/lib/events";

export default function EventChips({ events, value, onChange }: { events: { id: string; name: string }[]; value: string; onChange: (s: string) => void }) {
  const chips = events.filter((e, i, a) => a.findIndex((x) => slugOf(x.name) === slugOf(e.name)) === i);
  const b = "rounded-full border px-4 py-1.5 text-xs transition";
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button onClick={() => onChange("")} className={`${b} ${!value ? "border-black bg-black text-white" : "border-black/25 hover:border-black"}`}>Όλες</button>
      {chips.map((e) => {
        const s = slugOf(e.name);
        return <button key={s} onClick={() => onChange(s)} className={`${b} ${value === s ? "border-gold bg-gold text-black" : "border-black/25 hover:border-black"}`}>{shortLabel[s] ?? e.name}</button>;
      })}
    </div>
  );
}
