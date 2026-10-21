import { notFound } from "next/navigation";
import { posts } from "@/lib/content";
import { PageHero, Cta } from "@/components/Ui";

export function generateStaticParams() {
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  return p ? {
    title: `${p.title} — MARIO K`,
    description: p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.excerpt,
      ...(p.image_url ? { images: [{ url: p.image_url, alt: p.image_alt || p.title }] } : {}),
      publishedTime: p.date || undefined,
    },
  } : { robots: { index: false, follow: true } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow={p.date || "Blog"} title={p.title} intro={p.excerpt} />
      <article className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        {p.body.split(/\n{2,}/).map((b, i) =>
          b.startsWith("## ") ? <h2 key={i} className="mb-3 mt-10 text-xl font-semibold">{b.slice(3)}</h2> : <p key={i} className="mt-4 text-sm leading-8 text-[#444] md:text-base">{b}</p>
        )}
      </article>
      <Cta title="Ψάχνετε DJ για την εκδήλωσή σας;" text="Στείλτε μας ημερομηνία και περιοχή και θα ελέγξουμε διαθεσιμότητα." button="Ζητήστε Προσφορά" />
    </>
  );
}
