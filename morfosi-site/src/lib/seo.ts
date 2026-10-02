import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const SITE_NAME = "Φροντιστήριο Μόρφωση";
export const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME };

/**
 * Metadata ανά σελίδα: τίτλος, περιγραφή, canonical και προεπισκόπηση για
 * Viber/Facebook/Messenger. Το Next κάνει ρηχό merge, οπότε μια σελίδα που
 * δεν ορίζει δικό της openGraph θα κληρονομούσε τον τίτλο της αρχικής —
 * γι' αυτό κάθε σελίδα περνάει από εδώ.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const images = image ? [{ url: image, alt: title }] : [OG_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "el_GR",
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export const HOME_TITLE = "Φροντιστήριο Μόρφωση | Γυμνάσιο & Λύκειο — Πετρούπολη";
export const HOME_DESCRIPTION =
  "Φροντιστήριο Μέσης Εκπαίδευσης στον Άγιο Δημήτριο Πετρούπολης από το 2001. Μαθήματα Γυμνασίου και Λυκείου, προετοιμασία για τις Πανελλαδικές, υπολογιστής μορίων.";
