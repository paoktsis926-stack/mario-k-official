import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**.public.blob.vercel-storage.com" }] },
  async redirects() {
    return [
      { source: "/epikoinonia", destination: "/booking", permanent: true },
      { source: "/check-date", destination: "/booking", permanent: true },
      { source: "/form/wedding", destination: "/booking?event=wedding", permanent: true },
      { source: "/form/bachelorette", destination: "/booking?event=bachelorette", permanent: true },
      { source: "/form/birthday", destination: "/booking?event=birthday", permanent: true },
      { source: "/form/inauguration", destination: "/booking?event=opening", permanent: true },
      { source: "/form/pre-party", destination: "/booking?event=private-party", permanent: true },
      { source: "/form/reunion", destination: "/booking?event=reunion", permanent: true },
      { source: "/form/private-party", destination: "/booking?event=private-party", permanent: true },
      { source: "/embed/book", destination: "/booking", permanent: true },
      { source: "/reviews", destination: "/#reviews", permanent: true },
    ];
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
