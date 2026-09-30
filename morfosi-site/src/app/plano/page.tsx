'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { client } from '@/sanity/client';
import { yearsOfExperience } from '@/lib/facts';
import { Sigma, Pencil, FlaskConical, Globe } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface PlanFeature {
  icon: string;
  title: string;
  description: string;
}

interface PlanSubject {
  subjectName: string;
  hoursPerWeek: number;
  category: string;
}

interface PlanStat {
  value: string;
  label: string;
}

interface PlanData {
  _id: string;
  level: 'gymnasio' | 'lykeio';
  tagline?: string;
  heroDescription?: string;
  features?: PlanFeature[];
  subjects?: PlanSubject[];
  stats?: PlanStat[];
  callToAction?: string;
}

// ─── GROQ Query ──────────────────────────────────────────────────────────────
const PLANS_QUERY = `*[_type == "planPage"] | order(level asc) {
  _id,
  level,
  tagline,
  heroDescription,
  features[] { icon, title, description },
  subjects[] { subjectName, hoursPerWeek, category },
  stats[] { value, label },
  callToAction
}`;

interface SanityProgram {
  _id: string;
  title: string;
  description: string;
  slug: string;
  bodyText?: string;
}

const PROGRAMS_QUERY = `*[_type == "program"] | order(_createdAt asc) {
  _id,
  title,
  description,
  "slug": slug.current,
  "bodyText": pt::text(body)
}`;

// ─── Static Fallback Data ─────────────────────────────────────────────────────
const FALLBACK_PLANS: PlanData[] = [
  {
    _id: 'gymnasio',
    level: 'gymnasio',
    tagline: 'Χτίζουμε τη γνώση από την αρχή',
    heroDescription:
      'Στο Γυμνάσιο μαθαίνουμε να μαθαίνουμε. Η μεθοδολογία μας εστιάζει στην κατανόηση των εννοιών, την ανάπτυξη κριτικής σκέψης και την απόκτηση σταθερής βάσης για το Λύκειο. Μικρά τμήματα, εξατομικευμένη προσοχή, εβδομαδιαία διαγνωστικά τεστ.',
    features: [
      { icon: '📚', title: 'Μικρά Τμήματα', description: 'Μέγιστο 7 μαθητές ανά τμήμα για εξατομικευμένη προσοχή' },
      { icon: '📊', title: 'Εβδομαδιαία Αξιολόγηση', description: 'Διαγνωστικά τεστ κάθε εβδομάδα για παρακολούθηση της προόδου' },
      { icon: '🎯', title: 'Στοχευμένη Προετοιμασία', description: 'Εστίαση στα κρίσιμα κεφάλαια για τις τελικές εξετάσεις' },
      { icon: '👨‍👩‍👧', title: 'Ενημέρωση Γονέων', description: 'Μηνιαίες συναντήσεις με γονείς για ενημέρωση προόδου' },
    ],
    subjects: [
      { subjectName: 'Μαθηματικά', hoursPerWeek: 3, category: 'Θετικά' },
      { subjectName: 'Φυσική', hoursPerWeek: 2, category: 'Θετικά' },
      { subjectName: 'Χημεία', hoursPerWeek: 2, category: 'Θετικά' },
      { subjectName: 'Αρχαία Ελληνικά', hoursPerWeek: 2, category: 'Θεωρητικά' },
      { subjectName: 'Έκθεση', hoursPerWeek: 2, category: 'Θεωρητικά' },
      { subjectName: 'Ιστορία', hoursPerWeek: 2, category: 'Θεωρητικά' },
      { subjectName: 'Αγγλικά', hoursPerWeek: 2, category: 'Γλώσσες' },
    ],
    stats: [
      { value: `${yearsOfExperience()}`, label: 'Χρόνια Εμπειρίας' },
      { value: '7', label: 'Μέγιστο Μαθητών/Τμήμα' },
    ],
    callToAction: 'Εγγράψου Τώρα',
  },
  {
    _id: 'lykeio',
    level: 'lykeio',
    tagline: 'Η πορεία προς τα Πανεπιστήμια ξεκινά εδώ',
    heroDescription:
      'Στο Λύκειο ο στόχος είναι κρυστάλλινος: να περάσεις στη σχολή που θέλεις. Η μέθοδός μας συνδυάζει εντατική εξάσκηση, πραγματικά θέματα Πανελληνίων και ατομική καθοδήγηση από εξειδικευμένους καθηγητές.',
    features: [
      { icon: '🎯', title: 'Στόχος Σχολής', description: 'Πλάνο μορίων για κάθε μαθητή με βάση τη σχολή που θέλει' },
      { icon: '📝', title: 'Θέματα Πανελληνίων', description: 'Εξάσκηση με πραγματικά θέματα από τα τελευταία 10 χρόνια' },
      { icon: '🔬', title: 'Εργαστήρια Επίλυσης', description: 'Εβδομαδιαία εργαστήρια με επίλυση δύσκολων θεμάτων' },
      { icon: '📱', title: 'Online Υποστήριξη', description: '24/7 πρόσβαση σε σημειώσεις και λυμένες ασκήσεις' },
    ],
    subjects: [
      { subjectName: 'Αρχαία Ελληνικά', hoursPerWeek: 4, category: 'Ανθρωπιστικών Σπουδών' },
      { subjectName: 'Νεοελληνική Γλώσσα', hoursPerWeek: 3, category: 'Ανθρωπιστικών Σπουδών' },
      { subjectName: 'Ιστορία', hoursPerWeek: 3, category: 'Ανθρωπιστικών Σπουδών' },
      { subjectName: 'Λατινικά', hoursPerWeek: 3, category: 'Ανθρωπιστικών Σπουδών' },
      { subjectName: 'Μαθηματικά Προσανατολισμού', hoursPerWeek: 5, category: 'Θετικών Σπουδών' },
      { subjectName: 'Νεοελληνική Γλώσσα', hoursPerWeek: 3, category: 'Θετικών Σπουδών' },
      { subjectName: 'Φυσική Προσανατολισμού', hoursPerWeek: 4, category: 'Θετικών Σπουδών' },
      { subjectName: 'Χημεία Προσανατολισμού', hoursPerWeek: 3, category: 'Θετικών Σπουδών' },
      { subjectName: 'Φυσική Προσανατολισμού', hoursPerWeek: 4, category: 'Σπουδών Υγείας' },
      { subjectName: 'Χημεία Προσανατολισμού', hoursPerWeek: 3, category: 'Σπουδών Υγείας' },
      { subjectName: 'Βιολογία Προσανατολισμού', hoursPerWeek: 4, category: 'Σπουδών Υγείας' },
      { subjectName: 'Νεοελληνική Γλώσσα', hoursPerWeek: 3, category: 'Σπουδών Υγείας' },
      { subjectName: 'Μαθηματικά Προσανατολισμού', hoursPerWeek: 5, category: 'Οικονομίας & Πληροφορικής' },
      { subjectName: 'Α.Ο.Θ.', hoursPerWeek: 3, category: 'Οικονομίας & Πληροφορικής' },
      { subjectName: 'Α.Ε.Π.Π.', hoursPerWeek: 3, category: 'Οικονομίας & Πληροφορικής' },
      { subjectName: 'Νεοελληνική Γλώσσα', hoursPerWeek: 3, category: 'Οικονομίας & Πληροφορικής' },
    ],
    stats: [
      { value: `${yearsOfExperience()}`, label: 'Χρόνια Εμπειρίας' },
      { value: '7', label: 'Μέγιστο Μαθητών/Τμήμα' },
    ],
    callToAction: 'Κάνε την Εγγραφή σου',
  },
];

// ─── Config per level ─────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  gymnasio: {
    label: 'ΓΥΜΝΑΣΙΟ',
    sub: 'Α΄ — Γ΄ Γυμνασίου',
    emoji: '🏫',
    color: '#0c82a2',        // brand-teal
    colorDark: '#095f77',
    colorLight: '#e0f4fa',
    gradientFrom: '#095f77',
    gradientTo: '#031516',
    accent: '#0c82a2',
    badgeBg: '#e0f4fa',
    badgeText: '#095f77',
    tabBorder: 'border-brand-teal',
    categoryColors: {
      'Θετικά': '#0c82a2',
      'Θεωρητικά': '#8e4585',
      'Γλώσσες': '#00a651',
      'Τεχνολογικά': '#e31837',
      'Γενική Παιδεία': '#f58220',
    },
  },
  lykeio: {
    label: 'ΓΕΛ',
    sub: 'Α΄ — Γ΄ Λυκείου',
    emoji: '🎓',
    color: '#f58220',        // brand-orange
    colorDark: '#c96b10',
    colorLight: '#fff4e6',
    gradientFrom: '#c96b10',
    gradientTo: '#1a0a00',
    accent: '#f58220',
    badgeBg: '#fff4e6',
    badgeText: '#c96b10',
    tabBorder: 'border-brand-orange',
    categoryColors: {
      'Θετικά': '#0c82a2',
      'Θεωρητικά': '#8e4585',
      'Γλώσσες': '#00a651',
      'Ανθρωπιστικών Σπουδών': '#8e4585',
      'Θετικών Σπουδών': '#0c82a2',
      'Σπουδών Υγείας': '#e31837',
      'Οικονομίας & Πληροφορικής': '#f58220',
      'Τεχνολογικά': '#e31837',
      'Γενική Παιδεία': '#f58220',
    },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroSection({ active, plans }: { active: string; plans: PlanData[] }) {
  const plan = plans.find((p) => p.level === active);
  const cfg = LEVEL_CONFIG[active as keyof typeof LEVEL_CONFIG];

  return (
    <div
      className="relative w-full overflow-hidden transition-all duration-700"
      style={{
        background: `linear-gradient(135deg, ${cfg.gradientFrom} 0%, ${cfg.gradientTo} 100%)`,
        minHeight: '420px',
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${cfg.color} 1px, transparent 1px), linear-gradient(90deg, ${cfg.color} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Glow blob */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{ background: cfg.color }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-30"
        style={{ background: cfg.accent }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-16">
        {/* Text */}
        <div className="flex-1">
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6 border-2"
            style={{ borderColor: cfg.color, color: cfg.color, background: 'rgba(255,255,255,0.06)' }}
          >
            <span className="text-xl">{cfg.emoji}</span>
            {cfg.sub}
          </div>
          <h1 className="text-white text-[13vw] sm:text-[5.5rem] lg:text-[6.5rem] leading-[0.85] font-black tracking-tighter uppercase mb-6 drop-shadow-2xl">
            {cfg.label}
          </h1>
          {plan?.tagline && (
            <div
              className="inline-block px-6 py-3 font-black text-white text-lg md:text-xl uppercase tracking-wide border-4 border-black shadow-[6px_6px_0px_#000] mb-8"
              style={{ background: cfg.color }}
            >
              {plan.tagline}
            </div>
          )}
          <p className="text-white/80 font-semibold text-base md:text-lg max-w-2xl leading-relaxed">
            {plan?.heroDescription || 'Το πρόγραμμά μας σχεδιάστηκε για να σε οδηγεί στην επιτυχία.'}
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/contact"
              className="px-8 py-4 font-black uppercase tracking-widest text-sm text-white border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all inline-block"
              style={{ background: cfg.color }}
            >
              {plan?.callToAction || 'Κάνε την Εγγραφή σου'}
            </Link>
            {active !== 'gymnasio' && (
              <Link
                href="/calculator"
                className="px-8 py-4 font-black uppercase tracking-widest text-sm text-black bg-white border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all inline-block"
              >
                ΥΠΟΛΟΓΙΣΕ ΜΟΡΙΑ
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {plan?.stats && plan.stats.length > 0 && (
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            {plan.stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 px-8 py-5 rounded-2xl flex items-center gap-5 min-w-[220px]"
              >
                <div
                  className="text-4xl font-black leading-none"
                  style={{ color: cfg.color }}
                >
                  {stat.value}
                </div>
                <div className="text-white/90 font-bold text-sm uppercase tracking-wider leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TabBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  const levels = ['gymnasio', 'lykeio'] as const;

  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b-4 border-black shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex">
          {levels.map((level: 'gymnasio' | 'lykeio') => {
            const cfg = LEVEL_CONFIG[level];
            const isActive = active === level;
            return (
              <button
                key={level}
                onClick={() => onChange(level)}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-5 font-black text-xs sm:text-sm uppercase tracking-widest border-b-[6px] transition-all duration-300 relative group ${isActive ? 'text-white border-b-0' : 'text-gray-400 border-transparent hover:text-gray-800'
                  }`}
                style={{
                  ...(isActive
                    ? { background: cfg.color, borderBottomColor: cfg.colorDark }
                    : { background: 'transparent' })
                }}
              >
                {/* Hover Highlight Layer */}
                {!isActive && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                    style={{ background: cfg.colorLight }}
                  />
                )}

                <span className={`text-lg transition-transform duration-300 ${!isActive ? 'group-hover:scale-125 group-hover:-rotate-12' : ''}`}>{cfg.emoji}</span>
                <span className="relative">
                  {cfg.label}
                  {!isActive && (
                    <span
                      className="absolute -bottom-1 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ background: cfg.color }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeaturesGrid({ plan }: { plan: PlanData }) {
  const cfg = LEVEL_CONFIG[plan.level];
  if (!plan.features?.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-[6px] border-black pb-4">
          <div>
            <span
              className="text-xs font-black uppercase tracking-[0.3em] mb-2 block"
              style={{ color: cfg.color }}
            >
              Τι προσφέρουμε
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
              Γιατί να επιλέξεις<br />
              <span style={{ color: cfg.color }}>τη Μόρφωση</span>
            </h2>
          </div>
          <p className="text-gray-500 font-semibold text-base max-w-md leading-relaxed">
            Κάθε λεπτομέρεια του προγράμματος είναι σχεδιασμένη για τη μέγιστη πρόοδό σου.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plan.features.map((feature, i) => (
            <div
              key={i}
              className="group relative bg-white border-4 border-black p-7 shadow-[6px_6px_0px_#000] hover:-translate-y-2 hover:shadow-[6px_12px_0px_#000] transition-all duration-300 cursor-default overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{ background: cfg.color }}
              />
              <div
                className="w-14 h-14 flex items-center justify-center text-2xl border-4 border-black mb-5 font-bold shadow-[3px_3px_0px_#000] group-hover:rotate-6 transition-transform duration-300"
                style={{ background: cfg.colorLight }}
              >
                {feature.icon}
              </div>
              <h3
                className="font-black text-gray-900 uppercase tracking-tight text-lg mb-3 group-hover:transition-colors"
              >
                {feature.title}
              </h3>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                {feature.description}
              </p>
              <div
                className="absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: cfg.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { detailedPrograms, DetailedProgram } from '@/data/detailedPrograms';

function DetailedProgramsSection({ plan, activeLevel }: { plan: PlanData, activeLevel: string }) {
  const cfg = LEVEL_CONFIG[plan.level as keyof typeof LEVEL_CONFIG];
  
  const filterKey = activeLevel === 'gymnasio' ? 'ΓΥΜΝΑΣΙΟΥ' : 'ΛΥΚΕΙΟΥ';
  const relevantPrograms = detailedPrograms.filter(p => p.grade.includes(filterKey));

  // Fallback to old subjects section if no detailed programs exist for this level yet
  if (relevantPrograms.length === 0) {
    if (!plan.subjects?.length) return null;
    const categories = [...new Set(plan.subjects.map((s) => s.category))];
    const catColors = cfg.categoryColors as Record<string, string>;

    return (
      <section className="py-20" style={{ background: '#f8f8f8' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12 text-center">
            <span
              className="text-xs font-black uppercase tracking-[0.3em] mb-2 block"
              style={{ color: cfg.color }}
            >
              Πρόγραμμα Μαθημάτων
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900">
              ΤΙ <span style={{ color: cfg.color }}>ΔΙΔΑΣΚΟΥΜΕ</span>
            </h2>
          </div>

          {/* Category Legend */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white rounded-full border-2 border-black"
                style={{ background: catColors[cat] || cfg.color }}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {plan.subjects.map((subject, i) => {
              const barColor = catColors[subject.category] || cfg.color;
              return (
                <div
                  key={i}
                  className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
                >
                  <div
                    className="h-1.5 mb-4 rounded-full"
                    style={{ background: barColor }}
                  />
                  <div className="font-black text-gray-900 text-base mb-3 leading-tight uppercase tracking-tight">
                    {subject.subjectName}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full text-white"
                      style={{ background: barColor }}
                    >
                      {subject.category}
                    </span>
                    <span className="text-gray-500 font-black text-xs">
                      {subject.hoursPerWeek}h/εβδ.
                    </span>
                  </div>

                  {/* Hours indicator */}
                  <div className="mt-4">
                    <div className="flex gap-1">
                      {Array.from({ length: 6 }).map((_, dotIdx) => (
                        <div
                          key={dotIdx}
                          className="flex-1 h-2 rounded-sm transition-all"
                          style={{
                            background:
                              dotIdx < subject.hoursPerWeek
                                ? barColor
                                : '#e5e7eb',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-1 block">
                      {subject.hoursPerWeek} ώρες εβδομαδιαίως
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // --- NEW DETAILED PROGRAMS LAYOUT ---
  // Group programs by grade
  const groupedPrograms = relevantPrograms.reduce((acc, prog) => {
    if (!acc[prog.grade]) acc[prog.grade] = [];
    acc[prog.grade].push(prog);
    return acc;
  }, {} as Record<string, DetailedProgram[]>);

  return (
    <section className="py-24" style={{ background: '#f8f8f8' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 text-center">
          <span
            className="text-xs font-black uppercase tracking-[0.3em] mb-2 block"
            style={{ color: cfg.color }}
          >
            Αναλυτικά Προγράμματα
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900">
            ΠΡΟΓΡΑΜΜΑΤΑ <span style={{ color: cfg.color }}>ΣΠΟΥΔΩΝ</span>
          </h2>
        </div>

        <div className="space-y-24">
          {Object.entries(groupedPrograms).map(([grade, programsForGrade]) => (
            <div key={grade} className="flex flex-col gap-8">
              {/* Grade Divider */}
              <div className="flex items-center gap-6">
                <div className="h-1 flex-1" style={{ background: cfg.color }} />
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter px-6 py-2 border-4 border-black bg-white text-black shadow-[4px_4px_0px_#000]">
                  {grade}
                </h3>
                <div className="h-1 flex-1" style={{ background: cfg.color }} />
              </div>

              {/* Tracks / Programs Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {programsForGrade.map((prog, idx) => {
                  
                  const getTrackTheme = (trackName: string, defaultBg: string) => {
                    if (!trackName) return { bg: defaultBg, text: 'text-gray-900', border: 'border-black' };
                    // Handle B' Lykeio combo first
                    if (trackName.includes('Θετικών') && trackName.includes('Υγείας')) return { bg: '#0c82a2', text: 'text-white', border: '#0c82a2' };
                    
                    if (trackName.includes('Θετικών')) return { bg: '#f58220', text: 'text-white', border: '#f58220' }; // Orange
                    if (trackName.includes('Ανθρωπιστικών')) return { bg: '#8e4585', text: 'text-white', border: '#8e4585' }; // Purple
                    if (trackName.includes('Υγείας')) return { bg: '#e31837', text: 'text-white', border: '#e31837' }; // Red
                    if (trackName.includes('Οικονομίας')) return { bg: '#00a651', text: 'text-white', border: '#00a651' }; // Green
                    return { bg: defaultBg, text: 'text-gray-900', border: 'border-black' };
                  };

                  const tTheme = getTrackTheme(prog.track, cfg.colorLight);

                  return (
                  <div key={idx} className="bg-white border-4 border-black flex flex-col shadow-[8px_8px_0px_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000] transition-all duration-300">
                    {/* Header */}
                    <div className="p-6 md:p-8" style={{ background: tTheme.bg, borderBottom: '4px solid black' }}>
                      {prog.track ? (
                        <h4 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${tTheme.text}`}>
                          {prog.track}
                        </h4>
                      ) : (
                        <h4 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${tTheme.text}`}>
                          ΓΕΝΙΚΟ ΠΡΟΓΡΑΜΜΑ
                        </h4>
                      )}
                    </div>

                    {/* Table styling */}
                    <div className="flex-1 p-6 md:p-8">
                      <div className={`grid ${prog.totalSummerHours > 0 ? 'grid-cols-[1fr_auto_auto]' : 'grid-cols-[1fr_auto]'} gap-x-4 md:gap-x-8 gap-y-3 mb-6 border-b-2 border-dashed border-gray-200 pb-4`}>
                        <div className="text-xs md:text-sm font-black uppercase tracking-widest text-gray-400">ΜΑΘΗΜΑΤΑ</div>
                        {prog.totalSummerHours > 0 && (
                          <div className="text-xs md:text-sm font-black uppercase tracking-widest text-brand-orange text-center w-10">ΘΕΡ.</div>
                        )}
                        <div className={`text-xs md:text-sm font-black uppercase tracking-widest ${prog.totalSummerHours > 0 ? 'text-brand-teal' : 'text-gray-900'} text-center w-10`}>
                          {prog.totalSummerHours > 0 ? 'ΧΕΙΜ.' : 'ΩΡΕΣ'}
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        {prog.subjects.map((sub, sIdx) => (
                          <div key={sIdx} className={`grid ${prog.totalSummerHours > 0 ? 'grid-cols-[1fr_auto_auto]' : 'grid-cols-[1fr_auto]'} items-center gap-x-4 md:gap-x-8 hover:bg-gray-50 p-2 rounded-md transition-colors -mx-2`}>
                            <div className="font-black text-sm md:text-base leading-tight uppercase text-gray-900">
                              {sub.name}
                            </div>
                            {prog.totalSummerHours > 0 && (
                              <div className="justify-self-center font-black text-lg text-gray-800 w-10 text-center">
                                {sub.summerHours > 0 ? sub.summerHours : '-'}
                              </div>
                            )}
                            <div className="justify-self-center font-black text-lg text-gray-800 w-10 text-center">
                              {sub.winterHours > 0 ? sub.winterHours : '-'}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="bg-gray-100 p-4 border-2 border-black flex items-center justify-between mt-auto">
                        <div className="font-black text-xs md:text-sm uppercase tracking-widest text-gray-500">ΣΥΝΟΛΟ ΩΡΩΝ</div>
                        <div className="flex items-center gap-4 md:gap-8 pr-1 md:pr-3">
                          {prog.totalSummerHours > 0 && (
                            <div className="font-black text-xl text-brand-orange text-center w-8">
                              {prog.totalSummerHours > 0 ? prog.totalSummerHours : '-'}
                            </div>
                          )}
                          <div className={`font-black text-xl w-8 text-center ${prog.totalSummerHours > 0 ? 'text-brand-teal' : 'text-gray-900'}`}>
                            {prog.totalWinterHours > 0 ? prog.totalWinterHours : '-'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info list */}
                    {prog.info && prog.info.length > 0 && (
                      <div className="bg-gray-900 border-t-4 border-black p-6 text-white text-xs md:text-sm">
                        <ul className="space-y-3">
                          {prog.info.map((item, iIdx) => {
                            const splitIndex = item.indexOf(':');
                            if (splitIndex > -1) {
                              const title = item.substring(0, splitIndex + 1);
                              const desc = item.substring(splitIndex + 1);
                              return (
                                <li key={iIdx} className="flex gap-3">
                                  <span className="text-brand-orange mt-0.5">▶</span>
                                  <span>
                                    <strong className="text-brand-teal uppercase tracking-wider">{title}</strong>
                                    <span className="text-gray-300 font-medium">{desc}</span>
                                  </span>
                                </li>
                              )
                            }
                            return (
                              <li key={iIdx} className="flex gap-3">
                                <span className="text-brand-orange mt-0.5">▶</span>
                                <span className="text-gray-300 font-medium">{item}</span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodologyBanner({ plan }: { plan: PlanData }) {
  const cfg = LEVEL_CONFIG[plan.level];
  const steps = [
    { num: '01', title: 'Αρχική Αξιολόγηση', desc: 'Κάνουμε διαγνωστικό τεστ για να εντοπίσουμε τα δυνατά και αδύνατα σημεία σου.' },
    { num: '02', title: 'Εξατομικευμένο Πλάνο', desc: 'Φτιάχνουμε αναλυτικό ατομικό πρόγραμμα με βάση τους στόχους σου.' },
    { num: '03', title: 'Εντατική Προετοιμασία', desc: 'Εφαρμόζουμε το πλάνο με συνεχή αξιολόγηση και προσαρμογή.' },
    { num: '04', title: 'Επιτυχία', desc: 'Φτάνεις στον στόχο σου — στα μόρια, στη σχολή, στο επόμενο βήμα.' },
  ];

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cfg.gradientFrom} 0%, ${cfg.gradientTo} 100%)`,
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(${cfg.color} 1px, transparent 1px), linear-gradient(90deg, ${cfg.color} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-14 text-center">
          <span
            className="text-xs font-black uppercase tracking-[0.3em] mb-2 block"
            style={{ color: cfg.color }}
          >
            Η διαδικασία μας
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            ΠΩΣ <span style={{ color: cfg.color }}>ΔΟΥΛΕΥΟΥΜΕ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-[calc(100%+0.75rem)] w-6 h-0.5 z-10"
                  style={{ background: cfg.color, opacity: 0.5 }}
                />
              )}
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-all group">
                <div
                  className="text-5xl font-black mb-4 leading-none"
                  style={{ color: cfg.color, opacity: 0.4 }}
                >
                  {step.num}
                </div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-white/70 font-medium text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ plan }: { plan: PlanData }) {
  const cfg = LEVEL_CONFIG[plan.level];

  return (
    <section className="py-24 bg-white border-t-[8px] border-black">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <div
          className="inline-block text-5xl mb-6"
        >
          {cfg.emoji}
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-gray-900 leading-tight mb-6">
          ΕΤΟΙΜΟΣ ΝΑ<br />
          <span style={{ color: cfg.color }}>ΞΕΚΙΝΗΣΕΙΣ;</span>
        </h2>
        <p className="text-gray-500 font-semibold text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Κάνε την εγγραφή σου σήμερα και εξασφάλισε τη θέση σου στα τμήματά μας.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/contact"
            className="px-10 py-5 font-black uppercase tracking-widest text-base text-white border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[6px] hover:translate-y-[6px] transition-all inline-block"
            style={{ background: cfg.color }}
          >
            {plan.callToAction || 'ΚΑΝΕ ΤΗΝ ΕΓΓΡΑΦΗ ΣΟΥ'}
          </Link>
          <Link
            href="/"
            className="px-10 py-5 font-black uppercase tracking-widest text-base text-gray-900 bg-white border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[6px] hover:translate-y-[6px] transition-all inline-block"
          >
            ΕΛΑ ΠΙΣΩ
          </Link>
        </div>
      </div>
    </section>
  );
}

function DirectionsSection({ sanityPrograms }: { sanityPrograms: SanityProgram[] }) {
  const FALLBACK_DIRECTIONS = [
    {
      id: "thetikes",
      title: "Θετικές Σπουδές",
      desc: "Μαθηματικά, Φυσική, Χημεία, Βιολογία",
      icon: <Sigma size={32} strokeWidth={2.5} />,
      color: "bg-brand-teal",
      textColor: "text-brand-teal",
      content: "Στις Θετικές Σπουδές στοχεύουμε στην απόλυτη κατανόηση εννοιών και φαινομένων. Το πρόγραμμά μας εστιάζει στην επίλυση σύνθετων προβλημάτων με συνεχή διαγωνίσματα προσομοίωσης, ώστε ο μαθητής να αποκτήσει αυτοπεποίθηση και ταχύτητα στις Πανελλαδικές. Ιδιαίτερη έμφαση δίνεται στην εξατομικευμένη διόρθωση λαθών και την κάλυψη κάθε απορίας."
    },
    {
      id: "anthropistikes",
      title: "Ανθρωπιστικές Σπουδές",
      desc: "Έκθεση, Ιστορία, Λογοτεχνία, Λατινικά",
      icon: <Pencil size={32} strokeWidth={2.5} />,
      color: "bg-brand-orange",
      textColor: "text-brand-orange",
      content: "Οι Ανθρωπιστικές Σπουδές (Θεωρητική Κατεύθυνση) απαιτούν κριτική σκέψη, εύστοχο λόγο και σωστή απομνημόνευση χωρίς «παπαγαλία». Με σύγχρονες μεθόδους διδασκαλίας, μαθαίνουμε στους μαθητές μας να δομούν σωστά τα κείμενά τους, να εμβαθύνουν στα ιστορικά γεγονότα και να κατακτούν εγκαίρως τον απαιτητικό γραπτό λόγο του Λυκείου."
    },
    {
      id: "ygeias",
      title: "Σπουδές Υγείας",
      desc: "Βιολογία, Χημεία, Φυσική",
      icon: <FlaskConical size={32} strokeWidth={2.5} />,
      color: "bg-brand-green",
      textColor: "text-brand-green",
      content: "Η Ιατρική και τα επαγγέλματα υγείας έχουν τον υψηλότερο ανταγωνισμό στις Πανελλαδικές. Γι' αυτό το πρόγραμμά μας περιλαμβάνει εξαντλητική εξάσκηση στη Βιολογία, βαθιά ανάλυση της Χημείας και Φυσικής, και ειδικά ενισχυτικά μαθήματα για τους μαθητές που στοχεύουν στην απόλυτη κορυφή."
    },
    {
      id: "oikonomias",
      title: "Οικονομίας & Πληροφορικής",
      desc: "Μαθηματικά, ΑΟΘ, Πληροφορική",
      icon: <Globe size={32} strokeWidth={2.5} />,
      color: "bg-brand-purple",
      textColor: "text-brand-purple",
      content: "Αυτή η κατεύθυνση είναι η πιο δημοφιλής επιλογή με υψηλές προοπτικές. Οι μαθητές μαθαίνουν στην πράξη να προσεγγίζουν προγραμματιστικά προβλήματα με αλγοριθμική σκέψη (Πληροφορική) και να αναλύουν δείκτες (ΑΟΘ). Προσφέρουμε στοχευμένο υλικό που κάνει τα μαθήματα απόλυτα κατανοητά ακόμα και από αρχάριους."
    }
  ];

  const colorMap = [
    { icon: <Sigma size={32} strokeWidth={2.5} />, color: "bg-brand-teal", textColor: "text-brand-teal" },
    { icon: <Pencil size={32} strokeWidth={2.5} />, color: "bg-brand-orange", textColor: "text-brand-orange" },
    { icon: <FlaskConical size={32} strokeWidth={2.5} />, color: "bg-brand-green", textColor: "text-brand-green" },
    { icon: <Globe size={32} strokeWidth={2.5} />, color: "bg-brand-purple", textColor: "text-brand-purple" },
  ];

  // If Sanity length > 0, map them. Or fallback to the hardcoded ones.
  const directions = sanityPrograms && sanityPrograms.length > 0 
    ? sanityPrograms.map((prog, i) => {
        const style = colorMap[i % colorMap.length];
        return {
          id: prog.slug || prog._id,
          title: prog.title,
          desc: prog.description,
          icon: style.icon,
          color: style.color,
          textColor: style.textColor,
          content: prog.bodyText || "Χωρίς λεπτομέρειες"
        };
      })
    : FALLBACK_DIRECTIONS;

  return (
    <section className="py-24 bg-gray-50 border-t-[8px] border-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 text-center">
          <span className="text-brand-orange text-xs font-black uppercase tracking-[0.3em] mb-3 block">
            Τι κάνουμε σε κάθε κατεύθυνση
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
            ΟΙ <span className="text-brand-teal">ΚΑΤΕΥΘΥΝΣΕΙΣ</span><br/>ΣΤΟ ΛΥΚΕΙΟ
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {directions.map((dir) => (
            <div key={dir.id} id={dir.id} className="scroll-mt-36 bg-white border-4 border-black p-8 lg:p-10 shadow-[8px_8px_0px_#000] relative flex flex-col items-center text-center md:items-start md:text-left transition-all hover:-translate-y-2 hover:shadow-[8px_12px_0px_#000]">
              <div className={`w-20 h-20 flex-shrink-0 flex items-center justify-center border-4 border-black text-white shadow-[4px_4px_0px_#000] ${dir.color} -mt-16 bg-white mb-6`}>
                <div className={`w-full h-full flex items-center justify-center ${dir.color}`}>
                   {dir.icon}
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
                {dir.title}
              </h3>
              <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${dir.textColor}`}>
                {dir.desc}
              </h4>
              <p className="text-gray-600 font-semibold leading-relaxed">
                {dir.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function PlanoPageContent() {
  const searchParams = useSearchParams();
  const queryLevel = searchParams.get('level');

  // Initialize activeLevel from URL params/hash at mount — avoids setState in effect
  const [activeLevel, setActiveLevel] = useState<string>(() => {
    if (queryLevel && ['gymnasio', 'lykeio'].includes(queryLevel)) return queryLevel;
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['gymnasio', 'lykeio'].includes(hash)) return hash;
      const stored = sessionStorage.getItem('planoLevel');
      if (stored && ['gymnasio', 'lykeio'].includes(stored)) {
        sessionStorage.removeItem('planoLevel');
        return stored;
      }
    }
    return 'gymnasio';
  });

  const [plans, setPlans] = useState<PlanData[]>(FALLBACK_PLANS);
  const [sanityPrograms, setSanityPrograms] = useState<SanityProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update active level if queryLevel changes after navigation
    // (intentional: responds to user navigating with ?level= query param)
    if (queryLevel && ['gymnasio', 'lykeio'].includes(queryLevel)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveLevel(queryLevel);
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['gymnasio', 'lykeio'].includes(hash)) {
        setActiveLevel(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    Promise.all([
      client.fetch<PlanData[]>(PLANS_QUERY),
      client.fetch<SanityProgram[]>(PROGRAMS_QUERY)
    ])
      .then(([planData, progData]) => {
        if (planData && planData.length > 0) setPlans(planData);
        if (progData && progData.length > 0) setSanityPrograms(progData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [queryLevel]);

  const handleTabChange = (level: string) => {
    setActiveLevel(level);
    // Remove query params or hash so it doesn't get stuck on refresh if tab changed
    if (window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('level');
      url.hash = '';
      window.history.replaceState({}, '', url.toString());
    }
    // Scroll to content smoothly
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const activePlan = plans.find((p) => p.level === activeLevel) || plans[0];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="bg-gray-950 text-white py-6 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-1">
              Φροντιστήριο Μόρφωση
            </p>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              ΤΟ <span className="text-brand-orange">ΠΛΑΝΟ</span> ΜΑΣ
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {(['gymnasio', 'lykeio'] as const).map((level) => {
              const cfg = LEVEL_CONFIG[level];
              const isActive = activeLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => handleTabChange(level)}
                  className={`group px-4 py-2 font-black text-xs uppercase tracking-widest border-2 transition-all relative overflow-hidden ${isActive
                      ? 'text-white border-transparent'
                      : 'text-gray-400 border-gray-700 hover:text-white'
                    }`}
                  style={isActive ? { background: cfg.color, borderColor: cfg.color } : {}}
                >
                  {!isActive && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ background: cfg.color }}
                    />
                  )}
                  <span className={`inline-block mr-2 transition-transform duration-300 ${!isActive ? 'group-hover:scale-125 group-hover:-rotate-12' : ''}`}>
                    {cfg.emoji}
                  </span>
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── TAB BAR ──────────────────────────────────── */}
      <TabBar active={activeLevel} onChange={handleTabChange} />

      {/* ── CONTENT ──────────────────────────────────── */}
      <div ref={contentRef}>
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ 
                borderBottomColor: LEVEL_CONFIG[activeLevel as keyof typeof LEVEL_CONFIG].color,
                borderLeftColor: LEVEL_CONFIG[activeLevel as keyof typeof LEVEL_CONFIG].color,
                borderRightColor: LEVEL_CONFIG[activeLevel as keyof typeof LEVEL_CONFIG].color
              }}
            />
          </div>
        ) : (
          activePlan && (
            <div key={activeLevel} className="animate-fade-in">
              <HeroSection active={activeLevel} plans={plans} />
              <FeaturesGrid plan={activePlan} />
              {activeLevel === 'lykeio' && <DirectionsSection sanityPrograms={sanityPrograms} />}
              <DetailedProgramsSection plan={activePlan} activeLevel={activeLevel} />
              <MethodologyBanner plan={activePlan} />
              <CTASection plan={activePlan} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function PlanoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
      <PlanoPageContent />
    </Suspense>
  );
}
