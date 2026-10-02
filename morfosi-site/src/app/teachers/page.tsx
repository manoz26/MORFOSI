import { CONTACT_EMAIL } from "@/lib/site";
import { client } from "@/sanity/client";
import { FACT_COUNTS_QUERY, yearsOfExperience, type FactCounts } from "@/lib/facts";
import { GraduationCap, Users, Star, Award, BookOpen, ChevronRight, Sparkles } from "lucide-react";

export const revalidate = 60; // Refresh data from Sanity every 60 seconds

export const metadata = {
  title: 'Οι Καθηγητές μας | Φροντιστήριο Μόρφωση',
  description: 'Γνωρίστε την ακαδημαϊκή ομάδα του Φροντιστηρίου Μόρφωση. Εκπαιδευτικοί με πάθος, εμπειρία και αποτελέσματα.',
};

const TEACHERS_QUERY = `*[_type == "teacher"] | order(order asc, lastName asc) {
  _id,
  firstName,
  lastName,
  specialty,
  bio,
  "imageUrl": image.asset->url
}`;

// Fallback teachers for when CMS is empty
const FALLBACK_TEACHERS = [
  {
    _id: 't1', firstName: 'Ελένη', lastName: 'Παπαδοπούλου',
    specialty: 'Νεοελληνική Γλώσσα & Λογοτεχνία',
    bio: 'Φιλόλογος με 15 χρόνια εμπειρία στην προετοιμασία μαθητών για Πανελλαδικές. Πρώην εξεταστής με βαθιά γνώση της εξεταστέας ύλης.',
    imageUrl: null
  },
  {
    _id: 't2', firstName: 'Γιώργος', lastName: 'Κωνσταντίνου',
    specialty: 'Μαθηματικά Προσανατολισμού',
    bio: 'Μαθηματικός από το Πανεπιστήμιο Αθηνών. Ειδικεύεται στην Άλγεβρα και Γεωμετρία. Αποφοιτών με εισαγωγή στις κορυφαίες σχολές.',
    imageUrl: null
  },
  {
    _id: 't3', firstName: 'Μαρία', lastName: 'Αντωνίου',
    specialty: 'Φυσική & Χημεία',
    bio: 'Φυσικός με Διδακτορικό από το Πολυτεχνείο Αθηνών. Συγγραφέας εκπαιδευτικών βιβλίων Φυσικής Γ΄ Λυκείου.',
    imageUrl: null
  },
  {
    _id: 't4', firstName: 'Νίκος', lastName: 'Δημητρίου',
    specialty: 'Αγγλική Γλώσσα & Λογοτεχνία',
    bio: 'Cambridge-certified με σπουδές στο Λονδίνο. Προετοιμάζει μαθητές για C2 Proficiency και IELTS.',
    imageUrl: null
  },
  {
    _id: 't5', firstName: 'Άννα', lastName: 'Σταυρίδου',
    specialty: 'Βιολογία & Διατροφολογία',
    bio: 'Βιολόγος-Διατροφολόγος. Ξεχωριστή προσέγγιση στη διδασκαλία της Βιολογίας Κατεύθυνσης με πρακτικά παραδείγματα.',
    imageUrl: null
  },
  {
    _id: 't6', firstName: 'Παναγιώτης', lastName: 'Λεβέντης',
    specialty: 'Ιστορία & Πολιτική Οικονομία',
    bio: 'Ιστορικός-Πολιτικός Επιστήμων. Μέθοδος διδασκαλίας βασισμένη στην κριτική σκέψη και την ανάλυση πηγών.',
    imageUrl: null
  },
  {
    _id: 't7', firstName: 'Σοφία', lastName: 'Καράμπελα',
    specialty: 'Αρχαία Ελληνικά',
    bio: 'Κλασική Φιλόλογος με εξειδίκευση στη μετάφραση αγνώστου. Πρώην καθηγήτρια στο Ευρωπαϊκό Σχολείο Βρυξελλών.',
    imageUrl: null
  },
  {
    _id: 't8', firstName: 'Θανάσης', lastName: 'Μπούρας',
    specialty: 'Οικονομία & Αρχές Οικονομικής Θεωρίας',
    bio: 'Οικονομολόγος από ΕΚΠΑ. Μέλος του Οικονομικού Επιμελητηρίου. Απλοποιεί πολύπλοκες οικονομικές έννοιες.',
    imageUrl: null
  },
];

const SPECIALTIES = [
  'Όλοι', 'Φιλόλογοι', 'Μαθηματικοί', 'Θετικές Επιστήμες', 'Ξένες Γλώσσες', 'Ανθρωπιστικές'
];

export default async function TeachersPage() {
  let teachers: any[] = [];
  let stats: FactCounts = { teachers: 0, books: 0 };

  try {
    [teachers, stats] = await Promise.all([
      client.fetch(TEACHERS_QUERY),
      client.fetch(FACT_COUNTS_QUERY),
    ]);
  } catch (e) {
    // Fallback if Sanity is unreachable
  }

  const displayTeachers = teachers.length > 0 ? teachers : FALLBACK_TEACHERS;
  // Μόνο πραγματικά νούμερα (βλ. src/lib/facts.ts).
  const displayStats = {
    teacherCount: stats.teachers || displayTeachers.length,
    books: stats.books,
    years: yearsOfExperience(),
  };

  // Color palette cycling for teacher cards — brand colors
  const accentColors = [
    { border: 'border-brand-teal', bg: 'bg-brand-teal', text: 'text-brand-teal', shadow: 'shadow-[8px_8px_0px_#0c82a2]', hoverBg: 'group-hover:bg-brand-teal' },
    { border: 'border-brand-orange', bg: 'bg-brand-orange', text: 'text-brand-orange', shadow: 'shadow-[8px_8px_0px_#f58220]', hoverBg: 'group-hover:bg-brand-orange' },
    { border: 'border-brand-green', bg: 'bg-brand-green', text: 'text-brand-green', shadow: 'shadow-[8px_8px_0px_#00a651]', hoverBg: 'group-hover:bg-brand-green' },
    { border: 'border-brand-red', bg: 'bg-brand-red', text: 'text-brand-red', shadow: 'shadow-[8px_8px_0px_#e31837]', hoverBg: 'group-hover:bg-brand-red' },
    { border: 'border-brand-purple', bg: 'bg-brand-purple', text: 'text-brand-purple', shadow: 'shadow-[8px_8px_0px_#8e4585]', hoverBg: 'group-hover:bg-brand-purple' },
    { border: 'border-brand-teal-dark', bg: 'bg-brand-teal-dark', text: 'text-brand-teal-dark', shadow: 'shadow-[8px_8px_0px_#095f77]', hoverBg: 'group-hover:bg-brand-teal-dark' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-teal selection:text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Full-bleed brutalist dark hero
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#031516] overflow-hidden pt-48 pb-32">
        {/* Huge decorative background text */}
        <span
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[18vw] font-black text-white/[0.03] whitespace-nowrap select-none pointer-events-none tracking-widest uppercase leading-none"
          aria-hidden="true"
        >
          ΚΑΘΗΓΗΤΕΣ
        </span>

        {/* Animated accent lines */}
        <div className="absolute top-0 left-0 w-full h-[8px] bg-gradient-to-r from-brand-teal via-brand-orange to-brand-green" />
        <div className="absolute top-8 left-0 w-1/3 h-[4px] bg-brand-orange opacity-40" />
        <div className="absolute top-8 right-0 w-1/4 h-[4px] bg-brand-teal opacity-40" />

        {/* Brutalist grid dots */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">

            {/* Left: Main title */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 bg-brand-orange px-6 py-3 border-4 border-white/20 mb-10">
                <GraduationCap className="text-white" size={20} strokeWidth={3} />
                <span className="text-white font-black text-xs uppercase tracking-[0.3em]">Ακαδημαϊκή Ομάδα</span>
              </div>

              {/* Χωρίς `whitespace-nowrap` στο κινητό: στα 375px ο τίτλος έπιανε 452px
                  και το «ΜΑΣ.» κοβόταν έξω από την οθόνη. */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[100px] font-black text-white uppercase tracking-tighter leading-none mb-8 md:whitespace-nowrap">
                <span className="text-white">OΙ </span><span className="text-brand-teal">ΚΑΘΗΓΗΤΕΣ </span><span className="text-brand-orange">ΜΑΣ.</span>
              </h1>

              <p className="text-gray-300 font-bold text-xl md:text-2xl max-w-2xl leading-relaxed border-l-[6px] border-brand-teal pl-6">
                Κάθε επιτυχία ξεκινά από έναν ανθρώπο που πιστεύει σε σένα πιο πολύ και από σένα τον ίδιο.
              </p>
            </div>

            {/* Right: Stats cards */}
            <div className="flex flex-row lg:flex-col gap-4 flex-shrink-0">
              <div className="bg-brand-teal border-4 border-white/20 p-4 sm:p-6 flex-1 lg:flex-none min-w-0 lg:min-w-[180px] shadow-[6px_6px_0px_rgba(255,255,255,0.1)]">
                <div className="text-5xl font-black text-white leading-none tracking-tighter">
                  {displayStats.teacherCount}
                </div>
                <div className="text-white/80 font-bold text-xs uppercase tracking-[0.2em] mt-2">Εκπαιδευτικοί</div>
              </div>
              <div className="bg-brand-orange border-4 border-white/20 p-4 sm:p-6 flex-1 lg:flex-none min-w-0 lg:min-w-[180px] shadow-[6px_6px_0px_rgba(255,255,255,0.1)]">
                <div className="text-5xl font-black text-white leading-none tracking-tighter">
                  {displayStats.years}
                </div>
                <div className="text-white/80 font-bold text-xs uppercase tracking-[0.2em] mt-2">Χρόνια Εμπειρίας</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARQUEE STRIP — Scrolling specialties
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-brand-orange border-y-[6px] border-black overflow-hidden py-4">
        <div className="flex gap-12 animate-billboard whitespace-nowrap">
          {[...SPECIALTIES, ...SPECIALTIES, ...SPECIALTIES].map((s, i) => (
            <span key={i} className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-4">
              {s} <span className="text-black/30">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          INTRO BLURB — Who we are
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 border-b-[8px] border-brand-teal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            {/* Big pull-quote */}
            <div className="lg:col-span-2">
              <p className="text-4xl md:text-5xl font-black text-gray-900 leading-snug tracking-tight">
                Δεν είμαστε απλώς φροντιστήριο.
                <br />
                <span className="text-brand-teal">Είμαστε η ομάδα</span> που
                <br />
                <span className="text-brand-orange underline decoration-wavy decoration-brand-orange/40">
                  αλλάζει ζωές.
                </span>
              </p>
            </div>

            {/* Right column — 3 bullet points */}
            <div className="flex flex-col gap-8">
              {[
                { icon: <Star size={20} />, label: 'Στην εκπαίδευση', val: `${displayStats.years} χρόνια`, color: 'text-brand-orange' },
                { icon: <Award size={20} />, label: 'Εκπαιδευτικοί', val: `${displayStats.teacherCount}`, color: 'text-brand-teal' },
                ...(displayStats.books ? [{ icon: <BookOpen size={20} />, label: 'Συγγράμματα', val: `${displayStats.books} εκδόσεις`, color: 'text-brand-green' }] : []),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className={`w-12 h-12 border-4 border-black flex items-center justify-center flex-shrink-0 ${item.color} shadow-[4px_4px_0px_#000] group-hover:shadow-[2px_2px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase text-gray-400 tracking-widest">{item.label}</div>
                    <div className="text-2xl font-black text-gray-900 tracking-tight">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED TEACHER — First teacher gets spotlight treatment
      ═══════════════════════════════════════════════════════════ */}
      {displayTeachers.length > 0 && (() => {
        const featured = displayTeachers[0];
        return (
          <section className="bg-[#031516] py-24 border-b-[8px] border-brand-orange">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="flex items-center gap-4 mb-12">
                <Sparkles className="text-brand-orange" size={24} />
                <span className="text-brand-orange font-black text-xs uppercase tracking-[0.3em]">Προτεινόμενος Καθηγητής</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Photo */}
                <div className="relative">
                  <div className="aspect-[4/5] bg-gray-800 border-[6px] border-brand-teal shadow-[20px_20px_0px_#f58220] overflow-hidden">
                    {featured.imageUrl ? (
                      <img
                        src={featured.imageUrl}
                        alt={`${featured.firstName} ${featured.lastName}`}
                        className="w-full h-full object-cover transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-teal/30 to-brand-orange/20">
                        <GraduationCap size={120} className="text-brand-teal opacity-40" />
                      </div>
                    )}
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -right-6 bg-brand-orange border-4 border-black px-6 py-4 shadow-[6px_6px_0px_#000]">
                    <div className="text-white font-black text-xs uppercase tracking-widest">#{1} Στη Λίστα</div>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <div className="text-brand-teal font-black text-sm uppercase tracking-[0.3em] mb-4">
                    {featured.specialty || 'Καθηγητής'}
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
                    {featured.lastName}
                    <br />
                    <span className="text-brand-orange">{featured.firstName}</span>
                  </h2>
                  {featured.bio && (
                    <p className="text-gray-300 font-bold text-xl leading-relaxed mb-10 border-l-[6px] border-brand-teal pl-6">
                      &ldquo;{featured.bio}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(s => (
                      <div key={s} className="w-8 h-8 bg-brand-orange border-2 border-white/30 flex items-center justify-center">
                        <Star size={14} className="fill-white text-white" />
                      </div>
                    ))}
                    <span className="text-gray-400 font-bold text-sm ml-2">5.0 / 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          TEACHER GRID — All teachers
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Section header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div>
              <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Users size={16} />
                <span>Πλήρης Ομάδα</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                ΟΛΑ ΤΑ
                <br />
                <span className="text-brand-orange relative">
                  ΜΕΛΗ
                  <span className="absolute -bottom-2 left-0 w-full h-[6px] bg-brand-orange" />
                </span>
              </h2>
            </div>
            <p className="text-gray-500 font-bold max-w-sm text-lg leading-relaxed">
              Κάθε καθηγητής είναι επιλεγμένος με κριτήρια αριστείας, εμπειρίας και αποτελεσμάτων.
            </p>
          </div>

          {/* Grid of cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200 border-[4px] border-gray-900 shadow-[12px_12px_0px_#000]">
            {displayTeachers.map((teacher: any, index: number) => {
              const accent = accentColors[index % accentColors.length];
              const initials = `${teacher.firstName?.charAt(0) || ''}${teacher.lastName?.charAt(0) || ''}`;

              return (
                <div
                  key={teacher._id}
                  className="group bg-white relative overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                >
                  {/* Photo area */}
                  <div className={`relative aspect-[3/4] bg-gray-100 overflow-hidden border-b-[6px] ${accent.border}`}>
                    {teacher.imageUrl ? (
                      <img
                        src={teacher.imageUrl}
                        alt={`${teacher.firstName} ${teacher.lastName}`}
                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-700"
                      />
                    ) : (
                      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100`}>
                        {/* Big initials */}
                        <div className={`text-7xl font-black ${accent.text} opacity-20 leading-none select-none`}>
                          {initials}
                        </div>
                        <GraduationCap size={48} className="text-gray-300 mt-4" />
                      </div>
                    )}

                    {/* Index number badge */}
                    <div className={`absolute top-4 left-4 ${accent.bg} text-white font-black text-xs w-10 h-10 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_#000] z-10`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Hover overlay with bio */}
                    <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center p-6">
                      <div className="text-center">
                        {teacher.bio ? (
                          <>
                            <p className="text-white text-sm font-bold leading-relaxed line-clamp-5">
                              &ldquo;{teacher.bio}&rdquo;
                            </p>
                            <div className={`mt-4 inline-flex items-center gap-2 ${accent.text} font-black text-xs uppercase tracking-widest`}>
                              <ChevronRight size={14} />
                              Βιογραφικό
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-300 text-sm font-bold">
                            Μέλος της ακαδημαϊκής ομάδας του Φροντιστηρίου Μόρφωση.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info area */}
                  <div className="p-6 bg-white">
                    <h3 className={`text-xl font-black uppercase tracking-tight leading-none mb-1 group-hover:${accent.text} transition-colors`}>
                      {teacher.lastName}
                    </h3>
                    <div className="text-gray-700 font-extrabold text-lg tracking-tight">{teacher.firstName}</div>
                    <div className={`mt-3 text-xs font-black uppercase tracking-widest ${accent.text} border-l-[3px] ${accent.border} pl-2 leading-snug`}>
                      {teacher.specialty || 'Εκπαιδευτικός'}
                    </div>

                    {/* Star rating decorative */}
                    <div className="flex gap-1 mt-4">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} className={`${accent.text} fill-current`} />
                      ))}
                    </div>
                  </div>

                  {/* Bottom accent bar — appears on hover */}
                  <div className={`absolute bottom-0 left-0 w-full h-[4px] ${accent.bg} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`} />
                </div>
              );
            })}
          </div>

          {/* Bottom note */}
          <p className="text-center text-gray-400 font-bold text-sm uppercase tracking-widest mt-12">
            Εμφανίζονται {displayTeachers.length} εκπαιδευτικοί · Ενημερώνεται από το Sanity CMS
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          VALUES SECTION — What makes our teachers special
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t-[8px] border-brand-teal py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-6">Η Φιλοσοφία μας</div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">
              Τι κάνει έναν<br />
              <span className="text-brand-orange">ΕΞΑΙΡΕΤΙΚΟ</span> δάσκαλο;
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-[4px] border-black shadow-[12px_12px_0px_#000]">
            {[
              {
                num: '01', title: 'Γνώση', desc: 'Βαθιά ακαδημαϊκή κατάρτιση και συνεχής επιμόρφωση. Κάθε καθηγητής γνωρίζει την ύλη στα δάχτυλα.',
                Color: 'bg-brand-teal', textColor: 'text-white',
              },
              {
                num: '02', title: 'Πάθος', desc: 'Η διδασκαλία δεν είναι απλώς δουλειά — είναι κλήση. Το πάθος μεταδίδεται και ανάβει φωτιά στους μαθητές.',
                Color: 'bg-brand-orange', textColor: 'text-white',
              },
              {
                num: '03', title: 'Αποτελέσματα', desc: 'Μετράμε επιτυχίες, όχι ώρες. Κάθε μαθητής αξιολογείται συνεχώς ώστε να βελτιώνεται το πρόγραμμά του.',
                Color: 'bg-brand-green', textColor: 'text-white',
              },
              {
                num: '04', title: 'Ανθρωπιά', desc: 'Γνωρίζουμε ότι πίσω από κάθε αριθμό υπάρχει ένα παιδί με ονείρατα. Στεκόμαστε δίπλα του.',
                Color: 'bg-brand-purple', textColor: 'text-white',
              },
            ].map((item) => (
              <div key={item.num} className={`${item.Color} p-10 border-r-[4px] last:border-r-0 border-black group hover:scale-105 transition-transform duration-300 relative overflow-hidden`}>
                <div className="absolute -top-4 -right-4 text-[8rem] font-black text-black/10 leading-none select-none">
                  {item.num}
                </div>
                <div className={`${item.textColor} font-black text-6xl tracking-tighter leading-none mb-6 z-10 relative`}>
                  {item.num}
                </div>
                <div className={`${item.textColor} font-black text-2xl uppercase tracking-tight mb-4 z-10 relative`}>
                  {item.title}
                </div>
                <div className={`${item.textColor} opacity-90 font-bold text-sm leading-relaxed z-10 relative`}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION — Join / Contact
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#031516] py-32 border-t-[8px] border-brand-orange relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #f58220 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-8">Θέλεις να γίνεις μέρος της ομάδας;</div>
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
            ΔΟΥΛΕΨΕ
            <br />
            <span className="text-brand-teal">ΜΑΖΙ ΜΑΣ</span>
          </h2>
          <p className="text-gray-300 font-bold text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Αν είσαι εκπαιδευτικός με πάθος για τη διδασκαλία και πιστεύεις στην αριστεία, θέλουμε να σε γνωρίσουμε.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            id="contact-teachers-cta"
            className="inline-flex items-center gap-3 bg-brand-orange text-white px-12 py-6 font-black uppercase tracking-widest text-lg border-4 border-transparent hover:border-white transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(245,130,32,0.6)] shadow-[0_0_0_rgba(245,130,32,0)]"
          >
            ΕΠΙΚΟΙΝΩΝΙΑ
            <ChevronRight size={20} strokeWidth={3} />
          </a>
        </div>
      </section>

    </div>
  );
}
