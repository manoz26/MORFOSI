import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Πλάνο Σπουδών | Γυμνάσιο — Λύκειο — ΕΠΑΛ | Φροντιστήριο Μόρφωση",
  description:
    "Ανακάλυψε το εξατομικευμένο πλάνο σπουδών για Γυμνάσιο, Λύκειο και ΕΠΑΛ. Μικρά τμήματα, εβδομαδιαία αξιολόγηση, προετοιμασία για τις Πανελλήνιες. Κάνε την εγγραφή σου σήμερα.",
  path: "/plano",
});

export default function PlanoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
