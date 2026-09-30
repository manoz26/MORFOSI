"use client";
import { ChevronRight, Calculator, FileText, GraduationCap, ArrowDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FOUNDING_YEAR, yearsOfExperience } from "@/lib/facts";

export default function Hero() {
  const router = useRouter();

  const handleLevelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      // Store selected level so plano page can auto-activate it
      sessionStorage.setItem('planoLevel', val);
      router.push('/plano');
    }
  };

  return (
    <section className="relative w-full min-h-[85svh] bg-brand-teal-dark overflow-hidden flex flex-col xl:flex-row pb-12 xl:pb-0">
      {/* Background Decor */}
      <div 
        className="absolute inset-0 opacity-[0.1] pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(#f97316 2px, transparent 2px), linear-gradient(90deg, #f97316 2px, transparent 2px)", 
          backgroundSize: "40px 40px" 
        }}
      ></div>

      {/* Left Content Area (Text & Links) */}
      <div className="w-full xl:w-[55%] flex flex-col justify-center px-6 lg:px-16 pt-16 xl:py-16 relative z-20">
        
        {/* Main Headline — Clear value proposition */}
        <h1 className="text-white text-[11vw] sm:text-[5rem] lg:text-[5.5rem] leading-[0.9] font-black tracking-tighter mb-6 uppercase drop-shadow-[4px_4px_0px_#000]">
          Πέρασε Στη <br/> Σχολη Που <br /><span className="text-brand-orange bg-black px-2 py-1 transform -rotate-2 inline-block">Θέλεις</span>
        </h1>
        
        {/* Subtitle — Why us in one line */}
        <div className="mb-10">
           <span className="text-white text-lg md:text-xl lg:text-2xl font-black bg-brand-orange border-4 border-black px-6 py-3 shadow-[6px_6px_0px_#000] inline-block tracking-wide uppercase leading-snug">
             {yearsOfExperience()} Χρόνια — Εξατομικευμένο Πλάνο
           </span>
           <p className="text-gray-300 font-bold text-base md:text-lg mt-6 max-w-lg leading-relaxed">
             Προετοιμασία για Πανελλήνιες & Γυμνάσιο με πραγματικά αποτελέσματα, μικρά τμήματα, και εβδομαδιαία αξιολόγηση.
           </p>

           {/* Primary CTA Buttons */}
           <div className="flex flex-wrap gap-4 mt-8 relative z-50">
              <Link href="/contact#enrollment-form" className="px-8 py-5 bg-brand-orange text-white font-black text-sm md:text-base uppercase tracking-[0.2em] border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center justify-center gap-2 relative z-50">
                ΕΓΓΡΑΨΟΥ ΤΩΡΑ
              </Link>
             <a href="#testimonials" className="bg-white border-4 border-black px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-brand-teal hover:text-white transition-all shadow-[6px_6px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] flex items-center gap-2 relative z-50">
                ΔΕΣ ΤΟΥΣ ΕΠΙΤΥΧΟΝΤΕΣ
                <ArrowDown size={16} strokeWidth={3} />
             </a>
           </div>
        </div>

        {/* Quick Links Dashboard */}
        <div className="mt-4">
          <div className="flex items-center gap-4 mb-6">
             <div className="h-[4px] bg-brand-orange w-12 border-y border-black"></div>
             <h3 className="text-white font-black text-xl tracking-widest uppercase text-shadow-sm">Βρες Γρηγορα</h3>
             <div className="h-[4px] bg-brand-orange flex-1 border-y border-black"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* The Featured CTA - Calculator */}
            <Link href="/calculator" className="bg-brand-orange border-4 border-black p-5 shadow-[6px_6px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all group relative overflow-hidden">
               <div className="absolute -right-4 -top-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-500">
                  <Calculator size={120} />
               </div>
               <div className="relative z-10 flex flex-col gap-2">
                 <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-2 border-black">
                   <Calculator strokeWidth={3} />
                 </div>
                 <span className="font-black text-black uppercase tracking-widest text-lg mt-2">Υπολογισμος<br/>Μοριων</span>
               </div>
            </Link>

            {/* Other Quick Links as Sharp Cards */}
            <div className="flex flex-col gap-4">
               {/* Search / Select component inside a card */}
               <div className="flex border-4 border-black bg-white shadow-[4px_4px_0px_#000] h-[5.5rem]">
                  <select
                    aria-label="Επιλογή Εκπαιδευτικής Βαθμίδας"
                    className="flex-1 bg-transparent text-gray-900 font-extrabold px-4 appearance-none focus:outline-none text-base md:text-sm uppercase tracking-wider"
                    defaultValue=""
                    onChange={handleLevelSelect}
                  >
                    <option value="">Επιλογη Βαθμιδας</option>
                    <option value="lykeio">Γενικό Λύκειο</option>
                    <option value="gymnasio">Γυμνάσιο</option>
                  </select>
                  <button
                    aria-label="Μετάβαση στη Βαθμίδα"
                    className="bg-black text-white w-16 flex items-center justify-center hover:bg-brand-teal transition-colors border-l-4 border-black"
                    onClick={() => router.push('/plano')}
                  >
                    <ChevronRight size={24} strokeWidth={4} />
                  </button>
               </div>

               {/* Standard Link - Exams */}
               <Link href="/exams" className="flex items-center justify-between bg-white border-4 border-black px-4 shadow-[4px_4px_0px_#000] h-[5.5rem] group hover:bg-brand-teal hover:text-white transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-teal text-white flex items-center justify-center border-2 border-black group-hover:bg-white group-hover:text-brand-teal transition-colors flex-shrink-0">
                      <FileText size={24} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-black text-gray-900 uppercase tracking-wider text-sm group-hover:text-white transition-colors">ΘΕΜΑΤΑ ΕΞΕΤΑΣΕΩΝ</span>
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-white/80 transition-colors uppercase tracking-widest leading-none mt-1">Πανελλήνιες & Διαγωνισματα ΟΕΦΕ</span>
                    </div>
                  </div>
                  <ChevronRight size={20} strokeWidth={3} className="text-black group-hover:translate-x-1 group-hover:text-white transition-transform" />
               </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Right Image Display Area */}
      <div className="w-full xl:w-[45%] flex items-center justify-center relative mt-16 xl:mt-0 px-6 xl:px-0 z-10">
         
         {/* Decorative Element Behind Image */}
         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-brand-orange opacity-80 blur-[100px] rounded-full pointer-events-none"></div>

         {/* Neo-Brutalist Image Frame */}
         <div className="relative w-full max-w-lg xl:max-w-2xl aspect-[4/5] xl:aspect-square bg-brand-orange border-[6px] border-black shadow-[16px_16px_0px_#000] -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out z-20">
            {/* The Generated Image */}
             <Image 
                src="/front2.jpg" 
                alt="Εκπαίδευση με σύγχρονα μέσα" 
                fill
                priority
                quality={60}
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover contrast-[1.05]"
             />
            
            {/* Overlay Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white border-[4px] border-black px-6 py-4 shadow-[8px_8px_0px_#000] transform rotate-3 flex items-center gap-3">
               <div className="bg-brand-teal p-2 border-2 border-black">
                  <GraduationCap className="text-white" size={24} />
               </div>
               <div className="flex flex-col">
                 <span className="font-black text-black leading-none uppercase text-sm">Από το {FOUNDING_YEAR}</span>
                 <span className="font-extrabold text-brand-orange text-xs uppercase tracking-widest">Μικρά Τμήματα</span>
               </div>
            </div>
         </div>
      </div>

    </section>
  );
}
