"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookLink({ event, pkg, lp, className, children }: { event: string; pkg?: string; lp: string; className?: string; children: React.ReactNode }) {
  const [utm, setUtm] = useState("");
  useEffect(() => { setUtm(new URLSearchParams(location.search).get("utm_source") || ""); }, []);
  const src = [lp, utm].filter(Boolean).join("-");
  return <Link href={`/booking?event=${event}${pkg ? `&package=${encodeURIComponent(pkg)}` : ""}&src=${encodeURIComponent(src)}`} className={className}>{children}</Link>;
}
