"use client";

export default function Reels({ items }: { items: { title: string; video_url: string }[] }) {
  return (
    <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mx-0 md:px-0">
      {items.map((r) => (
        <figure key={r.video_url} className="relative aspect-[9/16] w-56 shrink-0 snap-start overflow-hidden bg-black md:w-64">
          <video src={r.video_url} controls preload="none" playsInline className="h-full w-full object-cover" />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 text-xs text-white">{r.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}
