import data from "@/data/content.json";
import { slugOf } from "./events";

export const site = data.site as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export const g = site.global as Record<string, string>;
export const eventTypes = data.eventTypes as Array<(typeof data.eventTypes)[number] & { image_alt?: string }>;
export const services = data.services;
export type Pkg = { name: string; price: number; price_text: string; duration: string; tagline: string; best_for: string; features: string[]; extras: string[]; highlight: boolean; slugs: string[] };
export const packages = data.packages.map((p) => ({ ...p, price_text: `${p.price}€`, slugs: p.event_types.map((id) => slugOf(data.eventTypes.find((e) => e.id === id)?.name ?? "")) })) as unknown as Pkg[];
export const faq = data.faq;
export const photos = data.photos as Array<(typeof data.photos)[number] & { image_alt?: string }>;

type Review = { name: string; stars: number; text: string; date: string; visible: boolean };
export const reviews = ((data as unknown as { reviews?: Review[] }).reviews ?? []).filter((r) => r.visible && r.text);
type Mix = { title: string; url: string; description?: string; visible: boolean };
const defaultMixes: Mix[] = [{ title: "Greek Deep House Mix", url: "https://soundcloud.com/djmario_k-814023128/greek-deep-house-mix-by-dj", description: "", visible: true }];
export const mixes = ((data as unknown as { mixes?: Mix[] }).mixes ?? defaultMixes).filter((m) => m.visible && m.url);
type Media = { hero_video: string; reels: { title: string; video_url: string; visible: boolean; event_slug?: string }[] };
const rawMedia = (data as unknown as { media?: Media }).media;
export const media = { hero_video: rawMedia?.hero_video ?? "" };
const configuredReels = (rawMedia?.reels ?? []).filter((r) => r.visible && r.video_url).map((r) => ({ title: r.title, video_url: r.video_url, event_slug: r.event_slug }));
export const reels: { title: string; video_url: string; event_slug?: string }[] = configuredReels.length ? configuredReels : data.photos.filter((p) => p.video_url).map((p) => ({ title: p.title, video_url: p.video_url as string, event_slug: /παραδοσιακ|γλεντι|γάμ|wedding/i.test(p.title) ? "wedding" : undefined }));
export const SOUNDCLOUD_PROFILE = "https://soundcloud.com/djmario_k-814023128";
export const GOOGLE_REVIEW_URL = "https://g.page/r/CdbV_Zn66vpoEBM/review";
export const eventName = (id: string | null) => eventTypes.find((e) => e.id === id)?.name ?? "";
type Banner = { text: string; link: string; visible: boolean };
export const banner = (data as unknown as { banner?: Banner }).banner;
export type Post = { title: string; slug: string; excerpt: string; image_url: string; image_alt?: string; body: string; date: string; visible: boolean };
export const seedPosts: Post[] = [{"title": "Πώς να διαλέξετε DJ για τον γάμο σας", "slug": "pws-na-dialexete-dj-gia-ton-gamo-sas", "excerpt": "Πέντε πράγματα που πρέπει να ελέγξετε πριν κλείσετε DJ.", "image_url": "", "body": "Ο DJ είναι αυτός που καθορίζει πόσο διασκεδάζουν οι καλεσμένοι σας, γι' αυτό αξίζει να τον διαλέξετε με προσοχή. Αυτά είναι τα πράγματα που πρέπει να ελέγξετε πριν κλείσετε.\n\n## 1. Μιλήστε ή συναντηθείτε πριν κλείσετε\nΜια σύντομη κουβέντα δείχνει αν καταλαβαίνει το ύφος που θέλετε και αν νιώθετε άνετα μαζί του. Αν δεν βρίσκει χρόνο για εσάς πριν τον γάμο, μην περιμένετε να βρει για τη βραδιά σας.\n\n## 2. Ζητήστε να δείτε και να ακούσετε δουλειά\nMixes, φωτογραφίες και βίντεο από πραγματικές εκδηλώσεις είναι πιο αξιόπιστα από κάθε υπόσχεση. Διαβάστε και τις κριτικές άλλων ζευγαριών.\n\n## 3. Πείτε τι μουσική θέλετε και τι όχι\nΈνας καλός DJ ρωτά για τα τραγούδια-κλειδιά (είσοδος, πρώτος χορός, κοπή τούρτας) αλλά και για όσα θέλετε να αποφύγει. Η λίστα προς αποφυγή είναι εξίσου σημαντική με τη λίστα προτιμήσεων.\n\n## 4. Ρωτήστε για εξοπλισμό και εφεδρικό σχέδιο\nΗχοσύστημα κατάλληλο για τον χώρο, μικρόφωνο για τους χαιρετισμούς και εφεδρικός εξοπλισμός αν κάτι πάει στραβά. Ρωτήστε και πότε θα φτάσει στον χώρο για να στήσει.\n\n## 5. Ζητήστε ξεκάθαρη τιμή\nΝα ξέρετε τι περιλαμβάνει το πακέτο (ώρες, φωτισμός, μικρόφωνο, συνάντηση) και τι χρεώνεται ως extra. Μια ξεκάθαρη προσφορά πριν την κράτηση αποφεύγει εκπλήξεις.\n\n## Θέλετε να μιλήσουμε;\nΑν ψάχνετε DJ για γάμο, βάφτιση ή πάρτι, στείλτε μας ημερομηνία και περιοχή και θα ελέγξουμε διαθεσιμότητα.", "date": "2026-10-17", "visible": true}];
export const posts = ((data as unknown as { posts?: Post[] }).posts ?? seedPosts).filter((p) => p.visible && p.slug && p.title);
export const telHref = "tel:" + g.phone.replace(/\s/g, "");
export const waHref = "https://wa.me/" + g.whatsapp.replace(/[^\d]/g, "") + "?text=" + encodeURIComponent("Γεια σου, ενδιαφέρομαι για DJ για την εκδήλωσή μου.");
