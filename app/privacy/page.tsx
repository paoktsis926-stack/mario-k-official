import Link from "next/link";

export const metadata = { title: "Πολιτική Απορρήτου — MARIO K" };

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-8 text-white/70">
      <Link href="/" className="text-[#C7A66A]">← MARIO K</Link>
      <h1 className="mt-8 text-3xl text-[#F5F1E8]">Πολιτική Απορρήτου</h1>
      <p className="mt-6">Μέσω της φόρμας κράτησης συλλέγουμε όνομα, email, τηλέφωνο και στοιχεία της εκδήλωσης, αποκλειστικά για να απαντήσουμε στο αίτημά σας και να οργανώσουμε την εκδήλωση. Δεν διαβιβάζουμε τα δεδομένα σε τρίτους για διαφημιστικούς σκοπούς και τα διατηρούμε μόνο για όσο χρειάζεται.</p>
      <p className="mt-4">Μπορείτε οποιαδήποτε στιγμή να ζητήσετε πρόσβαση, διόρθωση ή διαγραφή των στοιχείων σας επικοινωνώντας στο +30 698 707 3580.</p>
      <p className="mt-4 text-white/40">Το κείμενο είναι βασικό· προσθέστε επωνυμία/ΑΦΜ υπεύθυνου επεξεργασίας και ελέγξτε το νομικά.</p>
    </main>
  );
}
