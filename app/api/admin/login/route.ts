import { NextResponse } from "next/server";
import { passwordOk, sign } from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET)
    return NextResponse.json({ ok: false, message: "Λείπουν τα ADMIN_PASSWORD / ADMIN_SECRET." }, { status: 500 });
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !passwordOk(password)) {
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ ok: false, message: "Λάθος κωδικός." }, { status: 401 });
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
