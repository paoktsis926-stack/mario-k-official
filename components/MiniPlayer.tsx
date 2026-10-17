"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

export default function MiniPlayer({ tracks }: { tracks: { title: string; url: string }[] }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const widget = useRef<any>(null);
  const [i, setI] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const w0 = window as any;
    const init = () => {
      if (!frame.current || !w0.SC) return;
      const w = w0.SC.Widget(frame.current);
      widget.current = w;
      const E = w0.SC.Widget.Events;
      w.bind(E.READY, () => setReady(true));
      w.bind(E.PLAY, () => setPlaying(true));
      w.bind(E.PAUSE, () => setPlaying(false));
      w.bind(E.FINISH, () => setPlaying(false));
    };
    if (w0.SC) init();
    else { const s = document.createElement("script"); s.src = "https://w.soundcloud.com/player/api.js"; s.onload = init; document.body.appendChild(s); }
  }, []);

  if (!tracks.length) return null;
  const next = () => { const n = (i + 1) % tracks.length; setI(n); widget.current?.load(tracks[n].url, { auto_play: true }); };
  return (
    <>
      <iframe ref={frame} title="player" aria-hidden="true" tabIndex={-1} className="pointer-events-none fixed -left-[9999px] h-[120px] w-[300px]" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(tracks[0].url)}&auto_play=false&visual=false&hide_related=true&show_comments=false`} />
      <div className="fixed bottom-16 left-3 z-40 flex items-center gap-3 rounded-full border border-white/15 bg-black/90 p-1.5 pr-4 text-white shadow-lg backdrop-blur md:bottom-6 md:left-5">
        <button onClick={() => widget.current?.toggle()} disabled={!ready} aria-label={playing ? "Παύση" : "Αναπαραγωγή"} className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-black disabled:opacity-40">{playing ? "❚❚" : "▶"}</button>
        {open && (
          <>
            <span className="eq text-gold" aria-hidden="true"><span /><span /><span /><span /></span>
            <span className="max-w-[9rem] truncate text-[11px] uppercase tracking-[0.12em]">{tracks[i].title}</span>
            {tracks.length > 1 && <button onClick={next} aria-label="Επόμενο" className="text-xs text-white/70 hover:text-white">⏭</button>}
          </>
        )}
        <button onClick={() => setOpen(!open)} aria-label="Μικρό/μεγάλο" className="text-xs text-white/50 hover:text-white">{open ? "–" : "+"}</button>
      </div>
    </>
  );
}
