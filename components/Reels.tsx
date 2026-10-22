"use client";
import { useEffect, useRef } from "react";

export default function Reels({ items }: { items: { title: string; video_url: string }[] }) {
  const refs = useRef<HTMLVideoElement[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target as HTMLVideoElement; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: 0.6 });
    refs.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, [items]);
  return (
    <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mx-0 md:px-0">
      {items.map((r, i) => (
        <figure key={r.video_url} className="relative aspect-[9/16] w-56 shrink-0 snap-start overflow-hidden bg-black md:w-64">
          <video ref={(el) => { if (el) refs.current[i] = el; }} src={r.video_url} muted loop playsInline preload="metadata" className="h-full w-full object-cover" onTimeUpdate={(e) => { const v = e.currentTarget; if (v.currentTime >= 15) { v.currentTime = 0; if (!v.paused) v.play().catch(() => {}); } }} onClick={(e) => { const v = e.currentTarget; v.muted = !v.muted; }} />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 text-xs text-white">{r.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}
