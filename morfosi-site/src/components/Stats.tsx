import Link from "next/link";
import { FOUNDING_YEAR, yearsOfExperience, type FactCounts } from "@/lib/facts";

export default function Stats({ counts }: { counts?: FactCounts }) {
  return (
    <section className="bg-gradient-to-r from-brand-purple to-[#1a1c3d] py-32 w-full relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-orange mb-4 tracking-wider uppercase">
          Η Δυναμη της Εμπειριας μας
        </h2>
        <p className="text-white font-bold text-lg mb-20 tracking-widest">Από το {FOUNDING_YEAR} δίπλα στους μαθητές</p>

        {/* Μόνο πραγματικά νούμερα — βλ. src/lib/facts.ts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-16 text-center text-white items-end mt-12 min-h-[160px] max-w-4xl mx-auto">
          <div className="border-t-4 border-brand-orange hover:border-white pt-6 relative top-0 hover:-top-[24px] transition-all duration-700 ease-out cursor-default group w-full">
            <span className="font-sans font-black leading-none block mb-4 tracking-tighter shadow-sm text-5xl lg:text-7xl group-hover:text-6xl group-hover:lg:text-[8rem] transition-all duration-700 ease-out">
              {yearsOfExperience()}
            </span>
            <span className="font-black uppercase tracking-widest text-xs text-gray-300 group-hover:text-sm group-hover:text-white transition-all duration-700 ease-out">
              ΧΡΟΝΙΑ<br/>ΕΜΠΕΙΡΙΑΣ
            </span>
          </div>
          {counts?.teachers ? (
            <div className="border-t-4 border-brand-orange hover:border-white pt-6 relative top-0 hover:-top-[24px] transition-all duration-700 ease-out cursor-default group w-full">
              <span className="font-sans font-black leading-none block mb-4 tracking-tighter shadow-sm text-5xl lg:text-7xl group-hover:text-6xl group-hover:lg:text-[8rem] transition-all duration-700 ease-out">
                {counts.teachers}
              </span>
              <span className="font-black uppercase tracking-widest text-xs text-gray-300 group-hover:text-sm group-hover:text-white transition-all duration-700 ease-out">
                ΕΞΕΙΔΙΚΕΥΜΕΝΟΙ<br/>ΚΑΘΗΓΗΤΕΣ
              </span>
            </div>
          ) : null}
          {counts?.books ? (
            <div className="border-t-4 border-brand-orange hover:border-white pt-6 relative top-0 hover:-top-[24px] transition-all duration-700 ease-out cursor-default group w-full">
              <span className="font-sans font-black leading-none block mb-4 tracking-tighter shadow-sm text-5xl lg:text-7xl group-hover:text-6xl group-hover:lg:text-[8rem] transition-all duration-700 ease-out">
                {counts.books}
              </span>
              <span className="font-black uppercase tracking-widest text-xs text-gray-300 group-hover:text-sm group-hover:text-white transition-all duration-700 ease-out">
                ΕΚΔΟΣΕΙΣ<br/>ΒΙΒΛΙΩΝ
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-28">
              <Link href="/contact#enrollment-form" className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-5 font-black uppercase tracking-widest text-sm border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                ΕΓΓΡΑΨΟΥ ΤΩΡΑ
              </Link>
        </div>
      </div>
    </section>
  )
}
