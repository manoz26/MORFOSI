"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/client";
import { FACT_COUNTS_QUERY, FOUNDING_YEAR, type FactCounts } from "@/lib/facts";
import dynamic from 'next/dynamic';
import type { FacilityPhoto } from '@/components/PremiumFacilityGallery';
const PremiumFacilityGallery = dynamic(() => import('@/components/PremiumFacilityGallery'), { ssr: false });
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Users,
  Star,
  Award,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Target,
  Lightbulb,
  Shield,
  CheckCircle,
  ArrowRight,
  Building2,
  Calendar,
  Sparkles,
  Quote,
  Play,
  Zap,
  Camera,
} from "lucide-react";

// ─────────────────────────────────────────────
//  DYNAMIC YEAR LOGIC
// ─────────────────────────────────────────────
const now = new Date();
const currentYear = now.getFullYear(); // 2026
const prevYear = currentYear - 1; // 2025
const foundingYear = FOUNDING_YEAR;
const yearsOfExp = currentYear - foundingYear;
const academicYearShort = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;

// ─────────────────────────────────────────────
//  STATIC DATA — Replace with Sanity when ready
// ─────────────────────────────────────────────

const HISTORY_PLACEHOLDER = {
  title: "Η Ιστορία μας",
  subtitle: "Από ένα μικρό γραφείο στην Αθήνα, σε ένα από τα κορυφαία φροντιστήρια της χώρας.",
  body: [
    "Το Φροντιστήριο Μόρφωση ιδρύθηκε με ένα και μοναδικό όραμα: να δώσουμε στον κάθε μαθητή τα εφόδια που χρειάζεται για να πετύχει τους στόχους του. Ξεκινήσαμε με λίγα τμήματα και μεγάλο πάθος, και σήμερα αποτελούμε σημείο αναφοράς για εκατοντάδες οικογένειες.",
    "Από την πρώτη στιγμή, πιστέψαμε ότι η ποιοτική εκπαίδευση δεν είναι προνόμιο λίγων. Σχεδιάσαμε ένα σύστημα που συνδυάζει την ατομική προσοχή με τη δυναμική ομάδας, δημιουργώντας ένα περιβάλλον όπου κάθε μαθητής αισθάνεται ότι ανήκει.",
    "Σήμερα, μετά από τόσες γενιές μαθητών, συνεχίζουμε να εξελισσόμαστε. Νέα εργαλεία, νέες μέθοδοι, αλλά πάντα με τις ίδιες αξίες: αφοσίωση, αριστεία και ανθρωπιά.",
  ],
};

const TIMELINE_ITEMS = [
  {
    year: "2001",
    title: "Η Αρχή",
    desc: "Ίδρυση του Φροντιστηρίου Μόρφωση με 3 καθηγητές και 45 μαθητές στο πρώτο έτος λειτουργίας.",
    color: "bg-brand-teal",
    accent: "border-brand-teal",
    textAccent: "text-brand-teal",
  },
  {
    year: "2008",
    title: "Πρώτες Επιτυχίες",
    desc: "Ο πρώτος μαθητής μας μπήκε στην Ιατρική Αθηνών. Μια στιγμή που επιβεβαίωσε το όραμά μας.",
    color: "bg-brand-orange",
    accent: "border-brand-orange",
    textAccent: "text-brand-orange",
  },
  {
    year: "2012",
    title: "Επέκταση",
    desc: "Μετακόμισμα σε νέες, μεγαλύτερες εγκαταστάσεις. Προσθήκη εξειδικευμένων αιθουσών και βιβλιοθήκης.",
    color: "bg-brand-green",
    accent: "border-brand-green",
    textAccent: "text-brand-green",
  },
  {
    year: "2016",
    title: "Ψηφιακή Εποχή",
    desc: "Εισαγωγή ψηφιακών εργαλείων διδασκαλίας και online πλατφόρμας για τους μαθητές μας.",
    color: "bg-brand-purple",
    accent: "border-brand-purple",
    textAccent: "text-brand-purple",
  },
  {
    year: "2020",
    title: "Πανδημία & Ανθεκτικότητα",
    desc: "Μεταβήκαμε αστραπιαία στο online μοντέλο, διατηρώντας αναλλοίωτη την ποιότητα της διδασκαλίας.",
    color: "bg-brand-red",
    accent: "border-brand-red",
    textAccent: "text-brand-red",
  },
  {
    year: "2024",
    title: "Ανακαίνιση & Εξέλιξη",
    desc: "Πλήρης ανακαίνιση εγκαταστάσεων και προσθήκη νέων διαδραστικών μέσων διδασκαλίας.",
    color: "bg-brand-teal-dark",
    accent: "border-brand-teal-dark",
    textAccent: "text-brand-teal-dark",
  },
  {
    year: "2025",
    title: "Ρεκόρ Επιτυχιών",
    desc: "Μια από τις πιο επιτυχημένες χρονιές μας με πάνω από 30 μαθητές στις πρώτες τους επιλογές.",
    color: "bg-brand-orange",
    accent: "border-brand-orange",
    textAccent: "text-brand-orange",
  },
];

const VALUES = [
  {
    icon: Heart,
    num: "01",
    title: "Ανθρωπιά",
    desc: "Βλέπουμε τον μαθητή ως άνθρωπο, όχι ως αριθμό. Η ψυχολογική υποστήριξη είναι τόσο σημαντική όσο και η ακαδημαϊκή.",
    color: "bg-brand-teal",
  },
  {
    icon: Target,
    num: "02",
    title: "Αριστεία",
    desc: "Δεν συμβιβαζόμαστε με το «αρκετό». Στοχεύουμε πάντα στο ανώτερο δυνατό αποτέλεσμα για κάθε μαθητή.",
    color: "bg-brand-orange",
  },
  {
    icon: Lightbulb,
    num: "03",
    title: "Καινοτομία",
    desc: "Ενσωματώνουμε νέες μεθόδους και τεχνολογίες για να κάνουμε τη μάθηση πιο αποτελεσματική και ελκυστική.",
    color: "bg-brand-green",
  },
  {
    icon: Shield,
    num: "04",
    title: "Αξιοπιστία",
    desc: `${yearsOfExp} χρόνια συνέπειας και αποτελεσμάτων. Οι γονείς μας εμπιστεύονται γιατί τηρούμε πάντα αυτά που υπόσχουμε.`,
    color: "bg-brand-purple",
  },
];

// Μόνο πραγματικά νούμερα (βλ. src/lib/facts.ts): χρόνια από την ίδρυση και
// ό,τι μετριέται στο Sanity. Χωρίς ποσοστά/σύνολα που δεν έχουν μετρηθεί.
type StatItem = { num: string; label: string; icon: typeof Calendar; color: string };

function buildStats(counts: FactCounts | null): StatItem[] {
  const stats: StatItem[] = [
    { num: `${yearsOfExp}`, label: "Χρόνια Εμπειρίας", icon: Calendar, color: "text-brand-teal" },
  ];
  if (counts?.teachers) stats.push({ num: `${counts.teachers}`, label: "Εξειδικευμένοι Καθηγητές", icon: GraduationCap, color: "text-brand-green" });
  if (counts?.books) stats.push({ num: `${counts.books}`, label: "Εκδόσεις Βιβλίων", icon: BookOpen, color: "text-brand-orange" });
  return stats;
}

const FACILITIES = [
  {
    title: "Αίθουσες Διδασκαλίας",
    desc: "Σύγχρονες αίθουσες με κλιματισμό και ήσυχο περιβάλλον, στημένες για ολιγομελή τμήματα.",
    icon: Building2,
    color: "bg-brand-teal",
  },
  {
    title: "Βιβλιοθήκη & Μελετητήριο",
    desc: "Πλούσια βιβλιοθήκη με εκπαιδευτικό υλικό, ήσυχο μελετητήριο ανοιχτό καθημερινά τις ώρες λειτουργίας του φροντιστηρίου.",
    icon: BookOpen,
    color: "bg-brand-orange",
  },
  {
    title: "Χώρος Χαλάρωσης",
    desc: "Άνετος χώρος ανάπαυσης για μαθητές μεταξύ μαθημάτων. Καφέ, νερό και σνακ διαθέσιμα.",
    icon: Heart,
    color: "bg-brand-green",
  },
  {
    title: "Ψηφιακή Υποδομή",
    desc: "Γρήγορο Wi-Fi πανταχού, tablets για διαδραστική μάθηση, και online πρόσβαση στο εκπαιδευτικό υλικό.",
    icon: Zap,
    color: "bg-brand-purple",
  },
];

const TESTIMONIALS = [
  {
    name: "Ελένη Παπαδοπούλου",
    year: `${prevYear}`,
    school: "Ιατρική Αθηνών",
    text: "Το Φροντιστήριο Μόρφωση με βοήθησε να μπω στην Ιατρική με 19.540 μόρια. Οι καθηγητές είναι εξαιρετικοί και το κλίμα είναι μοναδικό!",
    grade: "19.540",
    color: "border-brand-teal",
    accent: "text-brand-teal",
  },
  {
    name: "Νίκος Κωνσταντίνου",
    year: `${prevYear - 1}`,
    school: "Πολυτεχνείο ΕΜΠ",
    text: "Φοβερή προετοιμασία στα Μαθηματικά και τη Φυσική. Χωρίς το Μόρφωση δεν θα είχα πετύχει τον στόχο μου για το Πολυτεχνείο.",
    grade: "18.870",
    color: "border-brand-orange",
    accent: "text-brand-orange",
  },
  {
    name: "Μαρία Αντωνίου",
    year: `${prevYear}`,
    school: "Νομική ΕΚΠΑ",
    text: "Η ατμόσφαιρα στο φροντιστήριο είναι ανταγωνιστική αλλά και συνεργατική. Μάθαμε μαζί και πετύχαμε μαζί!",
    grade: "18.340",
    color: "border-brand-green",
    accent: "text-brand-green",
  },
];

const TEAM_ROLES = [
  { role: "Διευθυντής", name: "Βασίλης Βέλμαχος", desc: `Ιδρυτής & Ακαδημαϊκός Διευθυντής από το ${FOUNDING_YEAR}`, color: "bg-brand-teal" },
  { role: "Γραμματεία", name: "Άννα Κυριακίδου", desc: "Υπεύθυνη Εγγραφών & Εξυπηρέτησης. Πάντα εδώ για κάθε ερώτηση.", color: "bg-brand-orange" },
  { role: "Ακαδημαϊκός Σύμβουλος", name: "Δρ. Κώστας Νικολάου", desc: "Καθοδηγεί μαθητές στην επιλογή κατεύθυνσης και σχολής.", color: "bg-brand-green" },
];

// ─────────────────────────────────────────────
//  ANIMATED COUNTER HOOK
// ─────────────────────────────────────────────
function useCountUp(target: string, duration = 2000, inView = false) {
  const [count, setCount] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(numericTarget)) {
      setTimeout(() => setCount(target), 0);
      return;
    }
    const suffix = target.replace(/[0-9.]/g, "");
    let start = 0;
    const increment = numericTarget / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start).toLocaleString("el-GR") + suffix);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return count;
}

// ─────────────────────────────────────────────
//  STAT CARD WITH COUNTER ANIMATION
// ─────────────────────────────────────────────
function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(stat.num, 2000, inView);
  const Icon = stat.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative bg-white border-4 border-gray-900 shadow-[8px_8px_0px_#111] hover:shadow-[4px_4px_0px_#111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 p-8 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`w-14 h-14 border-4 border-gray-900 flex items-center justify-center mb-6 ${stat.color} bg-opacity-10`}>
        <Icon size={24} className={stat.color} strokeWidth={2.5} />
      </div>

      <div className={`text-4xl xl:text-5xl font-black tracking-tighter leading-none mb-3 ${stat.color}`}>
        {count}
      </div>
      <div className="text-xs font-black uppercase tracking-widest text-gray-500">
        {stat.label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────
export default function AboutPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [contactPhone, setContactPhone] = useState("210 506 3610");
  const [address, setAddress] = useState("25ης Μαρτίου 84, Αγίου Δημητρίου 17, Πετρούπολη 132 31");
  const [contactEmail, setContactEmail] = useState("morfosifront@gmail.com");
  const [facilityPhotos, setFacilityPhotos] = useState<FacilityPhoto[]>([]);
  const [eventPhotos, setEventPhotos] = useState<Array<{ _id: string; title: string; photoUrl: string; description?: string; date?: string }>>([]);
  const [activeEventPhoto, setActiveEventPhoto] = useState(0);
  const [counts, setCounts] = useState<FactCounts | null>(null);
  const stats = buildStats(counts);

  useEffect(() => {
    client.fetch(`*[_type == "siteSettings"][0]{ contactPhone, address, contactEmail }`).then(data => {
      if (data?.contactPhone) setContactPhone(data.contactPhone);
      if (data?.address) setAddress(data.address);
      if (data?.contactEmail) setContactEmail(data.contactEmail);
    }).catch(console.error);

    client.fetch<FactCounts>(FACT_COUNTS_QUERY)
      .then(setCounts)
      .catch(console.error);

    client.fetch(`*[_type == "facilityPhoto"] | order(order asc) { _id, title, featured, hideFromMain, "photoUrl": photo.asset->url, "aspect": photo.asset->metadata.dimensions.aspectRatio }`)
      .then(data => { if (data?.length) setFacilityPhotos(data); })
      .catch(console.error);

    client.fetch(`*[_type == "eventPhoto"] | order(order asc) { _id, title, description, date, "photoUrl": photo.asset->url }`)
      .then(data => { if (data?.length) setEventPhotos(data); })
      .catch(console.error);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate event photos
  useEffect(() => {
    if (eventPhotos.length < 2) return;
    const timer = setInterval(() => {
      setActiveEventPhoto((prev) => (prev + 1) % eventPhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [eventPhotos]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-teal selection:text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#031516] overflow-hidden pt-40 pb-32 md:pt-52 md:pb-40">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          aria-hidden="true"
        />

        {/* Color bar top */}
        <div className="absolute top-0 left-0 w-full h-[8px] bg-gradient-to-r from-brand-teal via-brand-orange to-brand-green" />

        {/* Ghost text */}
        <span
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[20vw] font-black text-white/[0.02] whitespace-nowrap select-none pointer-events-none tracking-widest uppercase leading-none"
          aria-hidden="true"
        >
          ΜΟΡΦΩΣΗ
        </span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-16">
            {/* Left */}
            <div className="flex-1 max-w-3xl">
              <div className="inline-flex items-center gap-3 bg-brand-orange px-6 py-3 border-4 border-white/20 mb-10">
                <Building2 className="text-white" size={18} strokeWidth={3} />
                <span className="text-white font-black text-xs uppercase tracking-[0.3em]">Ποιοι Είμαστε</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-[90px] font-black text-white uppercase tracking-tighter leading-[0.9] mb-10">
                <span className="text-white">ΤΟ </span>
                <span className="text-brand-teal">ΦΡΟΝΤΙ</span>
                <span className="text-brand-orange">ΣΤΗΡΙΟ</span>
                <br />
                <span className="text-white">ΠΟΥ </span>
                <span className="relative inline-block">
                  <span className="text-white">ΑΛΛΑΖΕΙ</span>
                  <span className="absolute -bottom-2 left-0 w-full h-[6px] bg-brand-orange" />
                </span>
                <br />
                <span className="text-brand-green">ΖΩΕΣ.</span>
              </h1>

              <p className="text-gray-300 font-bold text-xl md:text-2xl max-w-2xl leading-relaxed border-l-[6px] border-brand-teal pl-6">
                Από το {foundingYear}, εκατοντάδες μαθητές μπήκαν στη σχολή που ονειρεύονταν.
                Αυτό δεν είναι τύχη — είναι αποτέλεσμα δουλειάς, εμπιστοσύνης και πάθους.
              </p>
            </div>

            {/* Right: Quick info cards */}
            <div className="flex flex-col gap-4 flex-shrink-0">
              {[
                { label: "Ιδρύθηκε", val: "2001", icon: Calendar, color: "bg-brand-teal" },
                { label: "Τοποθεσία", val: "Αθήνα", icon: MapPin, color: "bg-brand-orange" },
                ...(counts?.teachers ? [{ label: "Καθηγητές", val: `${counts.teachers}`, icon: GraduationCap, color: "bg-brand-green" }] : []),
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={`${item.color} border-4 border-white/20 p-5 min-w-[200px] flex items-center gap-4 shadow-[6px_6px_0px_rgba(255,255,255,0.08)]`}>
                    <Icon size={24} className="text-white flex-shrink-0" />
                    <div>
                      <div className="text-white/70 font-black text-[10px] uppercase tracking-widest">{item.label}</div>
                      <div className="text-white font-black text-2xl tracking-tighter">{item.val}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Orange marquee strip */}
      <div className="bg-brand-orange border-y-[6px] border-black overflow-hidden py-4">
        <div className="flex gap-16 animate-billboard whitespace-nowrap">
          {[
            `${yearsOfExp} ΧΡΟΝΙΑ ΕΜΠΕΙΡΙΑΣ`, "ΔΙΚΕΣ ΜΑΣ ΕΚΔΟΣΕΙΣ", "ΜΙΚΡΑ ΤΜΗΜΑΤΑ",
            "ΕΞΑΤΟΜΙΚΕΥΜΕΝΗ ΠΡΟΣΟΧΗ", "ΚΟΡΥΦΑΙΟΙ ΚΑΘΗΓΗΤΕΣ", "ΑΘΗΝΑ",
            `${yearsOfExp} ΧΡΟΝΙΑ ΕΜΠΕΙΡΙΑΣ`, "ΔΙΚΕΣ ΜΑΣ ΕΚΔΟΣΕΙΣ", "ΜΙΚΡΑ ΤΜΗΜΑΤΑ",
          ].map((s, i) => (
            <span key={i} className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-6">
              {s} <span className="text-black/30">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          2. MISSION STATEMENT
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-28 border-b-[8px] border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Sparkles size={16} />
                <span>Η Αποστολή μας</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-snug tracking-tight mb-8">
                Δεν πουλάμε{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">μαθήματα.</span>
                  <span className="absolute bottom-1 left-0 w-full h-4 bg-brand-teal/20 -z-10" />
                </span>
                <br />
                Επενδύουμε σε{" "}
                <span className="text-brand-orange underline decoration-wavy decoration-brand-orange/40">
                  ανθρώπους.
                </span>
              </h2>
              <div className="space-y-4 text-gray-600 font-medium text-lg leading-relaxed max-w-2xl">
                {HISTORY_PLACEHOLDER.body.slice(0, historyExpanded ? undefined : 1).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <button
                onClick={() => setHistoryExpanded(!historyExpanded)}
                className="mt-8 inline-flex items-center gap-2 border-4 border-gray-900 px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all group"
              >
                {historyExpanded ? "Λιγότερα" : "Διάβασε την Ιστορία μας"}
                <ChevronRight size={16} className={`transition-transform ${historyExpanded ? "rotate-90" : "group-hover:translate-x-1"}`} />
              </button>
            </div>

            {/* Right side — 2 highlight boxes */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-[#031516] text-white p-10 border-[4px] border-gray-900 shadow-[12px_12px_0px_#000]">
                <Quote size={40} className="text-brand-teal mb-6 opacity-60" />
                <p className="font-black text-2xl leading-snug tracking-tight text-white">
                  &quot;Κάθε παιδί έχει τα μέσα να πετύχει. Εμείς τα βοηθάμε να τα ανακαλύψουν.&quot;
                </p>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="font-black text-brand-teal text-sm uppercase tracking-widest">Βασίλης Βέλμαχος</div>
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">Ιδρυτής & Διευθυντής</div>
                </div>
              </div>

              <div className="bg-brand-teal p-8 border-[4px] border-gray-900 shadow-[8px_8px_0px_#000] flex items-center gap-6">
                <div className="w-16 h-16 bg-white flex items-center justify-center flex-shrink-0 border-4 border-gray-900">
                  <Calendar size={28} className="text-brand-teal" />
                </div>
                <div>
                  <div className="text-white/80 font-black text-xs uppercase tracking-widest mb-1">Στην εκπαίδευση από το</div>
                  <div className="text-white font-black text-4xl tracking-tighter">{foundingYear}</div>
                  <div className="text-white/70 text-sm font-bold">{yearsOfExp} χρόνια δίπλα σε μαθητές και γονείς</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. STATS GRID
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-28 border-b-[8px] border-brand-orange">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
              <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Award size={16} />
                <span>Αριθμοί που Μιλούν</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                Η ΜΟΡΦΩΣΗ<br />
                <span className="text-brand-orange relative">
                  ΣΕ ΑΡΙΘΜΟΥΣ
                  <span className="absolute -bottom-2 left-0 w-full h-[6px] bg-brand-orange" />
                </span>
              </h2>
            </div>
            <p className="text-gray-500 font-bold max-w-sm text-lg leading-relaxed">
              {yearsOfExp} χρόνια δουλειάς. Βάζουμε μόνο αριθμούς που μπορούμε να δείξουμε — τους επιτυχόντες κάθε χρονιάς θα τους βρεις ονομαστικά στις{" "}
              <Link href="/epityxontes" className="text-brand-orange underline underline-offset-4 hover:text-gray-900">λίστες επιτυχόντων</Link>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
            <Link
              href="/epityxontes"
              className="group relative bg-brand-orange border-4 border-gray-900 shadow-[8px_8px_0px_#111] hover:shadow-[4px_4px_0px_#111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 p-8 overflow-hidden flex flex-col justify-between"
            >
              <div className="w-14 h-14 border-4 border-gray-900 bg-white flex items-center justify-center mb-6">
                <Award size={24} className="text-brand-orange" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-2xl xl:text-3xl font-black tracking-tighter leading-none mb-3 text-white uppercase">Επιτυχόντες</div>
                <div className="text-xs font-black uppercase tracking-widest text-white/90 flex items-center gap-2">
                  Δες τις λίστες ανά χρονιά
                  <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. TIMELINE
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-28 border-b-[8px] border-brand-teal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center justify-center gap-2">
              <Clock size={16} />
              <span>Το Χρονικό μας</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">
              {yearsOfExp} ΧΡΟΝΙΑ<br />
              <span className="text-brand-teal">ΙΣΤΟΡΙΑΣ</span>
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line (desktop) */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[4px] bg-gray-900" />

            <div className="flex flex-col gap-0">
              {TIMELINE_ITEMS.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-0 pb-16 last:pb-0 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Content card */}
                  <div className={`flex-1 ${i % 2 === 0 ? "lg:pr-20" : "lg:pl-20"}`}>
                    <div className={`bg-white border-[4px] border-gray-900 shadow-[8px_8px_0px_#111] p-8 hover:shadow-[4px_4px_0px_#111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all group relative overflow-hidden`}>
                      <div className={`absolute top-0 left-0 w-full h-[6px] ${item.color}`} />
                      <div className={`font-black text-5xl ${item.textAccent} tracking-tighter leading-none mb-4`}>{item.year}</div>
                      <h3 className="font-black text-2xl text-gray-900 uppercase tracking-tight mb-3">{item.title}</h3>
                      <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center dot (desktop) */}
                  <div className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 ${item.color} border-4 border-white shadow-[0_0_0_4px_#111] items-center justify-center z-10 flex-shrink-0`}>
                    <CheckCircle size={18} className="text-white" strokeWidth={3} />
                  </div>

                  {/* Empty side */}
                  <div className="hidden lg:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. VALUES
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#031516] py-28 border-b-[8px] border-brand-orange">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-6">Οι Αξίες μας</div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              ΤΙ ΜΑΣ<br />
              <span className="text-brand-orange">ΚΙΝΕΙ.</span>
            </h2>
            <p className="text-gray-400 font-bold text-lg max-w-xl mx-auto mt-6 leading-relaxed">
              Πίσω από κάθε επιτυχία κρύβονται οι αξίες που καθοδηγούν κάθε μας απόφαση.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-[4px] border-white/10 shadow-[16px_16px_0px_#000]">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.num}
                  className={`${v.color} p-10 border-r-[4px] last:border-r-0 border-white/10 group hover:scale-105 transition-transform duration-300 relative overflow-hidden cursor-default`}
                >
                  <div className="absolute -top-6 -right-4 text-[7rem] font-black text-black/10 leading-none select-none">
                    {v.num}
                  </div>
                  <div className="w-14 h-14 bg-white/20 border-2 border-white/30 flex items-center justify-center mb-6 relative z-10">
                    <Icon size={28} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="text-white font-black text-5xl tracking-tighter leading-none mb-4 relative z-10">{v.num}</div>
                  <div className="text-white font-black text-2xl uppercase tracking-tight mb-4 relative z-10">{v.title}</div>
                  <div className="text-white/80 font-medium text-sm leading-relaxed relative z-10">{v.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. FACILITIES
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-28 border-b-[8px] border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
              <div className="text-brand-green font-black text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Building2 size={16} />
                <span>Οι Εγκαταστάσεις μας</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                Ο ΧΩΡΟΣ<br />
                <span className="text-brand-green">ΠΟΥ ΜΑΘΑΙΝΕΙΣ</span>
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-gray-500 font-bold text-lg leading-relaxed">
                Σύγχρονες αίθουσες, πλήρης εξοπλισμός και ένα περιβάλλον που εμπνέει.
                Τα παιδιά αγαπούν να έρχονται εδώ.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-brand-teal transition-colors group"
              >
                Κλείσε Επίσκεψη
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[4px] border-gray-900 shadow-[12px_12px_0px_#000]">
            {FACILITIES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  onClick={i === 0 ? () => document.getElementById('facilities')?.scrollIntoView({ behavior: 'smooth' }) : undefined}
                  className={`p-10 bg-white border-b-[4px] border-r-[4px] border-gray-900 group hover:bg-gray-900 transition-colors duration-300 relative overflow-hidden ${i === 0 ? "cursor-pointer" : ""} ${i === 1 || i === 3 ? "border-r-0" : ""} ${i === 2 || i === 3 ? "border-b-0" : ""}`}
                >
                  <div className="absolute top-0 left-0 w-[6px] h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "currentColor" }} />
                  <div className={`w-16 h-16 ${f.color} border-4 border-gray-900 flex items-center justify-center mb-6 shadow-[4px_4px_0px_#111] group-hover:shadow-[2px_2px_0px_#fff]`}>
                    <Icon size={28} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-[4px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="font-black text-xl uppercase tracking-tight text-gray-900 group-hover:text-white transition-colors mb-4">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-300 font-medium leading-relaxed transition-colors">
                    {f.desc}
                  </p>
                  <div className={`mt-8 h-[3px] ${f.color} w-12 group-hover:w-full transition-all duration-500`} />
                </div>
              );
            })}
          </div>

          {/* Facility Photo Grid — Premium Editorial Gallery fetched from Sanity */}
          <div id="facilities" className="mt-20 scroll-mt-32">
            <PremiumFacilityGallery photos={facilityPhotos} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEW 6.5. EVENTS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#031516] py-28 border-b-[8px] border-brand-orange relative overflow-hidden">
        {/* Subtle background element */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: "radial-gradient(circle, #f58220 1.5px, transparent 1.5px)", backgroundSize: "40px 40px" }}
          aria-hidden="true"
        />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
              <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Camera size={16} />
                <span>Οι Εκδηλώσεις μας</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                ΣΤΙΓΜΕΣ<br />
                <span className="text-brand-orange relative inline-block">
                  ΠΟΥ ΜΕΝΟΥΝ
                  <span className="absolute -bottom-2 left-0 w-full h-[6px] bg-brand-orange" />
                </span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-gray-400 font-bold text-lg leading-relaxed border-l-[4px] border-brand-orange pl-4">
                Η ζωή στο φροντιστήριο δεν είναι μόνο μαθήματα. Γιορτάζουμε, μαθαίνουμε και δημιουργούμε αναμνήσεις ως μια δεμένη ομάδα.
              </p>
            </div>
          </div>

          <div className="relative border-[4px] border-white/10 shadow-[16px_16px_0px_#000] bg-black overflow-hidden group transition-all duration-700 ease-in-out w-fit mx-auto max-w-full">
            {eventPhotos.length > 0 ? (
              <div className="relative w-full">
                {eventPhotos.map((ep, i) => (
                  <div
                    key={ep._id}
                    className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden w-full ${
                      i === activeEventPhoto 
                        ? "relative opacity-100 scale-100 blur-none z-10" 
                        : "absolute top-0 left-0 opacity-0 scale-[0.97] blur-xl pointer-events-none z-0"
                    }`}
                  >
                    {/* Native fitting photo bounded by viewport height to prevent scrolling jumps */}
                    <img src={ep.photoUrl} alt={ep.title} className="max-h-[65vh] md:max-h-[80vh] w-auto max-w-full h-auto block object-contain opacity-90 mx-auto" />
                    
                    {/* Clean Gradient Overlay - No Text as requested */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none" />
                  </div>
                ))}

                {/* Left/Right Navigation Arrows */}
                {eventPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveEventPhoto((prev) => (prev - 1 + eventPhotos.length) % eventPhotos.length)}
                      className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-brand-orange text-white rounded-full backdrop-blur-sm transition-all shadow-lg z-30 group"
                      aria-label="Προηγούμενη φωτογραφία"
                    >
                      <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => setActiveEventPhoto((prev) => (prev + 1) % eventPhotos.length)}
                      className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-brand-orange text-white rounded-full backdrop-blur-sm transition-all shadow-lg z-30 group"
                      aria-label="Επόμενη φωτογραφία"
                    >
                      <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </>
                )}
                {/* Navigation Buttons and Progress */}
                {eventPhotos.length > 1 && (
                  <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
                    <div className="flex gap-2">
                      {eventPhotos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveEventPhoto(i)}
                          className={`h-2 transition-all duration-300 ${i === activeEventPhoto ? "w-8 bg-brand-orange" : "w-2 bg-white/40 hover:bg-white/80"}`}
                          aria-label={`Εκδήλωση ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-center relative z-10 px-6">
                  <Camera size={48} className="text-brand-orange/40 mx-auto mb-6" />
                  <div className="text-white font-black text-2xl uppercase tracking-widest mb-3">Φωτογραφίες Εκδηλώσεων</div>
                  <div className="text-gray-500 font-bold max-w-sm mx-auto">Προσθέστε φωτογραφίες από τον τύπο &quot;Φωτογραφίες Εκδηλώσεων&quot; στο Sanity Studio για να εμφανιστούν εδώ.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-28 border-b-[8px] border-brand-purple">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="text-brand-purple font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center justify-center gap-2">
              <Star size={16} />
              <span>Επιτυχίες Μαθητών</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">
              ΑΥΤΟΙ ΠΟΥ<br />
              <span className="text-brand-purple">ΠΕΤΥΧΑΝ.</span>
            </h2>
          </div>

          {/* Active testimonial - Refactored with AnimatePresence for smooth transitions */}
          <div className="max-w-4xl mx-auto mb-12 relative min-h-[420px] md:min-h-[380px]">
            <AnimatePresence mode="wait">
              {TESTIMONIALS.map((t, i) => i === activeTestimonial && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -10 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                >
                  <div className={`bg-white border-[6px] ${t.color} shadow-[16px_16px_0px_#111] p-10 md:p-14 relative h-full`}>
                    <Quote size={60} className={`${t.accent} opacity-20 absolute top-8 right-8`} />
                    <p className="text-gray-800 font-bold text-2xl md:text-3xl leading-relaxed mb-10">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 ${t.color.replace("border-", "bg-").replace("brand-", "brand-")} bg-gray-100 border-4 border-gray-900 flex items-center justify-center flex-shrink-0`}>
                          <GraduationCap size={32} className="opacity-40" />
                        </div>
                        <div>
                          <div className="font-black text-xl text-gray-900 uppercase tracking-tight">{t.name}</div>
                          <div className="text-gray-500 font-bold">{t.school}</div>
                        </div>
                      </div>

                      {/* Success badge */}
                      <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 border-2 border-gray-900 rounded-lg">
                        <Star className={t.accent} size={18} fill="currentColor" />
                        <span className="font-black text-sm uppercase tracking-wider">{t.grade} ΜΟΡΙΑ</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`transition-all duration-300 border-2 border-gray-900 ${i === activeTestimonial ? "w-8 h-4 bg-brand-orange" : "w-4 h-4 bg-white hover:bg-gray-100"}`}
                aria-label={`Μαρτυρία ${i + 1}`}
              />
            ))}
          </div>

          {/* All successes banner */}
          <div className="mt-16 bg-brand-orange border-[4px] border-gray-900 shadow-[12px_12px_0px_#000] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="text-white/80 font-black text-xs uppercase tracking-widest mb-2">Οι Επιτυχόντες μας</div>
              <div className="text-white font-black text-5xl md:text-7xl tracking-tighter leading-none">ΟΝΟΜΑΣΤΙΚΑ</div>
              <div className="text-white/80 font-bold text-lg mt-2">όλες οι λίστες επιτυχόντων στις Πανελλήνιες, χρονιά προς χρονιά</div>
            </div>
            <Link
              href="/epityxontes"
              className="flex-shrink-0 bg-white text-gray-900 px-10 py-5 font-black text-sm uppercase tracking-widest border-4 border-gray-900 hover:bg-gray-900 hover:text-white transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] flex items-center gap-3"
            >
              Δες τις λίστες
              <ChevronRight size={18} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. TEAM OVERVIEW (non-teachers)
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-28 border-b-[8px] border-brand-teal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center justify-center gap-2">
              <Users size={16} />
              <span>Η Ομάδα</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">
              ΟΙ ΑΝΘΡΩΠΟΙ<br />
              <span className="text-brand-teal">ΠΙΣΩ ΑΠΟ</span><br />
              ΤΗ ΜΟΡΦΩΣΗ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[4px] border-gray-900 shadow-[12px_12px_0px_#000]">
            {TEAM_ROLES.map((member, i) => (
              <div
                key={i}
                className={`group relative bg-white border-r-[4px] last:border-r-0 border-gray-900 p-10 overflow-hidden hover:bg-gray-900 transition-colors duration-300 cursor-default`}
              >
                <div className={`absolute top-0 left-0 w-full h-[6px] ${member.color}`} />
                <div className={`w-20 h-20 ${member.color} border-4 border-gray-900 flex items-center justify-center mb-6 shadow-[4px_4px_0px_#000] group-hover:shadow-[2px_2px_0px_#fff] transition-shadow`}>
                  <Users size={32} className="text-white" strokeWidth={2} />
                </div>
                <div className="text-gray-400 group-hover:text-gray-500 font-black text-xs uppercase tracking-widest mb-3 transition-colors">
                  {member.role}
                </div>
                <h3 className="font-black text-2xl text-gray-900 group-hover:text-white uppercase tracking-tight mb-4 transition-colors">
                  {member.name}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-300 font-medium leading-relaxed transition-colors">
                  {member.desc}
                </p>
                {/* Sanity note */}
                <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-gray-600 transition-colors">
                  [Ενημερώσιμο από Sanity → τύπος: &quot;teamMember&quot;]
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/teachers"
              className="inline-flex items-center gap-3 border-4 border-gray-900 px-12 py-5 font-black text-sm uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all group shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px]"
            >
              Δες Όλους τους Καθηγητές
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. CONTACT INFO STRIP
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 border-b-[8px] border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[4px] border-gray-900 shadow-[12px_12px_0px_#000]">
            {[
              {
                icon: MapPin,
                label: "Βρείτε μας",
                val: address,
                sub: "[Ενημερώσιμο από Sanity → siteSettings.address]",
                color: "bg-brand-teal",
                href: "https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJ2dY8P6WjoRQRkE-VfXoIcO8",
              },
              {
                icon: Phone,
                label: "Καλέστε μας",
                val: contactPhone,
                sub: "Δευ-Παρ 09:00-21:00 · Σάβ 09:00-14:00",
                color: "bg-brand-orange",
                href: `tel:${contactPhone.replace(/\s+/g, "")}`,
              },
              {
                icon: Mail,
                label: "Email",
                val: contactEmail,
                sub: "[Ενημερώσιμο από Sanity → siteSettings.contactEmail]",
                color: "bg-brand-green",
                href: "mailto:morfosifront@gmail.com",
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <a
                  key={i}
                  href={c.href}
                  className="group flex flex-col p-10 bg-white border-r-[4px] last:border-r-0 border-gray-900 hover:bg-gray-900 transition-colors duration-300 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-[6px] ${c.color}`} />
                  <div className={`w-14 h-14 ${c.color} border-4 border-gray-900 flex items-center justify-center mb-6 shadow-[4px_4px_0px_#000] group-hover:shadow-[1px_1px_0px_#fff] transition-shadow`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-gray-400 font-black text-xs uppercase tracking-widest mb-3 group-hover:text-gray-500 transition-colors">
                    {c.label}
                  </div>
                  <div className="font-black text-xl text-gray-900 group-hover:text-white transition-colors mb-2">
                    {c.val}
                  </div>
                  <div className="text-gray-400 text-xs font-bold group-hover:text-gray-500 transition-colors">
                    {c.sub}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          10. FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#031516] py-40 border-t-[8px] border-brand-orange relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #f58220 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          aria-hidden="true"
        />
        {/* Huge ghost text */}
        <span
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-[25vw] font-black text-white/[0.015] whitespace-nowrap select-none pointer-events-none tracking-widest uppercase"
          aria-hidden="true"
        >
          ΕΓΓΡΑΦΗ
        </span>

        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-10">
            Η Επόμενη Επιτυχία — Η Δική σου
          </div>

          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
            ΕΛΑΣΤΕ<br />
            <span className="text-brand-teal">ΝΑ ΣΑΣ</span><br />
            ΓΝΩΡΙΣΟΥΜΕ.
          </h2>

          <p className="text-gray-300 font-bold text-xl max-w-2xl mx-auto mb-14 leading-relaxed">
            Οι εγγραφές για το {academicYearShort} είναι ανοιχτές. Κλείστε τη θέση σας σήμερα και κάντε το πρώτο βήμα
            προς τη σχολή που ονειρεύεστε.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              id="about-cta-enroll"
              className="inline-flex items-center justify-center gap-3 bg-brand-orange text-white px-14 py-6 font-black uppercase tracking-widest text-base border-4 border-transparent hover:border-white transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(245,130,32,0.6)] shadow-[0_0_0_rgba(245,130,32,0)]"
            >
              ΕΓΓΡΑΦΗ ΤΩΡΑ
              <ArrowRight size={20} strokeWidth={3} />
            </Link>
            <a
              href={`tel:${contactPhone.replace(/\s+/g, "")}`}
              id="about-cta-call"
              className="inline-flex items-center justify-center gap-3 bg-transparent text-white px-14 py-6 font-black uppercase tracking-widest text-base border-4 border-white/30 hover:border-white hover:bg-white/10 transition-all hover:-translate-y-2"
            >
              <Phone size={18} strokeWidth={3} />
              {contactPhone}
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-20 flex flex-wrap justify-center gap-8">
            {[
              { icon: Shield, label: "Εγγύηση Αριστείας" },
              { icon: Award, label: `${yearsOfExp} Χρόνια Εμπειρίας` },
              { icon: Users, label: "Μικρά Τμήματα" },
              { icon: CheckCircle, label: "Αποδεδειγμένα Αποτελέσματα" },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="flex items-center gap-3 text-gray-400">
                  <Icon size={18} className="text-brand-teal" />
                  <span className="font-black text-xs uppercase tracking-widest">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
