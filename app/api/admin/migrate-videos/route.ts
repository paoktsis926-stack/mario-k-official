import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { getFile, putFile } from "@/lib/github";

export const maxDuration = 300;

const CONTENT_PATH = "data/content.json";
const allowedHosts = new Set(["base44.app", "media.base44.com"]);
const slug = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "video";

export async function POST(request: Request) {
  const fail = (message: string, status: number) => NextResponse.json({ ok: false, message }, { status });
  if (!isAuthed(request)) return fail("Μη εξουσιοδοτημένο.", 401);
  if (!process.env.GITHUB_TOKEN) return fail("Λείπει το GITHUB_TOKEN.", 500);
  if (!process.env.BLOB_READ_WRITE_TOKEN) return fail("Δεν έχει ρυθμιστεί η μόνιμη βιβλιοθήκη αρχείων.", 503);

  try {
    const current = await getFile(CONTENT_PATH);
    const data = JSON.parse(current.text);
    const videos = (Array.isArray(data.photos) ? data.photos : []).filter((photo: { video_url?: unknown }) => {
      if (typeof photo.video_url !== "string" || !photo.video_url.startsWith("https://")) return false;
      try { return allowedHosts.has(new URL(photo.video_url).hostname); } catch { return false; }
    });
    if (!videos.length) return NextResponse.json({ ok: true, migrated: 0, message: "Δεν βρέθηκαν βίντεο από Base44 για μεταφορά." });

    let migrated = 0;
    for (const photo of videos) {
      const sourceUrl = String(photo.video_url);
      const source = await fetch(sourceUrl, { cache: "no-store", signal: AbortSignal.timeout(60000) });
      if (!source.ok) throw new Error(`Δεν ήταν δυνατή η λήψη του βίντεο «${String(photo.title || "χωρίς τίτλο")}» (HTTP ${source.status}).`);
      const bytes = Buffer.from(await source.arrayBuffer());
      if (!bytes.length || bytes.length > 250 * 1024 * 1024) throw new Error("Το βίντεο είναι κενό ή ξεπερνά τα 250MB.");
      const pathPart = new URL(sourceUrl).pathname.toLowerCase();
      const sourceType = (source.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const byType: Record<string, { ext: string; type: string }> = {
        "video/quicktime": { ext: "mov", type: "video/quicktime" },
        "video/mp4": { ext: "mp4", type: "video/mp4" },
        "video/webm": { ext: "webm", type: "video/webm" },
        "video/x-m4v": { ext: "m4v", type: "video/x-m4v" },
        "application/octet-stream": { ext: pathPart.endsWith(".mov") ? "mov" : pathPart.endsWith(".webm") ? "webm" : "mp4", type: pathPart.endsWith(".mov") ? "video/quicktime" : pathPart.endsWith(".webm") ? "video/webm" : "video/mp4" },
      };
      const media = byType[sourceType];
      if (!media) throw new Error(`Το βίντεο «${String(photo.title || "χωρίς τίτλο")}» έχει μη υποστηριζόμενο τύπο αρχείου.`);
      const name = `videos/${slug(String(photo.title || "mario-k-event"))}-${Date.now()}.${media.ext}`;
      const uploaded = await fetch(`https://blob.vercel-storage.com/?pathname=${encodeURIComponent(name)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
          "x-api-version": "7",
          "x-content-type": media.type,
          "x-allow-overwrite": "true",
        },
        body: new Uint8Array(bytes),
        cache: "no-store",
      });
      const blob = await uploaded.json().catch(() => ({}));
      if (!uploaded.ok || typeof blob.url !== "string") throw new Error(`Αποτυχία αποθήκευσης του βίντεο (${uploaded.status}).`);
      photo.video_url = blob.url;
      migrated += 1;
    }

    const sha = await putFile(CONTENT_PATH, Buffer.from(JSON.stringify(data, null, 1), "utf8").toString("base64"), "Admin: migrate videos to Vercel Blob", current.sha);
    return NextResponse.json({ ok: true, migrated, sha, message: `Μεταφέρθηκαν ${migrated} βίντεο στη Vercel Blob και ενημερώθηκαν οι σύνδεσμοι. Το site θα ενημερωθεί μετά το deployment.` });
  } catch (error) {
    const message = (error as Error).message || "Αποτυχία μεταφοράς βίντεο.";
    return fail(message === "CONFLICT" ? "Το περιεχόμενο άλλαξε στο μεταξύ. Κάντε ανανέωση και δοκιμάστε ξανά." : message, message === "CONFLICT" ? 409 : 502);
  }
}
