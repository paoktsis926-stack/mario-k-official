import data from "@/data/content.json";

export const site = data.site as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export const g = site.global as Record<string, string>;
export const eventTypes = data.eventTypes;
export const services = data.services;
export const packages = data.packages;
export const faq = data.faq;
export const photos = data.photos;

type Review = { name: string; stars: number; text: string; date: string; visible: boolean };
export const reviews = ((data as unknown as { reviews?: Review[] }).reviews ?? []).filter((r) => r.visible && r.text);
export const GOOGLE_REVIEW_URL = "https://g.page/r/CdbV_Zn66vpoEBM/review";
export const eventName = (id: string | null) => eventTypes.find((e) => e.id === id)?.name ?? "";
export const telHref = "tel:" + g.phone.replace(/\s/g, "");
export const waHref = "https://wa.me/" + g.whatsapp.replace(/[^\d]/g, "");
