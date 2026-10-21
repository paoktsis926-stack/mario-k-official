import { NextResponse } from "next/server";
import { passwordOk, sign } from "@/lib/adminAuth";

const attempts = new Map<string, { count: number; start: number }>();
const LIMIT = 8;
const WINDOW = 15 * 60 * 1000;

function clientIp(request: Request) {
  return request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET)
    return NextResponse.json({ ok: false, message: "Λείπουν τα ADMIN_PASSWORD / ADMIN_SECRET." }, { status: 500 });
  const now = Date.now();
  const ip = clientIp(request);
  let attempt = attempts.get(ip);
  if (!attempt || now - attempt.start >= WINDOW) {
    attempt = { count: 0, start: now };
    attempts.set(ip, attempt);
  }
  if (attempt.count >= LIMIT) {
    return NextResponse.json({ ok: false, message: "Πάρα πολλές αποτυχημένες προσπάθειες. Δοκίμασε ξανά αργότερα." }, { status: 429 });
  }
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !passwordOk(password)) {
    attempt.count += 1;
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ ok: false, message: "Λάθος κωδικός." }, { status: 401 });
  }
  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", sign(Date.now() + 7 * 864e5), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 86400,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "", { path: "/", maxAge: 0 });
  return res;
}
