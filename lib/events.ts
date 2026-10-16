export const slugOf = (name: string) =>
  /γ[άα]μ/i.test(name) ? "wedding" : /β[άα][φπ]τ/i.test(name) ? "baptism" : /bachelor/i.test(name) ? "bachelorette"
  : /club|\bbar\b/i.test(name) ? "club" : /εταιρ/i.test(name) ? "corporate" : /karaoke/i.test(name) ? "karaoke" : "private-party";

export const copy: Record<string, { h: string; t: string }> = {
  wedding: { h: "Η μουσική που θα θυμάστε για πάντα", t: "Από την είσοδο μέχρι τον τελευταίο χορό, η μουσική του γάμου σας με στυλ και συναίσθημα." },
  baptism: { h: "Μια γιορτή γεμάτη χαρά", t: "Μουσική και ατμόσφαιρα για μικρούς και μεγάλους, χωρίς άγχος για εσάς." },
  "private-party": { h: "Η πίστα δεν αδειάζει ποτέ", t: "Πάρτι και ιδιωτικές βραδιές με ήχο, φώτα και ενέργεια από την πρώτη νότα." },
  bachelorette: { h: "Μια βραδιά που δεν ξεχνιέται", t: "Bachelorette και bachelor party με μουσική στα μέτρα της παρέας σας." },
  club: { h: "Ο ήχος της νύχτας", t: "DJ sets για club και bar με ενέργεια που κρατά τον κόσμο στην πίστα." },
  corporate: { h: "Εκδηλώσεις με επαγγελματισμό", t: "Μουσική και τεχνική κάλυψη για εταιρικά events, εγκαίνια και ειδικές εκδηλώσεις." },
  karaoke: { h: "Όλοι στο μικρόφωνο", t: "Karaoke, παιχνίδια και διασκέδαση για κάθε παρέα." },
};
