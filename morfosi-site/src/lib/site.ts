/**
 * Το domain του site σε ένα σημείο. Το morfosi.edu.gr ΔΕΝ είναι δικό μας
 * (σερβίρει άλλο, παλιό site) — όλα τα links, το sitemap και το JSON-LD
 * πρέπει να δείχνουν εδώ.
 */
export const SITE_DOMAIN = "morfosifrontistirio.gr";
// Το Vercel σερβίρει το www ως κύριο· το σκέτο domain κάνει 308 εκεί.
export const SITE_URL = `https://www.${SITE_DOMAIN}`;

/** Fallback όταν το Sanity δεν έχει contactEmail. Ίδιο με το siteSettings. */
export const CONTACT_EMAIL = "morfosifront@gmail.com";
