/**
 * Μικρό consent store για τα cookies — μηδέν dependencies.
 *
 * Το διαβάζουν και τα δύο components μέσω `useSyncExternalStore`, που είναι ο
 * τρόπος του React για client-only state χωρίς hydration mismatch: ο server
 * κάνει render με το `getServerSnapshot` (πάντα `null`) και ο client
 * επανασυγχρονίζεται αμέσως μετά την hydration.
 */

export type ConsentValue = "granted" | "denied";

const STORAGE_KEY = "morfosi_cookie_consent";

const listeners = new Set<() => void>();

/**
 * Το `useSyncExternalStore` απαιτεί σταθερή αναφορά μεταξύ των renders, οπότε
 * κρατάμε cache και την ανανεώνουμε μόνο όταν αλλάζει πραγματικά η τιμή.
 * `undefined` = δεν έχει διαβαστεί ακόμα, `null` = δεν έχει απαντήσει ο χρήστης.
 */
let cached: ConsentValue | null | undefined;

function readFromStorage(): ConsentValue | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "granted" || raw === "denied") return raw;
    // Παλιά έκδοση του banner αποθήκευε σκέτο "true" — μη ξαναρωτάς όποιον είχε ήδη δεχτεί.
    if (raw === "true") return "granted";
    return null;
  } catch {
    // Ιδιωτική περιήγηση / μπλοκαρισμένο storage
    return null;
  }
}

export function getSnapshot(): ConsentValue | null {
  if (cached === undefined) cached = readFromStorage();
  return cached;
}

export function getServerSnapshot(): ConsentValue | null {
  return null;
}

export function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function setConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Αν δεν γράφεται το storage, κρατάμε τουλάχιστον την επιλογή για το session.
  }
  cached = value;
  listeners.forEach((listener) => listener());
}
