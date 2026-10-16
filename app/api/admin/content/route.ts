import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { getFile, putFile } from "@/lib/github";

const PATH = "data/content.json";
const KEYS = ["site", "eventTypes", "services", "packages", "faq", "photos"];
const err = (message: string, status: number) => NextResponse.json({ ok: false, message }, { status });

export async function GET(request: Request) {
  if (!isAuthed(request)) return err("Μη εξουσιοδοτημένο.", 401);
  if (!process.env.GITHUB_TOKEN) return err("Λείπει το GITHUB_TOKEN.", 500);
  try {
    const { text, sha } = await getFile(PATH);
    return NextResponse.json({ ok: true, data: JSON.parse(text), sha });
  } catch (e) {
    return err(`Αποτυχία ανάγνωσης: ${(e as Error).message}`, 502);
  }
}

export async function PUT(request: Request) {
  if (!isAuthed(request)) return err("Μη εξουσιοδοτημένο.", 401);
  const { data, sha } = await request.json().catch(() => ({}));
  if (!data || typeof data !== "object" || !KEYS.every((k) => k in data)) return err("Μη έγκυρα δεδομένα.", 400);
  try {
    const b64 = Buffer.from(JSON.stringify(data, null, 1), "utf8").toString("base64");
    const newSha = await putFile(PATH, b64, "Admin: ενημέρωση περιεχομένου", sha);
    return NextResponse.json({ ok: true, sha: newSha });
  } catch (e) {
    const m = (e as Error).message;
    return err(m === "CONFLICT" ? "Το αρχείο άλλαξε στο μεταξύ. Κάνε refresh τη σελίδα." : m, m === "CONFLICT" ? 409 : 502);
  }
}
