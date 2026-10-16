"use client";
import { usePathname } from "next/navigation";

export default function SiteChrome({ header, footer, floating, children }: { header: React.ReactNode; footer: React.ReactNode; floating: React.ReactNode; children: React.ReactNode }) {
  const admin = usePathname().startsWith("/admin");
  if (admin) return <>{children}</>;
  return <>{header}<main>{children}</main>{footer}{floating}</>;
}
