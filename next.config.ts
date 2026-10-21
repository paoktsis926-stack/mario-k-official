import type { NextConfig } from "next";

const nextConfig: NextConfig = {
async redirects() {
    return [{ source: "/epikoinonia", destination: "/booking", permanent: true }];
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
