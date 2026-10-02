import { Calendar, Clock, Bookmark, AlertCircle, ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Metadata } from "next";

export const metadata = pageMetadata({
  title: "Πρόγραμμα Εξετάσεων Πανελληνίων | Φροντιστήριο Μόρφωση",
  description: "Το αναλυτικό πρόγραμμα των Πανελλαδικών Εξετάσεων ανά κατεύθυνση, ημερομηνίες και μαθήματα.",
  path: "/schedule-exams",
});

const SCHEDULE = [
  {
    date: "Παρασκευή 29 Μαΐου 2026",
    day: "ΠΑΡΑΣΚΕΥΗ",
    num: "29",
    month: "ΜΑΪΟΥ",
    topics: [
      {
        course: "Νεοελληνική Γλώσσα & Λογοτεχνία",
        direction: "Γενικής Παιδείας (Όλες οι Κατευθύνσεις)",
        color: "bg-black",
      }
    ]
  },
  {
    date: "Τετάρτη 3 Ιουνίου 2026",
    day: "ΤΕΤΑΡΤΗ",
    num: "03",
    month: "ΙΟΥΝΙΟΥ",
    topics: [
      {
        course: "Αρχαία Ελληνικά",
        direction: "Ανθρωπιστικές Σπουδές",
        color: "bg-brand-orange",
      },
      {
        course: "Μαθηματικά",
        direction: "Θετικές & Σπουδές Οικονομίας",
        color: "bg-brand-teal",
      },
      {
        course: "Βιολογία",
        direction: "Σπουδές Υγείας",
        color: "bg-brand-green",
      }
    ]
  },
  {
    date: "Παρασκευή 5 Ιουνίου 2026",
    day: "ΠΑΡΑΣΚΕΥΗ",
    num: "05",
    month: "ΙΟΥΝΙΟΥ",
    topics: [
      {
        course: "Λατινικά",
        direction: "Ανθρωπιστικές Σπουδές",
        color: "bg-brand-orange",
      },
      {
        course: "Χημεία",
        direction: "Θετικές Σπουδές & Υγείας",
        color: "bg-brand-teal",
      },
      {
        course: "Πληροφορική (ΑΕΠΠ)",
        direction: "Σπουδές Οικονομίας & Πληροφορικής",
        color: "bg-blue-600",
      }
    ]
  },
  {
    date: "Δευτέρα 8 Ιουνίου 2026",
    day: "ΔΕΥΤΕΡΑ",
    num: "08",
    month: "ΙΟΥΝΙΟΥ",
    topics: [
      {
        course: "Ιστορία",
        direction: "Ανθρωπιστικές Σπουδές",
        color: "bg-brand-orange",
      },
      {
        course: "Φυσική",
        direction: "Θετικές Σπουδές & Υγείας",
        color: "bg-brand-teal",
      },
      {
        course: "Οικονομία (ΑΟΘ)",
        direction: "Σπουδές Οικονομίας & Πληροφορικής",
        color: "bg-blue-600",
      }
    ]
  }
];

export default function ExamsSchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-brand-orange selection:text-white pb-32">
      
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#031516] pt-48 pb-32 overflow-hidden border-b-[12px] border-brand-teal">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #0c82a2 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="inline-flex items-center gap-3 bg-brand-orange px-6 py-3 border-4 border-white/20 mb-8">
            <Calendar size={20} className="text-white" strokeWidth={3} />
            <span className="text-white font-black text-xs uppercase tracking-[0.3em]">Πανελληνιες 2026</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
            ΠΡΟΓΡΑΜΜΑ<br />
            <span className="text-brand-teal">ΕΞΕΤΑΣΕΩΝ</span>
          </h1>
          
          <p className="text-gray-300 font-bold text-xl max-w-2xl leading-relaxed border-l-[6px] border-brand-orange pl-6">
            Το αναλυτικό πρόγραμμα των Πανελλαδικών Εξετάσεων για το έτος 2026. Δείτε αναλυτικά τι γράφει κάθε κατεύθυνση ανά ημέρα.
          </p>
        </div>
        
        {/* Giant background text */}
        <div className="absolute -bottom-10 left-10 text-[12vw] font-black text-white/[0.02] uppercase pointer-events-none select-none tracking-tighter leading-none whitespace-nowrap">
          ΠΑΝΕΛΛΑΔΙΚΕΣ
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SCHEDULE TIMELINE
      ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 -mt-16 relative z-20">
        <div className="flex flex-col gap-12">
          {SCHEDULE.map((dayObj, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-0 group">
              
              {/* DATE BLOCK (Left) */}
              <div className="md:w-48 flex-shrink-0 bg-brand-teal text-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-6 flex flex-col items-center justify-center transition-transform group-hover:-translate-y-2 relative z-10 z-[2]">
                <div className="text-4xl font-black">{dayObj.num}</div>
                <div className="text-xs font-black tracking-widest uppercase mt-1 opacity-90">{dayObj.month}</div>
                <div className="w-full h-1 bg-white/20 my-3" />
                <div className="text-[10px] font-black tracking-[0.2em] uppercase">{dayObj.day}</div>
              </div>
              
              {/* COURSES BLOCK (Right) */}
              <div className="flex-1 bg-white border-[4px] border-black md:border-l-0 shadow-[8px_8px_0px_#000] p-8 relative -mt-2 md:-mt-0 md:-ml-2 z-[1]">
                <h3 className="text-gray-400 font-bold text-sm tracking-widest uppercase border-b-2 border-gray-100 pb-4 mb-6">
                  {dayObj.date}
                </h3>
                
                <div className="flex flex-col gap-4">
                  {dayObj.topics.map((topic, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-2 border-gray-100 hover:border-black transition-colors rounded-sm group/row">
                      <div className="flex flex-col">
                        <span className="font-black text-xl lg:text-2xl text-gray-900 group-hover/row:text-brand-orange transition-colors tracking-tight">
                          {topic.course}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <Bookmark size={14} className={`text-brand-orange flex-shrink-0`} />
                          <span className="text-gray-500 font-bold text-sm">{topic.direction}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          INFO BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 mt-24">
        <div className="bg-[#fff9e6] border-[4px] border-brand-orange p-8 flex flex-col md:flex-row items-center gap-8 shadow-[8px_8px_0px_rgba(245,130,32,0.3)]">
          <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
            <AlertCircle size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-brand-orange font-black text-xl uppercase tracking-tighter mb-2">Ωρα Εναρξης Εξετασης</h4>
            <p className="text-gray-700 font-bold text-sm leading-relaxed max-w-2xl">
              Οι υποψήφιοι πρέπει να προσέρχονται στις αίθουσες εξέτασης μέχρι τις 08:00 π.μ. 
              Η ώρα έναρξης εξέτασης είναι <strong>08:30 π.μ.</strong>, κοινή για τους υποψηφίους ημερήσιων και εσπερινών Λυκείων.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
           <Link href="/news" className="inline-flex items-center gap-3 bg-black text-white px-8 py-5 font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black shadow-[6px_6px_0px_#0c82a2] hover:shadow-[3px_3px_0px_#0c82a2] transition-all">
             Λοιπες Ανακοινωσεις
             <ArrowRight size={18} strokeWidth={3} />
           </Link>
        </div>
      </section>

    </div>
  );
}
