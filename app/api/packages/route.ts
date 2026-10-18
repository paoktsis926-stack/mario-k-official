import { NextResponse } from "next/server";
import { getPackages } from "@/lib/hubCatalog";

export async function GET() {
  const list = await getPackages();
  return NextResponse.json(list.map((p) => ({ label: `${p.name} — ${p.price_text}`, name: p.name, slugs: p.slugs })));
}
