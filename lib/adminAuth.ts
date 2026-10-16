import { createHmac, timingSafeEqual } from "crypto";

const secret = () => process.env.ADMIN_SECRET || "";
const mac = (s: string) => createHmac("sha256", secret()).update(s).digest("hex");

export const sign = (exp: number) => `${exp}.${mac(String(exp))}`;

export function isAuthed(req: Request) {
  if (!secret()) return false;
  const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)admin=([^;]+)/);
  if (!m) return false;
  const [exp, sig] = decodeURIComponent(m[1]).split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = mac(exp);
  return sig.length === good.length && timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}

export function passwordOk(p: string) {
  const w = process.env.ADMIN_PASSWORD || "";
  if (!w) return false;
  const h = (x: string) => createHmac("sha256", "pw").update(x).digest();
  return timingSafeEqual(h(p), h(w));
}
