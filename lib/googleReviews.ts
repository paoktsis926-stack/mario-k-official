export type GoogleReview = {
  name: string;
  stars: number;
  text: string;
  date: string;
  author_url: string;
  relative_time: string;
};

export type LiveGoogleReviews = {
  business_name: string;
  rating: number;
  user_ratings_total: number;
  google_maps_url: string;
  reviews: GoogleReview[];
};

// Server-only: uses the existing Railway connection variables and never exposes
// the public-site API key to the browser. Review text is fetched live from Google.
export async function getGoogleReviews(): Promise<LiveGoogleReviews | null> {
  const base = process.env.RAILWAY_API_BASE
    ?.replace(/\/+$/, "")
    .replace(/\/api\/functions$/i, "");
  const key = process.env.RAILWAY_API_KEY;
  if (!base || !key) return null;

  try {
    const response = await fetch(`${base}/api/functions/googleReviews`, {
      headers: { "x-api-key": key },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json();
    if (!response.ok || data?.ok !== true) return null;

    return {
      business_name: String(data.business_name || "MARIO K"),
      rating: Number(data.rating) || 0,
      user_ratings_total: Number(data.user_ratings_total) || 0,
      google_maps_url: String(data.google_maps_url || ""),
      reviews: (Array.isArray(data.reviews) ? data.reviews : []).map((review: {
        author_name?: string;
        author_url?: string;
        rating?: number;
        text?: string;
        published_at?: string;
        relative_time?: string;
      }) => ({
        name: String(review.author_name || "Google user"),
        stars: Math.max(0, Math.min(5, Number(review.rating) || 0)),
        text: String(review.text || ""),
        date: review.published_at ? String(review.published_at).slice(0, 10) : "",
        author_url: String(review.author_url || ""),
        relative_time: String(review.relative_time || ""),
      })),
    };
  } catch {
    return null;
  }
}
