import { createClient } from "next-sanity";

/**
 * Τα `NEXT_PUBLIC_SANITY_*` υπάρχουν ήδη στο Vercel αλλά μέχρι τώρα τα διάβαζε
 * μόνο το `sanity.config.ts` (το Studio) — εδώ ήταν γραμμένα στο χέρι, οπότε
 * αλλαγή dataset δεν θα είχε καμία επίδραση στο site. Τα fallback κρατούν το
 * project να δουλεύει και χωρίς env vars (π.χ. σε καθαρό clone).
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "bbuv8qjb";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // false για να βλέπουμε αμέσως τις αλλαγές στο localhost
});
