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
  // The fallback can also render async page content (e.g. live packages).
  // Keep that content inside its own boundary so Cache Components can prerender it safely.
  const fallback = <>{props.header}<main><Suspense fallback={<div className="min-h-screen" />}>{props.children}</Suspense></main>{props.footer}{props.floating}</>;
  return <Suspense fallback={fallback}><SiteChromeContent {...props} /></Suspense>;
}
