import "server-only";

import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./client";

/**
 * Client με δικαίωμα εγγραφής, ΜΟΝΟ για server code (API routes).
 *
 * Το `server-only` import κάνει το build να αποτύχει αν κάποιος το εισάγει
 * κατά λάθος σε client component — που θα σήμαινε ότι το token φεύγει στον
 * browser κάθε επισκέπτη.
 *
 * Το `SANITY_API_WRITE_TOKEN` ορίζεται στο Vercel (Production/Preview/Development)
 * και τοπικά στο `.env.local`. Δεν έχει πρόθεμα `NEXT_PUBLIC_` ακριβώς για να
 * μην μπορεί να γίνει bundle στον client.
 */
const token = process.env.SANITY_API_WRITE_TOKEN;

export const hasWriteAccess = Boolean(token);

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});
