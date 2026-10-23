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
// the public-site API key to the browser. Review text is fetched from approved public reviews in DJ PRO HUB.
export async function getGoogleReviews(): Promise<LiveGoogleReviews | null> {
  const base = process.env.RAILWAY_API_BASE
    ?.replace(/\/+$/, "")
    .replace(/\/api\/functions$/i, "");
  const key = process.env.RAILWAY_API_KEY;
  if (!base || !key) return null;

  try {
    const response = await fetch(`${base}/api/functions/publicReviews`, {
      headers: { "x-api-key": key },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json();
    if (!response.ok || data?.ok !== true || !Array.isArray(data.reviews)) return null;

    return {
      business_name: "MARIO K",
      rating: 0,
      user_ratings_total: data.reviews.length,
      google_maps_url: "",
      reviews: (Array.isArray(data.reviews) ? data.reviews : []).map((review: {
        display_name?: string;
        event_type?: string | null;
        rating?: number;
        review_text?: string;
        published_date?: string | null;
        
      }) => ({
        name: String(review.display_name || "Πελάτης MARIO K"),
        stars: Math.max(0, Math.min(5, Number(review.rating) || 0)),
        text: String(review.review_text || ""),
        date: review.published_date ? String(review.published_date).slice(0, 10) : "",
        author_url: "",
        relative_time: "",
      })),
    };
  } catch {
    return null;
  }
}
