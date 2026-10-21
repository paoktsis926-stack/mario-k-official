import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Αίτημα Κράτησης DJ | MARIO K",
  description: "Στείλτε αίτημα για DJ για γάμο, βάπτιση, bachelor party, γενέθλια ή ιδιωτική εκδήλωση. Συμπληρώστε ημερομηνία και περιοχή για έλεγχο διαθεσιμότητας.",
  alternates: { canonical: "/booking" },
  robots: { index: true, follow: true },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
