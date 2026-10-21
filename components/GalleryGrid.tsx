"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import { useEffect, useState } from "react";
import Image from "next/image";
import EventChips from "./EventChips";
import { slugOf, applyTheme } from "@/lib/events";

export default function GalleryGrid({ photos, eventTypes }: { photos: any[]; eventTypes: any[] }) {
  const [ev, setEv] = useState("");
  useEffect(() => { setEv(document.documentElement.dataset.event || ""); }, []);
  const ids = eventTypes.filter((e) => slugOf(e.name) === ev).map((e) => e.id);
  const f = ev ? photos.filter((p) => ids.includes(p.event_type_id)) : photos;
  const list = f.length ? f : photos;
  return (
    <>
      <EventChips events={eventTypes} value={ev} onChange={(s) => { setEv(s); applyTheme(s); }} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((x) => (
          <figure key={x.title} className="border border-black">
            {x.video_url ? (
              <video src={x.video_url} controls preload="metadata" playsInline className="aspect-[4/3] w-full bg-black object-cover" />
            ) : (
              <Image src={x.image_url} alt={x.title} width={960} height={720} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" className="aspect-[4/3] w-full object-cover grayscale transition hover:grayscale-0" />
            )}
            <figcaption className="p-4">
              <p className="label-caps text-gold">{eventTypes.find((e) => e.id === x.event_type_id)?.name ?? ""}</p>
              <p className="mt-1 text-sm">{x.title}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
