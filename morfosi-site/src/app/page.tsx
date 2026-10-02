import { client } from "@/sanity/client";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import SocialProofBar from "@/components/SocialProofBar";
import ScrollVideo from "@/components/ScrollVideo";
import WhyUs from "@/components/WhyUs";
import HowItWorks from "@/components/HowItWorks";
import System from "@/components/System";
import Stats from "@/components/Stats";
import Programs from "@/components/Programs";
import PromoStrips from "@/components/PromoStrips";
import Testimonials from "@/components/Testimonials";
import BooksCarousel from "@/components/BooksCarousel";
import Link from "next/link";
import { FACT_COUNTS_QUERY } from "@/lib/facts";

export const revalidate = 60; // Refresh data every 60 seconds

// Server Component GROQ Query - Τραβάει τα πάντα από την Βάση
const PAGE_DATA_QUERY = `{
  "settings": *[_type == "siteSettings"][0] { contactPhone },
  "counts": ${FACT_COUNTS_QUERY},
  "programs": *[_type == "program"] | order(_createdAt asc) {
    _id,
    title,
    description,
    "slug": slug.current,
    "iconUrl": icon.asset->url
  },
  "testimonials": *[
    _type == "studentSuccess"
    && approved == true
    && defined(quote)
    && length(quote) >= 40
  ] | order(year desc)[0...4] {
    _id,
    studentName,
    year,
    university,
    quote,
    "photoUrl": photo.asset->url
  },
  "posts": *[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc)[0...2] {
    _id,
    title,
    "publishedAt": coalesce(publishedAt, _createdAt),
    "slug": slug.current,
    "excerpt": array::join(string::split(pt::text(body), "")[0..160], ""),
    category
  },
  "books": *[_type == "book"] | order(_createdAt desc) {
    _id,
    title,
    category,
    "coverUrl": coverImage.asset->url,
    "pdfUrl": pdfFile.asset->url,
    externalUrl
  }
}`;

export default async function Home() {
  // Fetching Data από το Sanity CMS
  const data = await client.fetch(PAGE_DATA_QUERY);

  // Fallbacks: Αν η βάση στο Sanity είναι άδεια, βοηθάμε το Design να μη σπάσει, γεμίζοντας με Demo Data.
  const displayBooks = data.books?.length > 0 ? data.books : [
    { _id: 'b1', title: 'ΒΙΒΛΙΟ 1', category: 'Πρόσθεσε από το Studio' },
    { _id: 'b2', title: 'ΒΙΒΛΙΟ 2', category: 'Πρόσθεσε από το Studio' },
    { _id: 'b3', title: 'ΒΙΒΛΙΟ 3', category: 'Πρόσθεσε από το Studio' }
  ];


  const phone = data.settings?.contactPhone || '2105063630';
  const phoneClean = phone.replace(/\s+/g, '');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-teal selection:text-white">
      <main>
        {/* 1st: Split-Screen Hero — Clear value proposition + strong CTA */}
        <Hero />

        {/* 2nd: Social Proof Bar — μόνο πραγματικά νούμερα (χρόνια, καθηγητές, εκδόσεις) */}
        <SocialProofBar counts={data.counts} />
        
        {/* 3rd: Apple-style Scroll Video Scrubbing */}
        <ScrollVideo />

        {/* 4th: Why Us — Specific, measurable differentiators */}
        <WhyUs />

        {/* 5th: How It Works — 3 simple steps to reduce friction */}
        <HowItWorks />

        {/* 6th: System of Success — Philosophy & methodology */}
        <System />

        {/* 7th: Massive Stats */}
        <Stats counts={data.counts} />

        {/* 8th: Programs Grid (ΣΥΝΔΕΘΗΚΕ ΜΕ CMS) */}
        <Programs programs={data.programs} />

        {/* 9th: Promo Strips */}
        <PromoStrips />

        {/* 10th: Testimonials (ΣΥΝΔΕΘΗΚΕ ΜΕ CMS) */}
        <Testimonials testimonials={data.testimonials} />

        {/* 11th: Calculator CTA - The Massive Blockbuster Banner */}
        <section className="w-full bg-gradient-to-br from-gray-900 to-black py-24 md:py-32 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent opacity-50 z-0"></div>
           <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl lg:text-[100px] leading-[0.9] font-black text-white tracking-tighter uppercase mb-8 drop-shadow-2xl">
                 ΠΟΥ ΠΕΡΝΑΣ;<br/><span className="text-brand-orange text-3xl md:text-5xl lg:text-6xl">ΥΠΟΛΟΓΙΣΕ ΤΑ ΜΟΡΙΑ ΣΟΥ</span>
              </h2>
              <p className="text-gray-400 font-bold text-lg md:text-2xl max-w-3xl mx-auto mb-12">
                 Το πιο εξελιγμένο σύστημα υπολογισμού μορίων στην Ελλάδα. Δες τι μόρια συγκεντρώνεις και σύγκρινέ τα με τις περσινές βάσεις, ακαριαία.
              </p>
              <Link href="/calculator" className="bg-brand-orange text-white px-12 md:px-16 py-6 border-4 border-transparent hover:border-white rounded-full font-black uppercase tracking-widest text-lg md:text-xl hover:shadow-[0_0_60px_rgba(249,115,22,0.8)] hover:-translate-y-2 transition-all inline-block shadow-2xl">
                 ΥΠΟΛΟΓΙΣΕ ΤΑ ΜΟΡΙΑ ΣΟΥ — ΔΩΡΕΑΝ
              </Link>
           </div>
        </section>

        {/* 12th: Εκδόσεις (Books) (ΣΥΝΔΕΘΗΚΕ ΜΕ CMS) */}
        <section className="bg-brand-teal-dark py-24 w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3 text-white">
              <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight mb-4">ΕΚΔΟΣΕΙΣ<br/><span className="text-brand-orange">ΜΟΡΦΩΣΗ</span></h2>
              <p className="font-bold text-sm tracking-wide opacity-90">Τα δικά μας συγγράμματα, σχεδιασμένα από την ακαδημαϊκή μας ομάδα, που οδηγούν στην κορυφή.</p>
              <Link href="/books" className="mt-8 border-4 border-white px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-teal-dark transition-colors inline-block w-max">ΟΛΑ ΤΑ ΒΙΒΛΙΑ</Link>
            </div>
            
            <BooksCarousel books={displayBooks} />
          </div>
        </section>

        {/* 13th: Νέα & Ανακοινώσεις (CMS) — εμφανίζεται μόνο όταν υπάρχουν δημοσιευμένα νέα */}
        {data.posts?.length > 0 && (
        <section className="bg-white py-24 md:py-32 w-full border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b-[6px] border-gray-900 pb-4 gap-6">
              <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-none">ΝΕΑ &<br/><span className="text-brand-orange">ΑΝΑΚΟΙΝΩΣΕΙΣ</span></h2>
              <Link href="/news" className="text-brand-teal font-black text-sm tracking-widest uppercase hover:text-gray-900 transition-colors flex items-center gap-2">
                ΟΛΑ ΤΑ ΝΕΑ →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
               {data.posts.map((item: any) => {
                 const dateObj = new Date(item.publishedAt);
                 const day = dateObj.getDate().toString().padStart(2, '0');
                 const monthStr = dateObj.toLocaleDateString('el-GR', { month: 'short' }).toUpperCase();
                 const year = dateObj.getFullYear();

                 return (
                 <Link
                    href={`/news/${item.slug}`}
                    key={item._id}
                    className="flex gap-5 md:gap-8 group cursor-pointer border-b-2 md:border-b-0 border-gray-200 pb-8 md:pb-0 min-w-0"
                 >
                    <div className="text-brand-orange text-right flex-shrink-0">
                       <span className="text-5xl lg:text-7xl font-sans font-black leading-[0.8] block tracking-tighter group-hover:scale-110 transition-transform">{day}</span>
                       <span className="text-xs md:text-sm font-black uppercase tracking-widest mt-2 block">{monthStr} {year}</span>
                    </div>
                    <div className="pt-2 min-w-0">
                       <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-snug mb-3 group-hover:text-brand-orange transition-colors tracking-tight line-clamp-2 break-words">
                         {item.title}
                       </h3>
                       {(item.excerpt || item.category) && (
                         <p className="text-gray-500 font-bold mb-4 line-clamp-2">
                           {item.excerpt || `Κατηγορία: ${item.category.toUpperCase()}`}
                         </p>
                       )}
                       <span className="text-brand-teal font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">ΔΙΑΒΑΣΤΕ ΠΕΡΙΣΣΟΤΕΡΑ <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></span>
                    </div>
                 </Link>
                 );
               })}
            </div>
          </div>
        </section>
        )}

        {/* 14th: Final CTA — Last chance to convert */}
        <section className="bg-brand-teal py-20 md:py-28 border-t-[8px] border-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div>
                <div className="text-white/70 font-black text-xs uppercase tracking-[0.3em] mb-4">
                  Ξεκινήστε Σήμερα — Χωρίς Υποχρεώσεις
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
                  ΔΩΡΕΑΝ<br/>
                  <span className="text-brand-orange border-b-4 border-brand-orange">ΕΓΓΡΑΦΗ</span> ΤΩΡΑ
                </h2>
                <p className="text-white/80 font-bold text-lg mt-4 max-w-xl leading-relaxed">
                  Ξεκινήστε την προετοιμασία σας με τους κορυφαίους. Εξασφαλίστε τη θέση σας στα ολιγομελή τμήματά μας.
                </p>
              </div>
              <div className="flex flex-col gap-4 flex-shrink-0">
                <Link
                  href="/contact#enrollment-form"
                  className="inline-flex items-center gap-3 bg-brand-orange text-white px-12 py-6 font-black uppercase tracking-widest text-base border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[6px] hover:translate-y-[6px] transition-all"
                >
                  ΚΑΝΕ ΤΗΝ ΕΓΓΡΑΦΗ ΣΟΥ
                  <ArrowRight size={20} strokeWidth={3} />
                </Link>
                <a
                  href={`tel:${phoneClean}`}
                  className="inline-flex items-center gap-3 bg-white text-brand-teal px-12 py-6 font-black uppercase tracking-widest text-base border-4 border-black shadow-[8px_8px_0px_#031516] hover:shadow-[2px_2px_0px_#031516] hover:translate-x-[6px] hover:translate-y-[6px] transition-all"
                >
                  📞 {phone}
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}