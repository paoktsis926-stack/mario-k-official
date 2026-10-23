import { getGoogleReviews } from "@/lib/googleReviews";
import ReviewSubmissionForm from "@/components/ReviewSubmissionForm";

type ReviewCard = { name: string; stars: number; text: string; date: string };
type Props = { fallbackReviews: ReviewCard[]; googleReviewUrl: string };

export default async function GoogleReviewsSection({ googleReviewUrl }: Props) {
  const googleReviews = await getGoogleReviews();
  const displayReviews = googleReviews?.reviews ?? [];
  return (
    <section className="reveal home-reviews border-t border-black bg-[#f7f5f0] px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="label-caps text-gold">Κριτικές</p>
        <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight md:text-4xl">Τι λένε οι πελάτες μας</h2>
        <span className="mt-6 block h-[3px] w-16 bg-gold" />
        {displayReviews.length > 0 && <p className="mt-5 text-sm text-[#555]">{displayReviews.length} εγκεκριμένες κριτικές πελατών</p>}
        {displayReviews.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {displayReviews.slice(0, 3).map((review) => (
              <figure key={review.name + review.text.slice(0, 12)} className="flex flex-col border border-black bg-white p-8">
                <p className="text-gold">{"★".repeat(Math.max(1, Math.min(5, review.stars)))}</p>
                <blockquote className="mt-4 flex-1 text-sm leading-7 text-[#444]">{review.text}</blockquote>
                <figcaption className="mt-6 text-xs uppercase tracking-[0.15em]">{review.name}<span className="ml-2 text-black/40">MARIO K · DJ PRO HUB{review.date ? ` · ${review.date}` : ""}</span></figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="mt-8 border border-black/15 bg-white p-6 text-sm leading-6 text-[#555]">
            Δεν υπάρχουν ακόμη εγκεκριμένες κριτικές για δημοσίευση. Μπορείτε να αφήσετε τη δική σας κριτική παρακάτω.
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-6">
          <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="inline-block border-b border-gold pb-1 text-xs uppercase tracking-[0.2em]">Γράψτε κι εσείς κριτική στο Google ↗</a>
        </div>
        <ReviewSubmissionForm />
      </div>
    </section>
  );
}
