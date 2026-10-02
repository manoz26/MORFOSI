import { pageMetadata } from "@/lib/seo";

// Η σελίδα είναι client component, οπότε τα metadata ζουν εδώ.
export const metadata = pageMetadata({
  title: "Ακαδημαϊκός Προσανατολισμός | Φροντιστήριο Μόρφωση",
  description: "Συμβουλευτική σταδιοδρομίας για μαθητές και γονείς: ερωτηματολόγιο, ατομική συνεδρία με ειδικό και επιλογή σχολής πριν το μηχανογραφικό.",
  path: "/prosanatolismos",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
