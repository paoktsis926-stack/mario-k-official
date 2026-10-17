import type { MetadataRoute } from "next";

const base = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "mario-k-official.vercel.app"}`;
const paths = ["", "/ypiresies", "/paketa", "/mixes", "/gallery", "/synergazomenoi-xoroi", "/sxetika", "/syxnes-erotiseis", "/booking", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: base + p, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
