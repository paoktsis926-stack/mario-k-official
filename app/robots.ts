import type { MetadataRoute } from "next";

const base = (process.env.SITE_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "mario-k-official.vercel.app"}`).replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }, sitemap: `${base}/sitemap.xml` };
}
