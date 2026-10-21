/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { posts } from "@/lib/content";
import { PageHero, Cta } from "@/components/Ui";

export const metadata = {
  title: "Άρθρα & Συμβουλές για DJ και Εκδηλώσεις | MARIO K",
  description: "Συμβουλές για την επιλογή DJ, τη μουσική του γάμου, την οργάνωση πάρτι και τον σχεδιασμό της ψυχαγωγίας της εκδήλωσής σας.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Άρθρα & συμβουλές" intro="Πρακτικές συμβουλές για να οργανώσετε τη μουσική της εκδήλωσής σας." />
      <section className="mx-auto max-w-4xl px-5 py-12 md:py-20">
        <div className="grid gap-6">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col gap-5 border border-black p-6 transition hover:border-gold md:flex-row">
              {p.image_url && <Image src={p.image_url} alt={p.title} width={640} height={400} sizes="(max-width: 768px) 100vw, 224px" loading="lazy" className="h-40 w-full object-cover grayscale md:w-56" />}
              <div>
                <p className="label-caps text-gold">{p.date}</p>
                <h2 className="mt-2 text-xl font-semibold group-hover:text-gold">{p.title}</h2>
                <p className="mt-2 text-sm text-[#555]">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Cta title="Ψάχνετε DJ για την εκδήλωσή σας;" text="Στείλτε μας ημερομηνία και περιοχή και θα ελέγξουμε διαθεσιμότητα." button="Ζητήστε Προσφορά" />
    </>
  );
}
