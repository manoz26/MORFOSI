/**
 * Τα μόνα νούμερα που δείχνει το site για το φροντιστήριο.
 *
 * Κανόνας: κανένα στατιστικό που δεν έχει μετρηθεί. Ποσοστά επιτυχίας,
 * «ικανοποίηση», σύνολα επιτυχόντων κ.λπ. αφαιρέθηκαν (Σεπ 2026) επειδή
 * δεν υπήρχε πηγή. Ό,τι μπαίνει εδώ είναι είτε επιβεβαιωμένο από το
 * φροντιστήριο είτε μετριέται ζωντανά από το Sanity.
 */
export const FOUNDING_YEAR = 2001;

export function yearsOfExperience(now = new Date()) {
  return now.getFullYear() - FOUNDING_YEAR;
}

/** Καθηγητές και εκδόσεις όπως είναι καταχωρημένοι στο Studio. */
export const FACT_COUNTS_QUERY = `{
  "teachers": count(*[_type == "teacher"]),
  "books": count(*[_type == "book"])
}`;

export type FactCounts = { teachers: number; books: number };
