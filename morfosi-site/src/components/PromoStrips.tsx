import Image from "next/image";
import Link from "next/link";

export default function PromoStrips() {
  return (
    <>
      <section className="w-full flex flex-col lg:flex-row">
        {/* Strip 1: Protypa - Teal Background */}
        <div className="w-full lg:w-1/2 flex flex-col xl:flex-row xl:min-h-[500px]">
          {/* Image half */}
          <div className="w-full xl:w-1/2 h-64 sm:h-80 xl:h-auto bg-gray-200 relative overflow-hidden group">
            <Image
              src="/front.jpg"
              alt="Πρότυπα και Πειραματικά Σχολεία"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-brand-teal/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          {/* Text half */}
          <div className="w-full xl:w-1/2 p-8 sm:p-12 bg-brand-teal flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 w-4 h-full bg-brand-orange"></div>
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white">
              Προτυπα & <br />Πειραματικα Σχολεια
            </h2>
            <p className="font-bold text-white/90 text-sm mb-8 leading-relaxed">
              Προετοιμάζουμε στοχευμένα τους μαθητές για τις απαιτητικές εξετάσεις εισαγωγής στα Πρότυπα, με την εγγύηση της Μόρφωσης.
            </p>
            <Link href="/plano" className="bg-transparent border-4 border-white text-white px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-teal transition-colors w-max inline-block text-center">
              ΕΝΗΜΕΡΩΣΗ
            </Link>
          </div>
        </div>

        {/* Strip 2: Epaggelmatikos - Dark Background */}
        <div className="w-full lg:w-1/2 flex flex-col xl:flex-row xl:min-h-[500px] lg:border-l-[12px] border-white">
          {/* Text half */}
          <div className="w-full xl:w-1/2 p-8 sm:p-12 bg-gray-900 flex flex-col justify-center relative order-2 xl:order-1">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white">
              Επαγγελματικός <br /> Προσανατολισμός
            </h2>
            <p className="font-bold text-gray-400 text-sm mb-8 leading-relaxed">
              Χτίζουμε το μέλλον σου μαζί. Μέσα από εξειδικευμένα τεστ δομών και προσωπικές συνεντεύξεις, χαρτογραφούμε τις κλίσεις σου.
            </p>
            <Link href="/prosanatolismos" className="bg-brand-orange text-white px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors w-max inline-block text-center">
              ΜΑΘΕ ΠΕΡΙΣΣΟΤΕΡΑ
            </Link>
          </div>
          {/* Image half */}
          <div className="w-full xl:w-1/2 h-64 sm:h-80 xl:h-auto bg-gray-300 relative overflow-hidden group order-1 xl:order-2">
            <Image
              src="/front2.jpg"
              alt="Επαγγελματικός Προσανατολισμός"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors"></div>
          </div>
        </div>
      </section>
    </>
  )
}
