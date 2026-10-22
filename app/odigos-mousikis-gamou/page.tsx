import type { Metadata } from "next";
import { WeddingGuide } from "@/components/LeadFeatures";
import { leadFeatures } from "@/lib/content";
export const metadata:Metadata={title:"Δωρεάν Οδηγός Μουσικής Γάμου | MARIO K",description:"Δωρεάν οδηγός μουσικής γάμου με χρονοδιάγραμμα βραδιάς και ερωτηματολόγιο τραγουδιών.",alternates:{canonical:"/odigos-mousikis-gamou"}};
export default function WeddingGuidePage(){return <main className="min-h-screen bg-[#f5f2eb]"><WeddingGuide settings={leadFeatures?.guide}/></main>;}
