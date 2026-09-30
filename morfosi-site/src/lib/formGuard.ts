import "server-only";

import { z } from "zod";

/**
 * Προστασία φορμών χωρίς εξωτερική υπηρεσία (ούτε captcha, ούτε Redis).
 *
 * Τρία ανεξάρτητα φίλτρα:
 *
 * 1. **Honeypot** — κρυφό πεδίο που ο άνθρωπος δεν βλέπει. Τα περισσότερα bots
 *    συμπληρώνουν ό,τι input βρουν, οπότε αν έχει τιμή είναι bot.
 * 2. **Χρόνος συμπλήρωσης** — η φόρμα στέλνει πότε φορτώθηκε. Κάτω από 3
 *    δευτερόλεπτα δεν προλαβαίνει άνθρωπος να γράψει όνομα, τηλέφωνο και email.
 * 3. **Rate limit ανά IP** — best effort, βλ. σχόλιο παρακάτω.
 *
 * Όταν πιάσουμε spam επιστρέφουμε κανονικό success: αν πούμε στο bot ότι
 * μπλοκαρίστηκε, ο συγγραφέας του το διορθώνει. Απλώς δεν αποθηκεύουμε τίποτα.
 */

/** Πεδία που προσθέτει κάθε φόρμα πέρα από τα δικά της δεδομένα. */
export const guardFieldsSchema = z.object({
  /** Honeypot: πρέπει να είναι κενό. */
  _hp: z.string().optional(),
  /** Timestamp (ms) της στιγμής που φορτώθηκε η φόρμα. */
  _t: z.number().optional(),
});

const MIN_FILL_MS = 3000;

/**
 * Honeypot: ουσιαστικά μηδενικά false positives — άνθρωπος δεν βλέπει το πεδίο.
 * Μόνο αυτό δικαιολογεί σιωπηλή απόρριψη.
 */
export function isHoneypotTripped(guard: { _hp?: string }): boolean {
  return Boolean(guard._hp && guard._hp.trim() !== "");
}

/**
 * Υποψία βάσει χρόνου — ΔΕΝ είναι λόγος να πεταχτεί η υποβολή.
 *
 * Το `_t` καταγράφεται στο hydration, όχι στο πρώτο render. Σε αργό κινητό το
 * hydration μπορεί να αργήσει αρκετά ώστε ένας γονιός που ήδη διάβαζε τη φόρμα
 * να υποβάλει «μέσα σε 3 δευτερόλεπτα» από τη σκοπιά του server. Αν το
 * πετούσαμε, θα χάναμε πραγματική εγγραφή — ακριβώς το πρόβλημα που λύνουμε.
 * Οπότε αποθηκεύουμε κανονικά και απλώς το σημαδεύουμε για έλεγχο.
 */
export function isSuspiciouslyFast(guard: { _t?: number }): boolean {
  if (typeof guard._t !== "number" || !Number.isFinite(guard._t)) return false;
  const elapsed = Date.now() - guard._t;
  // Αρνητικό elapsed = ρολόι πελάτη στο μέλλον· το αγνοούμε.
  return elapsed >= 0 && elapsed < MIN_FILL_MS;
}

/**
 * Rate limit ανά IP.
 *
 * ΠΡΟΣΟΧΗ: σε serverless (Vercel) κάθε instance έχει δική της μνήμη και τα cold
 * starts τη μηδενίζουν, άρα ΔΕΝ είναι αξιόπιστο όριο — είναι φίλτρο για
 * καταιγισμό από το ίδιο warm instance. Η πραγματική προστασία είναι ο
 * honeypot και ο έλεγχος χρόνου. Για σκληρό όριο θα χρειαζόταν Upstash/KV.
 *
 * Το προηγούμενο implementation δεν καθάριζε ποτέ το Map — σε instance με
 * μεγάλη διάρκεια ζωής μεγάλωνε επ' άπειρον.
 */
const hits = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT = 6;
const WINDOW_MS = 60 * 1000;

function sweepExpired(now: number) {
  for (const [key, entry] of hits) {
    if (now - entry.windowStart > WINDOW_MS) hits.delete(key);
  }
}

/**
 * Το `bucket` κρατάει ξεχωριστό μετρητή ανά φόρμα. Οι δύο φόρμες μοιράζονται
 * αυτό το module, οπότε με κοινό μετρητή ένας γονιός που έστειλε μηνύματα στο
 * /contact θα έβρισκε την αίτηση εγγραφής μπλοκαρισμένη — η πιο πολύτιμη
 * ενέργεια του site.
 */
export function withinRateLimit(bucket: string, ip: string): boolean {
  const now = Date.now();

  // Φτηνό σκούπισμα: μόνο όταν το Map αρχίζει να μεγαλώνει.
  if (hits.size > 500) sweepExpired(now);

  const key = `${bucket}:${ip}`;
  const entry = hits.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count += 1;
  return true;
}

/** Η IP του επισκέπτη πίσω από το proxy του Vercel. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  // Το x-forwarded-for είναι λίστα· η πρώτη είναι του πελάτη.
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
