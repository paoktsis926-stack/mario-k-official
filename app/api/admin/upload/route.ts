import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { putFile } from "@/lib/github";

const IMAGE_TYPES = {
  "image/jpeg": { ext: "jpg", valid: (b: Buffer) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", valid: (b: Buffer) => b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/gif": { ext: "gif", valid: (b: Buffer) => b.length >= 6 && ["GIF87a", "GIF89a"].includes(b.subarray(0, 6).toString("ascii")) },
  "image/webp": { ext: "webp", valid: (b: Buffer) => b.length >= 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
} as const;

export async function POST(request: Request) {
  const fail = (message: string, status: number) => NextResponse.json({ ok: false, message }, { status });
  if (!isAuthed(request)) return fail("Μη εξουσιοδοτημένο.", 401);
  const file = (await request.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return fail("Δεν βρέθηκε αρχείο.", 400);
  if (file.size < 1 || file.size > 4 * 1024 * 1024) return fail("Η εικόνα πρέπει να είναι έως 4MB και όχι κενή.", 400);

  // Accept only raster formats with verified file signatures. SVG is intentionally rejected
  // because it can contain active content when served from the site's origin.
  const type = IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES];
  if (!type) return fail("Υποστηρίζονται μόνο JPEG, PNG, GIF και WebP. Το SVG δεν επιτρέπεται.", 415);

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!type.valid(bytes)) return fail("Το περιεχόμενο του αρχείου δεν αντιστοιχεί στον δηλωμένο τύπο εικόνας.", 415);

  const original = file.name.split(/[\\/]/).pop() || "image";
  const stem = original.replace(/\.[^.]*$/, "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "image";
  const name = `${Date.now()}-${stem}.${type.ext}`;
  try {
    await putFile(`public/uploads/${name}`, bytes.toString("base64"), `Admin: ανέβασμα ${name}`);
    return NextResponse.json({ ok: true, url: `/uploads/${name}` });
  } catch (e) {
    return fail((e as Error).message, 502);
  }
}
