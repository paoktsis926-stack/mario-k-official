import Link from "next/link";
import { banner } from "@/lib/content";

export default function Banner() {
  if (!banner?.visible || !banner.text) return null;
  const cls = "block bg-gold px-4 py-2 text-center text-xs font-medium text-black";
  return banner.link ? <Link href={banner.link} className={cls}>{banner.text} →</Link> : <p className={cls}>{banner.text}</p>;
}
