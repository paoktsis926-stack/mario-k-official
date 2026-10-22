"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

type SiteChromeProps = { header: React.ReactNode; footer: React.ReactNode; floating: React.ReactNode; children: React.ReactNode };

function SiteChromeContent({ header, footer, floating, children }: SiteChromeProps) {
  const admin = usePathname().startsWith("/admin");
  if (admin) return <>{children}</>;
  return <>{header}<main>{children}</main>{footer}{floating}</>;
}

export default function SiteChrome(props: SiteChromeProps) {
  const fallback = <>{props.header}<main>{props.children}</main>{props.footer}{props.floating}</>;
  return <Suspense fallback={fallback}><SiteChromeContent {...props} /></Suspense>;
}
