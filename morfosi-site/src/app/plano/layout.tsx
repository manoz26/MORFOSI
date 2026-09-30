import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Πλάνο Σπουδών | Γυμνάσιο — Λύκειο — ΕΠΑΛ | Φροντιστήριο Μόρφωση',
  description:
    'Ανακάλυψε το εξατομικευμένο πλάνο σπουδών για Γυμνάσιο, Λύκειο και ΕΠΑΛ. Μικρά τμήματα, εβδομαδιαία αξιολόγηση, προετοιμασία για τις Πανελλήνιες. Κάνε την εγγραφή σου σήμερα.',
  openGraph: {
    title: 'Πλάνο Σπουδών | Φροντιστήριο Μόρφωση',
    description: 'Πλάνο για Γυμνάσιο, Λύκειο & ΕΠΑΛ με μικρά τμήματα και εβδομαδιαία αξιολόγηση.',
    type: 'website',
    locale: 'el_GR',
  },
};

export default function PlanoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
