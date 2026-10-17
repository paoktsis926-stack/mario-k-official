"use client";
import { useEffect } from "react";
import { applyTheme } from "@/lib/events";

export default function SetTheme({ slug }: { slug: string }) {
  useEffect(() => { applyTheme(slug); }, [slug]);
  return null;
}
