import { pageMetadata } from "@/lib/seo";

// Η σελίδα είναι client component, οπότε τα metadata ζουν εδώ.
export const metadata = pageMetadata({
  title: "Επιτυχόντες Πανελλαδικών | Φροντιστήριο Μόρφωση",
  description: "Οι μαθητές του Φροντιστηρίου Μόρφωση που πέτυχαν στις Πανελλαδικές Εξετάσεις, με τις λίστες επιτυχόντων ανά χρονιά.",
  path: "/epityxontes",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
