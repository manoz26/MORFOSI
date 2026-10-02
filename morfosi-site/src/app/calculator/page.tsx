import type { Metadata } from 'next';
import CalculatorWizard from '@/components/calculator/CalculatorWizard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { client } from '@/sanity/client';

export const metadata: Metadata = {
  title: 'Υπολογισμός Μορίων | Μόρφωση Φροντιστήριο',
  description: 'Υπολογίστε τα μόριά σας με ακρίβεια βάσει των νέων συντελεστών βαρύτητας.',
};

export default async function CalculatorPage() {
  let contactPhone = "21 0506 3630";
  try {
    const settings = await client.fetch(`*[_type == "siteSettings"][0]{ contactPhone }`);
    if (settings?.contactPhone) {
      contactPhone = settings.contactPhone;
    }
  } catch (e) {
    // fallback to default
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
       {/* Sharp Light Theme Navigation Bar */}
       <header className="w-full bg-white border-b-[3px] border-gray-900 relative z-50">
          <div className="w-full px-6 py-4 flex items-center justify-between">
             <Link href="/" className="font-black text-xl md:text-2xl uppercase tracking-tighter text-gray-900 flex items-center gap-3 hover:text-brand-teal transition-colors group">
                <div className="w-10 h-10 bg-brand-orange border-[3px] border-gray-900 flex items-center justify-center text-white group-hover:bg-brand-teal transition-colors shadow-[2px_2px_0px_#111]">
                   <ArrowLeft size={20} strokeWidth={3} />
                </div>
                ΕΠΙΣΤΡΟΦΗ <span className="text-brand-orange">ΣΤΗΝ ΑΡΧΙΚΗ</span>
             </Link>
             
             <nav className="hidden md:flex items-center gap-8 font-black uppercase tracking-widest text-xs text-gray-500">
                <Link href="/#programs" className="hover:text-gray-900 transition-colors">ΠΡΟΓΡΑΜΜΑΤΑ</Link>
                <Link href="/books" className="hover:text-gray-900 transition-colors">ΕΚΔΟΣΕΙΣ</Link>
                <Link href="/#contact" className="hover:text-gray-900 transition-colors">ΕΠΙΚΟΙΝΩΝΙΑ</Link>
             </nav>
          </div>
       </header>

       <CalculatorWizard contactPhone={contactPhone} />
    </main>
  );
}
