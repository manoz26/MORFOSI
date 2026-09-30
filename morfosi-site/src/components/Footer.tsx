import { client } from "@/sanity/client";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  contactEmail,
  contactPhone,
  address,
  socialMedia {
    facebook,
    instagram,
    youtube
  }
}`;

export default async function Footer() {
  const settings = await client.fetch(SETTINGS_QUERY);

  return (
    <footer className="bg-[#031516] text-white border-t-[12px] border-brand-orange w-full relative overflow-hidden">
      
      {/* Διακοσμητικό τεράστιο background text που εκτείνεται σε όλο το πλάτος */}
      <h2 className="absolute -bottom-4 lg:-bottom-12 left-1/2 -translate-x-1/2 w-full text-center text-[13vw] leading-none font-black opacity-5 whitespace-nowrap pointer-events-none select-none tracking-widest">
        ΜΟΡΦΩΣΗ
      </h2>

      {/* Στο κινητό η σταθερή μπάρα CTA (55px + safe area) σκέπαζε το copyright και
          τους συνδέσμους όρων — εξ ου το επιπλέον padding κάτω. */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 border-b border-gray-800 pb-16">
          
          {/* 1. Logo & About */}
          <div className="flex flex-col">
            <Link href="/" className="mb-6 block w-56">
              <Image src="/morfosi.jpg" alt="Μόρφωση" width={200} height={48} className="w-full h-auto object-contain" />
            </Link>
            <p className="text-gray-400 font-medium text-sm leading-relaxed mb-8">
              Ο μεγαλύτερος Εκπαιδευτικός Οργανισμός στην Ελλάδα. Σχεδιάζουμε το μέλλον της εκπαίδευσης με γνώμονα την αριστεία και την καινοτομία.
            </p>
            {/* Input field fake interaction for aesthetics */}
            <div className="flex w-full mt-auto">
              <input type="email" placeholder="Email για Νέα" aria-label="Email για ενημερώσεις" className="bg-gray-800 text-white px-4 py-3 w-full text-base md:text-xs font-bold outline-none placeholder:text-gray-500 focus:bg-gray-700 transition-colors" />
              <button aria-label="Εγγραφή στο Newsletter" className="bg-brand-teal px-4 text-white hover:bg-brand-orange transition-colors flex items-center justify-center">
                 <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* 2. Γρήγοροι Σύνδεσμοι */}
          <div className="flex flex-col">
            <h4 className="text-lg font-black uppercase tracking-widest text-brand-teal mb-6">Συνδεσμοι</h4>
            <div className="flex flex-col gap-4 font-bold text-sm tracking-wide text-gray-400">
               <Link href="/" className="hover:text-brand-orange transition-colors w-fit flex items-center gap-2 group">
                 <div className="w-1 h-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" /> Αρχική
               </Link>
               <Link href="/about" className="hover:text-brand-orange transition-colors w-fit flex items-center gap-2 group">
                 <div className="w-1 h-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" /> Σχετικά με Εμάς
               </Link>
               <Link href="/teachers" className="hover:text-brand-orange transition-colors w-fit flex items-center gap-2 group">
                 <div className="w-1 h-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" /> Οι Καθηγητές μας
               </Link>
               <Link href="/prosanatolismos" className="hover:text-brand-orange transition-colors w-fit flex items-center gap-2 group">
                 <div className="w-1 h-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" /> Επαγγελματικός Προσανατολισμός
               </Link>
               <Link href="/plano" className="hover:text-brand-orange transition-colors w-fit flex items-center gap-2 group">
                 <div className="w-1 h-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" /> Προγράμματα Σπουδών
               </Link>
               <Link href="/#testimonials" className="hover:text-brand-orange transition-colors w-fit flex items-center gap-2 group">
                 <div className="w-1 h-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" /> Ιστορίες Επιτυχίας
               </Link>
               <Link href="/news" className="hover:text-brand-orange transition-colors w-fit flex items-center gap-2 group">
                 <div className="w-1 h-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" /> Νέα & Ανακοινώσεις
               </Link>
            </div>
          </div>

          {/* 3. Επικοινωνία (Από το Sanity) */}
          <div className="flex flex-col">
            <h4 className="text-lg font-black uppercase tracking-widest text-brand-green mb-6">Επικοινωνια</h4>
            <div className="flex flex-col gap-6 text-gray-400 text-sm font-bold">
               <div className="flex items-start gap-4 hover:text-white transition-colors cursor-default">
                  <MapPin className="text-brand-green flex-shrink-0 mt-1" size={20} />
                  <p className="leading-relaxed">{settings?.address || 'Διεύθυνση: Συμπληρώστε στο /studio'}</p>
               </div>
               <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer group">
                  <Phone className="text-brand-green flex-shrink-0 group-hover:text-brand-orange transition-colors" size={20} />
                  <p>{settings?.contactPhone || '210 0000000'}</p>
               </div>
               <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer group">
                  <Mail className="text-brand-green flex-shrink-0 group-hover:text-brand-orange transition-colors" size={20} />
                  <p>{settings?.contactEmail || 'info@morfosi.edu.gr'}</p>
               </div>
            </div>
          </div>

          {/* 4. Social Media */}
          <div className="flex flex-col">
            <h4 className="text-lg font-black uppercase tracking-widest text-brand-purple mb-6">Ακολουθηστε Μας</h4>
            <div className="flex gap-4">
              <a href={settings?.socialMedia?.facebook || '#'} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 hover:bg-[#1877F2] hover:-translate-y-1 transition-all text-white">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={settings?.socialMedia?.instagram || '#'} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:-translate-y-1 transition-all text-white">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={settings?.socialMedia?.youtube || '#'} aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 hover:bg-[#FF0000] hover:-translate-y-1 transition-all text-white">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
            
            <div className="mt-auto pt-8">
               <Link href="/contact#enrollment-form" className="bg-brand-red text-white py-2 px-4 inline-block font-black text-xs tracking-widest uppercase hover:bg-white hover:text-brand-red transition-colors cursor-pointer">
                  Online Εγγραφες
               </Link>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-600 uppercase tracking-widest">
           <p>© {new Date().getFullYear()} Εκπαιδευτικός Οργανισμός Μόρφωση.</p>
           <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div className="flex gap-6">
                <Link href="/terms" className="hover:text-brand-teal transition-colors">Οροι Χρησης</Link>
                <Link href="/privacy" className="hover:text-brand-teal transition-colors">Πολιτικη Απορρητου</Link>
              </div>
              <a 
                href="mailto:chronakesm@gmail.com" 
                className="text-[10px] text-gray-700 hover:text-white transition-colors border-l border-gray-800 pl-8 hidden md:block"
              >
                Built by Εμμανουήλ Χρονάκης
              </a>
              <a 
                href="mailto:chronakesm@gmail.com" 
                className="text-[10px] text-gray-700 hover:text-white transition-colors md:hidden"
              >
                Built by Εμμανουήλ Χρονάκης
              </a>
           </div>
        </div>
      </div>
    </footer>
  );
}
