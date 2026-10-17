export default function MixEmbed({ url, title }: { url: string; title: string }) {
  const u = url.split("?")[0].trim();
  if (u.includes("soundcloud.com"))
    return <iframe title={title} loading="lazy" className="h-[300px] w-full border-0" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(u)}&color=%238b5cf6&auto_play=false&hide_related=true&show_comments=false&show_reposts=false&visual=true`} />;
  const yt = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (yt) return <iframe title={title} loading="lazy" className="aspect-video w-full border-0" allow="encrypted-media; picture-in-picture" allowFullScreen src={`https://www.youtube.com/embed/${yt[1]}`} />;
  return <a href={url} target="_blank" rel="noopener noreferrer" className="block border border-black p-6 text-sm underline">{title} ↗</a>;
}
