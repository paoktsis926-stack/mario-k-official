import { posts } from "@/lib/content";
import { lpSlugs } from "@/lib/events";
import type { MetadataRoute } from "next";

const base = (process.env.SITE_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "mario-k-official.vercel.app"}`).replace(/\/+$/, "");
const paths = [
  "",
  "/ypiresies",
  "/paketa",
  "/mixes",
  "/gallery",
  "/synergazomenoi-xoroi",
  "/sxetika",
  "/syxnes-erotiseis",
  "/booking",
  "/privacy",
  "/blog",
  "/perioxes/alexandroupoli",
  "/perioxes/komotini",
  "/perioxes/orestiada",
  "/perioxes/samothraki",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...paths, ...Object.keys(lpSlugs).map((k) => `/dj/${k}`), ...posts.map((x) => `/blog/${x.slug}`)].map((p) => ({
    url: base + p,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/booking" ? 0.9 : p.startsWith("/dj/") ? 0.85 : p.startsWith("/blog/") ? 0.6 : 0.7,
  }));
}
