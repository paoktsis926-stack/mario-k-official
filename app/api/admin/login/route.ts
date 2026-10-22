import { NextResponse } from "next/server";
import { passwordOk, sign } from "@/lib/adminAuth";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; startedAt: number; lockedUntil: number }>();

function clientKey(request: Request) {
  return (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown").split(",")[0].trim().slice(0, 100);
}

async function sharedLimit(key: string, failed: boolean) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const script = failed
    ? 'local lock=redis.call("TTL",KEYS[2]); if lock > 0 then return {0,lock}; end; local n=redis.call("INCR",KEYS[1]); if n == 1 then redis.call("EXPIRE",KEYS[1],ARGV[1]); end; if n >= tonumber(ARGV[2]) then redis.call("SET",KEYS[2],"1","EX",ARGV[3]); return {0,tonumber(ARGV[3])}; end; return {1,0};'
    : 'redis.call("DEL",KEYS[1],KEYS[2]); return {1,0};';
  const response = await fetch(url.replace(/\\/$/, ""), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["EVAL", script, "2", `mario-k:admin:attempts:${key}`, `mario-k:admin:lock:${key}`, String(WINDOW_MS / 1000), String(MAX_FAILURES), String(LOCK_MS / 1000)]),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Η υπηρεσία προστασίας σύνδεσης δεν είναι διαθέσιμη.");
  const payload = await response.json();
  if (payload.error) throw new Error("Η υπηρεσία προστασίας σύνδεσης δεν είναι διαθέσιμη.");
  return payload.result as [number, number];
}

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET)
    return NextResponse.json({ ok: false, message: "Λείπουν τα ADMIN_PASSWORD / ADMIN_SECRET." }, { status: 500 });
  const key = clientKey(request);
  const now = Date.now();
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !passwordOk(password)) {
    let lockedSeconds = 0;
    try {
      const shared = await sharedLimit(key, true);
      if (shared) {
        if (shared[0] === 0) lockedSeconds = Math.max(1, Number(shared[1]) || LOCK_MS / 1000);
      } else {
        const previous = attempts.get(key);
        if (previous?.lockedUntil && previous.lockedUntil > now) lockedSeconds = Math.ceil((previous.lockedUntil - now) / 1000);
        else {
          if (previous && now - previous.startedAt >= WINDOW_MS) attempts.delete(key);
          const state = attempts.get(key);
          const nextState = !state || now - state.startedAt >= WINDOW_MS
            ? { count: 1, startedAt: now, lockedUntil: 0 }
            : { ...state, count: state.count + 1 };
          if (nextState.count >= MAX_FAILURES) nextState.lockedUntil = now + LOCK_MS;
          attempts.set(key, nextState);
          if (nextState.lockedUntil > now) lockedSeconds = Math.ceil((nextState.lockedUntil - now) / 1000);
        }
      }
    } catch {
      return NextResponse.json({ ok: false, message: "Η προστασία σύνδεσης δεν είναι διαθέσιμη. Δοκιμάστε ξανά." }, { status: 503 });
    }
    await new Promise((r) => setTimeout(r, 700));
    const locked = lockedSeconds > 0;
    return NextResponse.json({ ok: false, message: locked ? `Πολλές αποτυχημένες προσπάθειες. Δοκιμάστε ξανά σε ${lockedSeconds} δευτερόλεπτα.` : "Λάθος κωδικός." }, { status: locked ? 429 : 401, headers: locked ? { "Retry-After": String(lockedSeconds) } : undefined });
  }
  try {
    const shared = await sharedLimit(key, false);
    if (shared) attempts.delete(key);
    else attempts.delete(key);
  } catch {
    return NextResponse.json({ ok: false, message: "Η προστασία σύνδεσης δεν είναι διαθέσιμη. Δοκιμάστε ξανά." }, { status: 503 });
  }
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
