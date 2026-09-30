import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";

// Server component — fetches data at build/ISR time
async function getSystemData() {
  const query = `{
    "teacher": *[_type == "teacher" && defined(image)] | order(order asc)[0] {
      firstName, lastName, specialty,
      "imageUrl": image.asset->url
    },
    "facilities": *[_type == "facilityPhoto" && hideFromMain != true] | order(order asc) {
      title,
      "photoUrl": photo.asset->url
    }
  }`;
  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

export default async function System() {
  const data = await getSystemData();

  const teacherImg = data?.teacher?.imageUrl ?? null;
  const teacherName = data?.teacher
    ? `${data.teacher.firstName} ${data.teacher.lastName}`
    : "Οι Καθηγητές μας";
  const teacherSpecialty = data?.teacher?.specialty ?? "";

  const facilities = data?.facilities ?? [];
  // In a Server Component all impure functions (Math.random, Date.now) are disallowed.
  // We simply pick the first facility; rotation can be done client-side if needed.
  const randomFacility = facilities.length > 0 ? facilities[0] : null;
  const facilityImg = randomFacility?.photoUrl ?? null;

  return (
    <section className="relative w-full py-24 bg-white overflow-hidden border-b-8 border-brand-teal min-h-[85svh] flex flex-col items-center justify-center">
      {/* Billboard background text */}
      <div className="absolute top-[20%] left-0 w-full overflow-hidden pointer-events-none z-0">
        <h2 className="text-[25vw] font-black text-gray-100 whitespace-nowrap select-none tracking-tighter animate-billboard inline-block uppercase">
          ΜΟΡΦΩΣΗ
        </h2>
      </div>

      <div className="w-full px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 xl:max-w-[1600px] mx-auto">
        {/* Left Side text */}
        <div className="lg:w-1/3">
          <span className="text-sm font-black tracking-widest text-gray-900 uppercase mb-8 block">Εκπαιδευτική Μέθοδος</span>
          <h3 className="text-4xl lg:text-5xl xl:text-6xl font-black text-brand-orange leading-[1.1] mb-10 tracking-tighter">
            Η Εκπαίδευση <br/> που Αξίζεις <br/> στη Μόρφωση!
          </h3>
        </div>

        {/* Right Side — Big photo + 4-tile grid floating in front */}
        <div className="lg:w-2/3 relative lg:min-h-[700px] w-full border-l-[12px] border-brand-teal">
          {/* Background image — in flow on mobile, fills the box on desktop */}
          <div className="relative h-[300px] sm:h-[420px] lg:absolute lg:inset-0 lg:h-auto overflow-hidden">
            <Image
              src="/bigfront.jpg"
              alt="Φροντιστήριο Μόρφωση"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gray-900/40" />
          </div>

          {/* 4-tile grid — stacked under the photo on mobile, protrudes LEFT out of the photo edge on desktop */}
          <div className="relative w-full grid grid-cols-2 border-l-[6px] border-brand-orange z-20 lg:absolute lg:-left-36 lg:top-1/2 lg:-translate-y-1/2 lg:w-[55%] lg:max-w-[340px] lg:shadow-[12px_12px_0px_rgba(0,0,0,0.35)]">
            {/* Tile 1 — Teacher */}
            <Link href="/teachers" className="bg-white p-0 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors h-[150px] group cursor-pointer relative overflow-hidden">
              {teacherImg ? (
                <>
                  <Image src={teacherImg} alt={teacherName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                    <span className="font-black text-[10px] text-white leading-tight block">{teacherName}</span>
                    {teacherSpecialty && <span className="font-bold text-[9px] text-brand-orange block">{teacherSpecialty}</span>}
                  </div>
                  <div className="absolute top-2 right-2 bg-brand-teal text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                    Η ΟΜΆΔΑ ΜΑΣ
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 p-4">
                  <div className="w-12 h-12 bg-gray-200 group-hover:scale-105 transition-transform rounded-full" />
                  <span className="font-extrabold text-xs text-gray-900 leading-tight group-hover:text-brand-orange transition-colors">Οι Καθηγητές<br/>Μας</span>
                </div>
              )}
            </Link>

            {/* Tile 2 — Facility */}
            <Link href="/about#facilities" className="bg-white p-0 flex flex-col items-center justify-center text-center hover:bg-brand-teal transition-colors h-[150px] group cursor-pointer relative overflow-hidden">
              {facilityImg ? (
                <>
                  <Image src={facilityImg} alt="Χώρος Μόρφωσης" fill className="object-cover group-hover:scale-105 transition-transform duration-500 group-hover:opacity-70" />
                  <div className="absolute inset-0 bg-brand-teal/0 group-hover:bg-brand-teal/60 transition-colors" />
                  <span className="relative z-10 font-extrabold text-[11px] text-transparent group-hover:text-white leading-tight transition-colors px-2">
                    Οι Εγκαταστάσεις<br/>μας
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 p-4">
                   <div className="w-12 h-12 bg-gray-200 group-hover:bg-white/30 transition-colors" />
                   <span className="font-extrabold text-[11px] text-gray-900 group-hover:text-white leading-tight transition-colors">Οι Εγκαταστάσεις<br/>μας</span>
                </div>
              )}
            </Link>

            {/* Tile 3 — Exams */}
            <Link href="/exams" className="bg-white p-0 flex flex-col items-center justify-center text-center hover:bg-brand-orange transition-colors h-[150px] group cursor-pointer relative overflow-hidden">
                <Image src="/exetasi.jpg" alt="Προσομοίωση Εξέτασης" fill className="object-cover group-hover:scale-105 transition-transform duration-500 group-hover:opacity-60" />
                <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/50 transition-colors" />
                <span className="relative z-10 font-extrabold text-[10px] sm:text-[11px] text-white bg-gray-900/60 group-hover:bg-transparent px-2 py-0.5 leading-tight text-center transition-all w-full text-center">
                  Προσομοιώσεις<br/>Εξετάσεων
                </span>
            </Link>

            {/* Tile 4 — Academic guidance */}
            <Link href="/prosanatolismos" className="bg-white p-0 flex flex-col items-center justify-center text-center hover:bg-brand-teal-dark transition-colors h-[150px] group cursor-pointer relative overflow-hidden">
              <Image src="/career_guidance.png" alt="Επαγγελματικός Προσανατολισμός" fill className="object-cover group-hover:scale-105 transition-transform duration-500 group-hover:opacity-60" />
              <div className="absolute inset-0 bg-brand-teal/0 group-hover:bg-brand-teal/50 transition-colors" />
              <div className="relative z-10 flex flex-col items-center justify-center w-full bg-gray-900/60 group-hover:bg-transparent py-1 transition-all">
                <span className="font-extrabold text-[10px] sm:text-[11px] text-white leading-tight text-center block w-full">
                  Ακαδημαϊκός<br/>Προσανατολ.
                </span>
                <span className="text-[8px] sm:text-[9px] text-gray-200 group-hover:text-white/90 font-bold uppercase tracking-wider mt-0.5 block transition-colors truncate">
                  Βρες τον σωστό δρόμο
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* CTAs container — Below to avoid overlap */}
      <div className="w-full px-6 lg:px-12 relative z-30 xl:max-w-[1600px] mx-auto mt-20 flex flex-col sm:flex-row items-center justify-start gap-10">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-gray-900 font-extrabold uppercase text-xs hover:text-brand-teal transition-colors group tracking-widest whitespace-nowrap"
          >
            Γνωρίστε την Ομάδα μας
            <span className="text-brand-orange group-hover:translate-x-1 transition-transform">{">"}</span>
          </Link>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
            <Link
              href="/about"
              className="inline-flex items-center gap-3 bg-brand-teal text-white px-8 py-4 font-black text-xs uppercase tracking-widest border-4 border-gray-900 shadow-[8px_8px_0px_#111] hover:shadow-[2px_2px_0px_#111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all group"
            >
              Σχετικά με Εμάς
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 font-black text-xs uppercase tracking-widest border-4 border-gray-900 shadow-[8px_8px_0px_#111] hover:shadow-[2px_2px_0px_#111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all group"
            >
              Κάνε την Εγγραφή σου
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
      </div>
    </section>
  );
}
