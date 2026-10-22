import { NextResponse } from "next/server";
import { passwordOk, sign } from "@/lib/adminAuth";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; startedAt: number; lockedUntil: number }>();

function clientKey(request: Request) {
  return (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown").split(",")[0].trim().slice(0, 100);
}

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET)
    return NextResponse.json({ ok: false, message: "Λείπουν τα ADMIN_PASSWORD / ADMIN_SECRET." }, { status: 500 });
  const key = clientKey(request);
  const now = Date.now();
  const previous = attempts.get(key);
  if (previous?.lockedUntil && previous.lockedUntil > now) {
    const seconds = Math.ceil((previous.lockedUntil - now) / 1000);
    return NextResponse.json({ ok: false, message: `Πολλές αποτυχημένες προσπάθειες. Δοκιμάστε ξανά σε ${seconds} δευτερόλεπτα.` }, { status: 429, headers: { "Retry-After": String(seconds) } });
  }
  if (previous && now - previous.startedAt >= WINDOW_MS) attempts.delete(key);

  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !passwordOk(password)) {
    const state = attempts.get(key);
    const nextState = !state || now - state.startedAt >= WINDOW_MS
      ? { count: 1, startedAt: now, lockedUntil: 0 }
      : { ...state, count: state.count + 1 };
    if (nextState.count >= MAX_FAILURES) nextState.lockedUntil = now + LOCK_MS;
    attempts.set(key, nextState);
    await new Promise((r) => setTimeout(r, 700));
    const locked = nextState.lockedUntil > now;
    return NextResponse.json({ ok: false, message: locked ? "Πολλές αποτυχημένες προσπάθειες. Η πρόσβαση κλειδώθηκε για 15 λεπτά." : "Λάθος κωδικός." }, { status: locked ? 429 : 401, headers: locked ? { "Retry-After": String(LOCK_MS / 1000) } : undefined });
  }
  attempts.delete(key);
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
