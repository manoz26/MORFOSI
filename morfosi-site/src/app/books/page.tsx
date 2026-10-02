import { CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { client } from "@/sanity/client";
import Link from "next/link";
import { BookOpen, Download, ExternalLink, Search, Filter, ArrowRight, Star, Layers, BookMarked, Sparkles } from "lucide-react";

export const revalidate = 60; // Refresh data from Sanity every 60 seconds

export const metadata = pageMetadata({
  title: 'Εκδόσεις Μόρφωση | Βιβλία & Συγγράμματα Φροντιστηρίου',
  description: 'Οι επίσημες εκδόσεις του Φροντιστηρίου Μόρφωση. Βιβλία για Α΄, Β΄, Γ΄ Λυκείου και Γυμνάσιο. Κατεβάστε PDF ή αποκτήστε online.',
  path: "/books",
});

const ALL_BOOKS_QUERY = `*[_type == "book"] | order(orderPriority asc) {
  _id,
  title,
  category,
  subject,
  orderPriority,
  "coverUrl": coverImage.asset->url,
  "pdfUrl": pdfFile.asset->url,
  externalUrl
}`;

const FALLBACK_BOOKS = [
  { _id: 'b1', title: 'Νεοελληνική Γλώσσα & Λογοτεχνία', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Γλώσσα', orderPriority: 1, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b2', title: 'Μαθηματικά Προσανατολισμού', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Μαθηματικά', orderPriority: 2, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b3', title: 'Φυσική Κατεύθυνσης', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Φυσική', orderPriority: 3, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b4', title: 'Χημεία Κατεύθυνσης', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Χημεία', orderPriority: 4, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b5', title: 'Βιολογία Κατεύθυνσης', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Βιολογία', orderPriority: 5, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b6', title: 'Ιστορία Κατεύθυνσης', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Ιστορία', orderPriority: 6, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b7', title: 'Φυσική Γ΄ Λυκείου', category: 'Β_ΛΥΚΕΙΟΥ', subject: 'Φυσική', orderPriority: 1, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b8', title: 'Αλγεβρα & Γεωμετρία Β΄', category: 'Β_ΛΥΚΕΙΟΥ', subject: 'Μαθηματικά', orderPriority: 2, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b9', title: 'Νεοελληνική Γλώσσα Α΄ Γυμνασίου', category: 'ΓΥΜΝΑΣΙΟ', subject: 'Γλώσσα', orderPriority: 1, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b10', title: 'Μαθηματικά Γυμνασίου', category: 'ΓΥΜΝΑΣΙΟ', subject: 'Μαθηματικά', orderPriority: 2, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b11', title: 'Αρχές Οικονομικής Θεωρίας', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Οικονομία', orderPriority: 7, coverUrl: null, pdfUrl: null, externalUrl: null },
  { _id: 'b12', title: 'Αρχαία Ελληνικά Κατεύθυνσης', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Αρχαία', orderPriority: 8, coverUrl: null, pdfUrl: null, externalUrl: null },
];

const CATEGORY_META: Record<string, { label: string; icon: string; color: string; bg: string; border: string; description: string }> = {
  'Γ_ΛΥΚΕΙΟΥ': { label: "Γ΄ Λυκείου", icon: '🎓', color: 'text-brand-orange', bg: 'bg-brand-orange', border: 'border-brand-orange', description: 'Πλήρης προετοιμασία για Πανελλαδικές Εξετάσεις' },
  'Β_ΛΥΚΕΙΟΥ': { label: "Β΄ Λυκείου", icon: '📘', color: 'text-brand-teal', bg: 'bg-brand-teal', border: 'border-brand-teal', description: 'Εδραίωση βάσεων και αρχές κατεύθυνσης' },
  'Α_ΛΥΚΕΙΟΥ': { label: "Α΄ Λυκείου", icon: '📗', color: 'text-brand-green', bg: 'bg-brand-green', border: 'border-brand-green', description: 'Ομαλή μετάβαση από Γυμνάσιο σε Λύκειο' },
  'ΓΥΜΝΑΣΙΟ': { label: "Γυμνάσιο", icon: '📙', color: 'text-brand-purple', bg: 'bg-brand-purple', border: 'border-brand-purple', description: 'Σταθερές βάσεις για την ανώτερη εκπαίδευση' },
  'ΓΕΝΙΚΟ': { label: "Γενικό", icon: '📕', color: 'text-brand-red', bg: 'bg-brand-red', border: 'border-brand-red', description: 'Γενικά βοηθήματα και study guides' },
};

const CATEGORY_ORDER = ['Γ_ΛΥΚΕΙΟΥ', 'Β_ΛΥΚΕΙΟΥ', 'Α_ΛΥΚΕΙΟΥ', 'ΓΥΜΝΑΣΙΟ', 'ΓΕΝΙΚΟ'];

// Spine colors for books without cover art — cycles through brand palette
const SPINE_COLORS = [
  { bg: 'bg-brand-teal', text: 'text-white', accent: '#f58220' },
  { bg: 'bg-brand-orange', text: 'text-white', accent: '#0c82a2' },
  { bg: 'bg-brand-green', text: 'text-white', accent: '#031516' },
  { bg: 'bg-brand-purple', text: 'text-white', accent: '#f58220' },
  { bg: 'bg-brand-red', text: 'text-white', accent: '#0c82a2' },
  { bg: 'bg-brand-teal-dark', text: 'text-white', accent: '#f58220' },
];

export default async function BooksPage() {
  let books: any[] = [];

  try {
    books = await client.fetch(ALL_BOOKS_QUERY);
  } catch (e) {
    // Fallback
  }

  const displayBooks = books.length > 0 ? books : FALLBACK_BOOKS;

  // Group by category
  const grouped = displayBooks.reduce((acc: Record<string, any[]>, book: any) => {
    const cat = book.category || 'ΓΕΝΙΚΟ';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(book);
    return acc;
  }, {});

  const totalBooks = displayBooks.length;
  const categoriesUsed = Object.keys(grouped);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-orange selection:text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#031516] overflow-hidden pt-48 pb-40">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(#0c82a2 1px, transparent 1px), linear-gradient(90deg, #0c82a2 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          aria-hidden="true"
        />

        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-r from-brand-orange via-brand-teal to-brand-green" />

        {/* Giant background text */}
        <span
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[20vw] font-black text-white/[0.025] whitespace-nowrap select-none pointer-events-none tracking-widest uppercase leading-none"
          aria-hidden="true"
        >
          ΕΚΔΟΣΕΙΣ
        </span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">

            {/* Left: Title */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 border-4 border-brand-orange px-6 py-3 mb-10">
                <BookOpen className="text-brand-orange" size={20} strokeWidth={3} />
                <span className="text-brand-orange font-black text-xs uppercase tracking-[0.3em]">Επίσημες Εκδόσεις</span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
                ΕΚΔΟ
                <span className="text-brand-orange">ΣΕΙΣ</span>
                <br />
                <span className="text-brand-teal">ΜΟΡ</span>
                <span className="text-white/60">ΦΩΣΗ</span>
              </h1>

              <p className="text-gray-300 font-bold text-xl md:text-2xl max-w-2xl leading-relaxed">
                Τα συγγράμματά μας είναι το αποτέλεσμα δεκαετιών εμπειρίας στη διδασκαλία και την εξεταστή ύλη.
                Γραμμένα από τους καθηγητές μας, για τους μαθητές μας.
              </p>
            </div>

            {/* Right: Quick stats */}
            <div className="flex-shrink-0 flex flex-col gap-0 border-[4px] border-white/20 shadow-[12px_12px_0px_rgba(245,130,32,0.3)]">
              {[
                { val: `${totalBooks}+`, label: 'Τίτλοι', color: 'bg-brand-orange' },
                { val: `${categoriesUsed.length}`, label: 'Επίπεδα', color: 'bg-brand-teal' },
                { val: '100%', label: 'Ελληνική Ύλη', color: 'bg-brand-green' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} px-10 py-8 border-b-[4px] last:border-b-0 border-white/20`}>
                  <div className="text-5xl font-black text-white leading-none tracking-tighter">{stat.val}</div>
                  <div className="text-white/80 font-bold text-xs uppercase tracking-[0.2em] mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORY PILLS NAVIGATION
      ═══════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-40 bg-white border-b-[6px] border-brand-teal shadow-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 overflow-x-auto">
          <div className="flex items-center gap-0 py-4 min-w-max">
            <span className="text-gray-400 font-black text-xs uppercase tracking-widest mr-6 flex items-center gap-2">
              <Filter size={14} /> Κατηγορία:
            </span>
            {CATEGORY_ORDER.filter(cat => grouped[cat]).map((catKey) => {
              const meta = CATEGORY_META[catKey];
              return (
                <a
                  key={catKey}
                  href={`#cat-${catKey}`}
                  className={`${meta.bg} text-white font-black text-xs uppercase tracking-widest px-6 py-3 border-r-[3px] border-black hover:brightness-110 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all flex items-center gap-2 active:translate-y-0 active:shadow-none`}
                >
                  <span>{meta.icon}</span>
                  {meta.label}
                  <span className="bg-black/20 text-white text-[10px] px-2 py-0.5 font-black">
                    {grouped[catKey]?.length || 0}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          BOOKS BY CATEGORY
      ═══════════════════════════════════════════════════════════ */}
      <main className="pb-32">
        {CATEGORY_ORDER.map((catKey, catIndex) => {
          const categoryBooks = grouped[catKey];
          if (!categoryBooks || categoryBooks.length === 0) return null;

          const meta = CATEGORY_META[catKey] || { label: catKey, icon: '📚', color: 'text-gray-700', bg: 'bg-gray-700', border: 'border-gray-700', description: '' };
          const isEven = catIndex % 2 === 0;

          return (
            <section
              key={catKey}
              id={`cat-${catKey}`}
              className={`py-24 ${isEven ? 'bg-white' : 'bg-gray-50'} border-b-[6px] ${meta.border}`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Category header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-16">
                  <div className="flex items-center gap-8">
                    {/* Category badge */}
                    <div className={`${meta.bg} border-[6px] border-black shadow-[8px_8px_0px_#000] flex flex-col items-center justify-center w-24 h-24 flex-shrink-0`}>
                      <span className="text-3xl">{meta.icon}</span>
                    </div>
                    <div>
                      <div className={`${meta.color} font-black text-xs uppercase tracking-[0.3em] mb-2`}>
                        {meta.description}
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                        {meta.label}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`${meta.bg} text-white px-6 py-3 font-black text-sm uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_#000]`}>
                      {categoryBooks.length} {categoryBooks.length === 1 ? 'Τίτλος' : 'Τίτλοι'}
                    </div>
                  </div>
                </div>

                {/* Book grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                  {categoryBooks.map((book: any, bookIndex: number) => {
                    const spine = SPINE_COLORS[bookIndex % SPINE_COLORS.length];
                    const hasLink = book.pdfUrl || book.externalUrl;
                    const href = book.pdfUrl || book.externalUrl || '#';

                    return (
                      <Link
                        href={href}
                        key={book._id}
                        target={hasLink ? '_blank' : undefined}
                        rel={hasLink ? 'noopener noreferrer' : undefined}
                        id={`book-${book._id}`}
                        className="group block"
                      >
                        {/* Book "cover" container */}
                        <div className={`relative aspect-[3/4] border-[4px] border-black shadow-[8px_8px_0px_#000] group-hover:shadow-[4px_4px_0px_#000] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all duration-200 overflow-hidden`}>

                          {book.coverUrl ? (
                            /* Real cover image */
                            <>
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                                {book.pdfUrl && (
                                  <div className="bg-brand-orange border-2 border-white text-white font-black text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2">
                                    <Download size={14} /> PDF
                                  </div>
                                )}
                                {book.externalUrl && !book.pdfUrl && (
                                  <div className="bg-brand-teal border-2 border-white text-white font-black text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2">
                                    <ExternalLink size={14} /> Αγορά
                                  </div>
                                )}
                                {!hasLink && (
                                  <div className="text-white font-bold text-xs text-center uppercase tracking-widest opacity-80">
                                    Σύντομα διαθέσιμο
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            /* Decorative book spine when no image */
                            <div className={`${spine.bg} w-full h-full p-4 flex flex-col justify-between relative`}>
                              {/* Morfosi logo text watermark */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <span className="text-white font-black text-6xl rotate-90 tracking-widest select-none">
                                  ΜΟΡΦΩΣΗ
                                </span>
                              </div>

                              {/* Top badge */}
                              <div className="relative z-10">
                                <div className="bg-black/20 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 inline-block">
                                  {book.subject || 'Βιβλίο'}
                                </div>
                              </div>

                              {/* Title */}
                              <div className={`${spine.text} text-center z-10 relative px-2`}>
                                <div className="font-black text-sm leading-tight uppercase tracking-tight line-clamp-4">
                                  {book.title}
                                </div>
                              </div>

                              {/* Bottom — publisher */}
                              <div className="relative z-10">
                                <div className="w-full h-[3px] bg-white/30 mb-3" />
                                <div className="text-white/70 font-black text-[9px] uppercase tracking-widest text-center">
                                  ΕΚΔOΣΕΙΣ ΜΟΡΦΩΣΗ
                                </div>
                              </div>

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-4 z-20">
                                {book.pdfUrl ? (
                                  <div className="bg-white text-brand-orange border-2 border-white font-black text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2 shadow-lg">
                                    <Download size={14} /> Λήψη PDF
                                  </div>
                                ) : book.externalUrl ? (
                                  <div className="bg-white text-brand-teal border-2 border-white font-black text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2 shadow-lg">
                                    <ExternalLink size={14} /> Αγορά
                                  </div>
                                ) : (
                                  <div className="text-white/80 font-bold text-xs text-center uppercase tracking-widest">
                                    Επικοινωνήστε μαζί μας
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Priority badge */}
                          {book.orderPriority && book.orderPriority <= 3 && (
                            <div className={`absolute top-2 right-2 ${meta.bg} text-white font-black text-[9px] px-2 py-1 border border-white z-30 flex items-center gap-1`}>
                              <Sparkles size={8} /> ΝΕΟ
                            </div>
                          )}
                        </div>

                        {/* Book info below */}
                        <div className="mt-4 px-1">
                          <h3 className={`font-black text-gray-900 text-sm leading-snug group-hover:${meta.color} transition-colors line-clamp-2 tracking-tight`}>
                            {book.title}
                          </h3>
                          {book.subject && (
                            <p className={`text-xs font-black uppercase ${meta.color} tracking-widest mt-1`}>
                              {book.subject}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {book.pdfUrl ? (
                              <span className="text-brand-green font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <Download size={10} /> PDF
                              </span>
                            ) : book.externalUrl ? (
                              <span className="text-brand-teal font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <ExternalLink size={10} /> Online
                              </span>
                            ) : (
                              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                                Σύντομα
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* ═══════════════════════════════════════════════════════════
          INFO BANNER — Why our books
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-teal-dark py-24 border-t-[8px] border-brand-orange">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Star size={14} className="fill-brand-orange" />
                Γιατί τα βιβλία μας
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
                ΓΡΑΜΜΕΝΑ
                <br />
                <span className="text-brand-orange">ΑΠΟ ΤΟΥΣ</span>
                <br />
                ΚΑΛΥΤΕΡΟΥΣ
              </h2>
              <p className="text-gray-300 font-bold text-lg leading-relaxed">
                Κάθε βιβλίο μας είναι γραμμένο από τους καθηγητές του φροντιστηρίου — ανθρώπους που γνωρίζουν
                ακριβώς τι ζητείται στις εξετάσεις, πού εστιάζουν οι εξεταστές και πώς να εξηγούν δύσκολες έννοιες
                με τρόπο που ο μαθητής καταλαβαίνει.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-0 border-[4px] border-white/20 shadow-[12px_12px_0px_rgba(245,130,32,0.3)]">
              {[
                { icon: <BookMarked size={32} />, title: 'Ακριβής Ύλη', desc: 'Καλύπτει 100% της εξεταστέας ύλης', color: 'bg-brand-orange' },
                { icon: <Layers size={32} />, title: 'Δομημένο', desc: 'Από θεωρία σε εφαρμογή βήμα-βήμα', color: 'bg-brand-teal' },
                { icon: <Search size={32} />, title: 'Ευρετήριο', desc: 'Γρήγορη εύρεση κεφαλαίων & εννοιών', color: 'bg-brand-green' },
                { icon: <Star size={32} />, title: 'Ασκήσεις', desc: 'Εκατοντάδες λυμένα θέματα προηγούμενων ετών', color: 'bg-brand-purple' },
              ].map((item, i) => (
                <div key={i} className={`${item.color} p-8 border-r-[4px] border-b-[4px] last:border-r-0 border-white/20 group hover:scale-105 transition-transform`}>
                  <div className="text-white mb-4">{item.icon}</div>
                  <div className="text-white font-black text-lg uppercase tracking-tight mb-2">{item.title}</div>
                  <div className="text-white/80 font-bold text-xs leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — Order / Contact
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 border-t-[8px] border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center justify-center gap-2">
            <BookOpen size={16} /> Απόκτησε τα βιβλία σου
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter mb-6 leading-tight">
            ΠΑΡΕ ΤΑ ΒΙΒΛΙΑ
            <br />
            <span className="text-brand-orange">ΑΠΟ ΤΟ ΦΡΟΝΤΙΣΤΗΡΙΟ</span>
          </h2>
          <p className="text-gray-500 font-bold text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Επικοινώνησε μαζί μας για να μάθεις πώς μπορείς να αποκτήσεις τα βιβλία μας ή κατέβασε απευθείας τα διαθέσιμα PDF.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              id="books-contact-cta"
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-3 bg-brand-teal text-white px-10 py-5 font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              <ArrowRight size={20} strokeWidth={3} />
              ΕΠΙΚΟΙΝΩΝΙΑ
            </a>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-3 bg-brand-orange text-white px-10 py-5 font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              ΥΠΟΛΟΓΙΣΜΟΣ ΜΟΡΙΩΝ
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
