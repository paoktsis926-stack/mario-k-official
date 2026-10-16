import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { putFile } from "@/lib/github";

export async function POST(request: Request) {
  const fail = (message: string, status: number) => NextResponse.json({ ok: false, message }, { status });
  if (!isAuthed(request)) return fail("Μη εξουσιοδοτημένο.", 401);
  const file = (await request.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return fail("Δεν βρέθηκε αρχείο.", 400);
  if (!file.type.startsWith("image/")) return fail("Μόνο εικόνες. Για βίντεο βάλε link (π.χ. YouTube).", 400);
  if (file.size > 4 * 1024 * 1024) return fail("Η εικόνα ξεπερνά τα 4MB. Μίκρυνέ την.", 400);
  const name = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
  try {
    await putFile(`public/uploads/${name}`, Buffer.from(await file.arrayBuffer()).toString("base64"), `Admin: ανέβασμα ${name}`);
    return NextResponse.json({ ok: true, url: `/uploads/${name}` });
  } catch (e) {
    return fail((e as Error).message, 502);
  }
}
