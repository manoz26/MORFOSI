import { pageMetadata } from "@/lib/seo";

// Η σελίδα είναι client component, οπότε τα metadata ζουν εδώ.
export const metadata = pageMetadata({
  title: "Η Ιστορία μας | Φροντιστήριο Μόρφωση",
  description: "Το Φροντιστήριο Μόρφωση λειτουργεί από το 2001 στον Άγιο Δημήτριο Πετρούπολης. Γνωρίστε την ιστορία, τις αξίες και την ομάδα μας.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
