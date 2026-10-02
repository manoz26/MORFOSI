"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  CalendarCheck,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Star,
  Brain,
  Target,
  Compass,
  BookOpen,
  HeartHandshake,
  Phone,
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Ραντεβού & Ερωτηματολόγιο",
    desc: "Κάθε μαθητής συμπληρώνει ένα εξειδικευμένο ερωτηματολόγιο αξιολόγησης κλίσεων, ενδιαφερόντων και αξιών πριν από τη συνεδρία.",
    color: "bg-brand-teal",
  },
  {
    num: "02",
    title: "Ατομική Συνεδρία με Ειδικό",
    desc: "Ο ειδικός μας σε ευθεία αλληλεπίδραση με τον μαθητή αναλύει τα αποτελέσματα, θέτει ερωτήσεις και διαμορφώνει το προφίλ του.",
    color: "bg-brand-orange",
  },
  {
    num: "03",
    title: "Χαρτογράφηση Σταδιοδρομίας",
    desc: "Παρουσίαση συγκεκριμένων πεδίων, σχολών και επαγγελμάτων που ταιριάζουν με το μοναδικό προφίλ του μαθητή.",
    color: "bg-brand-teal-dark",
  },
  {
    num: "04",
    title: "Συνάντηση με Γονείς",
    desc: "Ξεχωριστή ή κοινή συνεδρία με τους γονείς για να κατανοήσουν τα συμπεράσματα και να συζητήσουν στρατηγική.",
    color: "bg-gray-900",
  },
  {
    num: "05",
    title: "Γραπτή Έκθεση & Πλάνο Δράσης",
    desc: "Κάθε οικογένεια παίρνει λεπτομερή γραπτή έκθεση με πλάνο δράσης για τα επόμενα βήματα.",
    color: "bg-brand-orange",
  },
];

const FOR_WHOM = [
  {
    icon: GraduationCap,
    title: "Μαθητές Γ' Λυκείου",
    desc: "Που αντιμετωπίζουν τον μεγαλύτερο αγώνα της ζωής τους και χρειάζονται σαφή κατεύθυνση για τα μηχανογραφικά.",
    tag: "Υψηλή Προτεραιότητα",
    tagColor: "bg-brand-orange",
  },
  {
    icon: BookOpen,
    title: "Μαθητές Β' Λυκείου",
    desc: "Που θέλουν να επιλέξουν τη σωστή ομάδα προσανατολισμού (Θεωρητική, Θετικής, Τεχνολογική, ΟΕΦΕ) με επίγνωση.",
    tag: "Στρατηγικός",
    tagColor: "bg-brand-teal",
  },
  {
    icon: Brain,
    title: "Μαθητές Α' Λυκείου",
    desc: "Που θέλουν να ξεκινήσουν το λύκειο με πυξίδα — γνωρίζοντας ποιον στόχο κυνηγούν.",
    tag: "Πρώιμος Σχεδιασμός",
    tagColor: "bg-gray-700",
  },
  {
    icon: Users,
    title: "Γονείς",
    desc: "Που θέλουν να κατανοήσουν το τοπίο των σχολών και να υποστηρίξουν σωστά το παιδί τους χωρίς πίεση.",
    tag: "Γονεϊκή Υποστήριξη",
    tagColor: "bg-brand-teal-dark",
  },
];

const WHY_ITEMS = [
  {
    icon: Target,
    title: "Αποφυγή Λάθους Επιλογής",
    desc: "Ένα λάθος μηχανογραφικό μπορεί να κοστίσει χρόνια. Ο σωστός προσανατολισμός αποτρέπει την εγκατάλειψη σχολής.",
  },
  {
    icon: Compass,
    title: "Ανακάλυψη Κρυμμένων Ταλέντων",
    desc: "Πολλοί μαθητές αγνοούν τα πραγματικά τους δυνατά σημεία. Η αξιολόγησή μας τα φέρνει στην επιφάνεια.",
  },
  {
    icon: Star,
    title: "Εξειδικευμένος Επαγγελματίας",
    desc: "Ο ειδικός μας είναι πιστοποιημένος σύμβουλος σταδιοδρομίας με εμπειρία σε εκατοντάδες νέους.",
  },
  {
    icon: HeartHandshake,
    title: "Ολιστική Προσέγγιση",
    desc: "Λαμβάνουμε υπόψη τόσο τις ακαδημαϊκές επιδόσεις όσο και την προσωπικότητα, τις αξίες και τα όνειρα.",
  },
];

const FAQS = [
  {
    q: "Πόσο διαρκεί μια συνεδρία;",
    a: "Μια ατομική συνεδρία διαρκεί 60–90 λεπτά. Αν ζητηθεί και γονεϊκή συνάντηση, προσθέτουμε επιπλέον 45 λεπτά.",
  },
  {
    q: "Πότε γίνεται η ετήσια επίσκεψη του ειδικού;",
    a: "Κάθε χρόνο, συνήθως τον Νοέμβριο–Δεκέμβριο, φέρνουμε τον ειδικό στο χώρο μας για μαζικές συνεδρίες. Οι θέσεις είναι περιορισμένες.",
  },
  {
    q: "Πρέπει να είμαι μαθητής Μόρφωσης;",
    a: "Κατά προτεραιότητα, οι θέσεις δίνονται στους μαθητές μας. Εφόσον υπάρχουν κενές θέσεις, δεχόμαστε και εξωτερικούς.",
  },
  {
    q: "Μπορούν να συμμετέχουν και οι γονείς;",
    a: "Ναι! Ενθαρρύνουμε τη συμμετοχή των γονέων — υπάρχει ειδικό τμήμα της συνεδρίας αφιερωμένο στην οικογένεια.",
  },
  {
    q: "Πώς μπορώ να κλείσω θέση;",
    a: "Μπορείς να επικοινωνήσεις μαζί μας τηλεφωνικά, μέσω email ή μέσω της φόρμας επικοινωνίας στο site μας.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ελένη Π.",
    role: "Μαθήτρια Γ' Λυκείου – τώρα φοιτήτρια ΟΠΑ",
    quote:
      "Δεν ήξερα αν ήθελα Νομική ή Οικονομικά. Μετά τη συνεδρία ένιωσα ότι επιτέλους «είδα» τον εαυτό μου ξεκάθαρα.",
  },
  {
    name: "Νίκος Θ.",
    role: "Γονέας μαθητή Β' Λυκείου",
    quote:
      "Ο γιος μου ήρθε σπίτι εντελώς διαφορετικός. Είχε σχέδιο, είχε στόχο. Αυτός ο προσανατολισμός άξιζε χρυσό.",
  },
  {
    name: "Μαρία Κ.",
    role: "Μαθήτρια Α' Λυκείου",
    quote:
      "Ξέρω τώρα γιατί σπουδάζω και ποιον στόχο έχω. Ήταν σαν να άναψε ένα φως.",
  },
];

// ─── ACCORDION COMPONENT ────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b-2 border-gray-200 ${open ? "border-brand-teal" : ""} transition-colors`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-black text-gray-900 text-base lg:text-lg group-hover:text-brand-teal transition-colors pr-4">
          <span className="text-brand-orange mr-3 font-black">{String(index + 1).padStart(2, "0")}.</span>
          {q}
        </span>
        <ChevronDown
          size={22}
          strokeWidth={3}
          className={`text-brand-teal flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-6" : "max-h-0"}`}
      >
        <p className="text-gray-600 font-bold leading-relaxed pl-8 border-l-4 border-brand-teal">{a}</p>
      </div>
    </div>
  );
}

// ─── PAGE COMPONENT ─────────────────────────────────────────────────────────

export default function ProsanatolismosPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden selection:bg-brand-teal selection:text-white">

      {/* ══════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[92vh] flex items-center bg-gray-950 overflow-hidden">
        {/* Animated grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#0c82a2 1px, transparent 1px), linear-gradient(to right, #0c82a2 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Orange accent bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-orange" />

        {/* Huge background text */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full pointer-events-none overflow-hidden">
          <span className="text-[20vw] font-black text-white/[0.03] whitespace-nowrap select-none tracking-tighter uppercase block">
            ΠΡΟΣΑΝΑΤΟΛΙΣΜΟΣ
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-black text-xs uppercase tracking-[0.2em] px-4 py-2 mb-8">
              <CalendarCheck size={14} />
              Κάθε Χρόνο
            </div>
            <h1 className="text-5xl lg:text-7xl xl:text-[80px] font-black text-white leading-[0.95] tracking-tighter mb-8 uppercase">
              Ακαδημαϊκός<br />
              <span className="text-brand-orange">Προσανατολισμός</span>
            </h1>
            <p className="text-gray-300 font-bold text-lg lg:text-xl leading-relaxed max-w-lg mb-10">
              Κάθε χρόνο φέρνουμε στη Μόρφωση εξειδικευμένο σύμβουλο σταδιοδρομίας. Μαθητές και γονείς ανακαλύπτουν μαζί τον σωστό δρόμο.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-brand-orange text-white px-10 py-5 font-black text-sm uppercase tracking-widest border-4 border-transparent hover:border-white shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.7)] hover:-translate-y-1 transition-all"
              >
                ΚΛΕΙΣΕ ΘΕΣΗ ΤΩΡΑ
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <a
                href="#process"
                className="inline-flex items-center gap-3 border-4 border-white/20 text-white px-10 py-5 font-black text-sm uppercase tracking-widest hover:border-brand-teal hover:text-brand-teal transition-colors"
              >
                ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ
              </a>
            </div>
          </div>

          {/* Stats card */}
          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 shadow-2xl lg:translate-x-16 xl:translate-x-24">
            {[
              { val: "100%", label: "Εξατομικευμένη\nΠροσέγγιση" },
              { val: "1Ο1", label: "Ατομικές\nΣυνεδρίες" },
              { val: "3 ώρες", label: "Διάρκεια\nΔιαδικασίας" },
              { val: "1/χρόνο", label: "Αποκλειστική\nΕπίσκεψη" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-900 p-8 flex flex-col gap-2 group hover:bg-brand-teal transition-colors">
                <span className="text-4xl font-black text-brand-orange group-hover:text-white transition-colors tracking-tighter">
                  {s.val}
                </span>
                <span className="text-xs font-black text-gray-400 group-hover:text-white/80 uppercase tracking-widest leading-tight whitespace-pre-line transition-colors">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. THE ANNUAL EVENT BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-brand-teal py-16 border-t-[6px] border-brand-orange">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
              <CalendarCheck size={30} className="text-brand-teal" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-white/70 font-black text-xs uppercase tracking-widest mb-1">Ετήσια Εκδήλωση</div>
              <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight uppercase">
                Κάθε χρόνο φέρνουμε<br />
                <span className="text-brand-orange">πιστοποιημένο ειδικό</span> στο χώρο μας
              </h2>
            </div>
          </div>
          <div className="text-white/80 font-bold max-w-md text-base leading-relaxed">
            Δεν αρκούμαστε στις γενικές συμβουλές. Κάθε χρόνο, σε συγκεκριμένη ημερομηνία, ένας πιστοποιημένος σύμβουλος σταδιοδρομίας έρχεται στη Μόρφωση και συναντά μαθητές και γονείς πρόσωπο με πρόσωπο.
          </div>
          <Link
            href="/contact"
            className="bg-white text-brand-teal px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-brand-teal-dark hover:bg-brand-orange hover:text-white hover:border-brand-orange flex-shrink-0 transition-colors shadow-lg"
          >
            ΔΗΛΩΣΕ ΣΥΜΜΕΤΟΧΗ
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. FOR WHOM
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-28 border-b-4 border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-4">Για ποιους είναι</div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-tight">
              Ο ΣΩΣΤΟΣ ΔΡΟΜΟΣ<br />
              <span className="text-brand-orange">ΓΙΑ ΟΛΟΥΣ</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t-4 border-l-4 border-gray-900">
            {FOR_WHOM.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="border-r-4 border-b-4 border-gray-900 p-8 flex flex-col gap-6 group hover:bg-gray-950 transition-colors cursor-default"
                >
                  <div>
                    <div
                      className={`${item.tagColor} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 w-max mb-4`}
                    >
                      {item.tag}
                    </div>
                    <div className="w-12 h-12 bg-gray-100 group-hover:bg-white/10 flex items-center justify-center mb-4 transition-colors">
                      <Icon size={24} className="text-brand-teal group-hover:text-brand-orange transition-colors" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 group-hover:text-white text-lg uppercase tracking-tight leading-tight mb-3 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 group-hover:text-gray-300 font-bold text-sm leading-relaxed transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. WHY IT MATTERS
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-gray-950 py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-4">Γιατί έχει σημασία</div>
              <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
                Μια ΣΩΣΤΗ<br />
                ΑΠΟΦΑΣΗ<br />
                <span className="text-brand-teal">ΑΛΛΑΖΕΙ ΤΑ ΠΑΝΤΑ</span>
              </h2>
              <p className="text-gray-400 font-bold text-lg leading-relaxed mb-8">
                Πολλοί φοιτητές αλλάζουν ή εγκαταλείπουν τη σχολή τους στα πρώτα χρόνια. Μια συχνή αιτία; Λανθασμένη επιλογή κατεύθυνσης. Ο σωστός προσανατολισμός δεν είναι πολυτέλεια — είναι επένδυση στο μέλλον.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-brand-orange text-white px-10 py-5 font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg"
              >
                ΚΛΕΙΣΕ ΡΑΝΤΕΒΟΥ
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-0">
              {WHY_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex gap-6 p-6 border-b border-white/10 group hover:bg-white/5 transition-colors"
                  >
                    <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange group-hover:border-brand-orange transition-colors">
                      <Icon size={22} className="text-brand-orange group-hover:text-white transition-colors" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base uppercase tracking-tight mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 font-bold text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. PROCESS
      ══════════════════════════════════════════════════════════════ */}
      <section id="process" className="w-full bg-white py-28 border-b-8 border-brand-teal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16 text-center">
            <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-4">Η Διαδικασία</div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 uppercase tracking-tighter">
              5 ΒΗΜΑΤΑ ΠΡΟΣ<br />
              <span className="text-brand-orange">ΤΗΝ ΑΠΑΝΤΗΣΗ</span>
            </h2>
          </div>

          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="flex flex-col lg:flex-row gap-0 border-b-4 border-gray-900 group hover:bg-gray-950 transition-colors"
              >
                {/* Number */}
                <div className={`${step.color} text-white w-full lg:w-24 flex items-center justify-center py-6 lg:py-0 flex-shrink-0`}>
                  <span className="text-4xl font-black tracking-tighter">{step.num}</span>
                </div>
                {/* Content */}
                <div className="flex-1 p-8 lg:p-10 border-l-0 lg:border-l-4 border-gray-900">
                  <h3 className="font-black text-gray-900 group-hover:text-white text-xl lg:text-2xl uppercase tracking-tight mb-3 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-300 font-bold leading-relaxed transition-colors">
                    {step.desc}
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden lg:flex items-center pr-10">
                  <ArrowRight size={28} strokeWidth={3} className="text-gray-200 group-hover:text-brand-orange transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-gray-50 py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-4">Λένε για εμάς</div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 uppercase tracking-tighter">
              ΤΙ ΕΙΠΑΝ<br />
              <span className="text-brand-teal">ΟΙ ΟΙΚΟΓΕΝΕΙΕΣ</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t-4 border-l-4 border-gray-900">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="border-r-4 border-b-4 border-gray-900 p-10 flex flex-col gap-6 bg-white group hover:bg-brand-teal transition-colors"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f97316" className="text-brand-orange group-hover:fill-white group-hover:text-white transition-colors" />
                  ))}
                </div>
                <p className="text-gray-700 group-hover:text-white font-bold text-base leading-relaxed italic transition-colors">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t-2 border-gray-100 group-hover:border-white/30 pt-4 transition-colors">
                  <div className="font-black text-gray-900 group-hover:text-white transition-colors">{t.name}</div>
                  <div className="text-xs text-gray-400 group-hover:text-white/70 font-bold uppercase tracking-widest transition-colors">
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. CHECKLIST — WHAT YOU GET
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-brand-teal py-24 border-t-[6px] border-brand-teal-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-white/70 font-black text-xs uppercase tracking-[0.3em] mb-4">Τι περιλαμβάνει</div>
              <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                Αυτό που<br />
                <span className="text-brand-orange">ΠΑΙΡΝΕΙΣ ΜΑΖΙ ΣΟΥ</span>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                "Αξιολόγηση Κλίσεων & Ενδιαφερόντων",
                "Ατομική Συνεδρία 1-on-1 με Ειδικό",
                "Πρόταση Σχολών & Κατευθύνσεων",
                "Ανάλυση Βάσεων & Πιθανοτήτων",
                "Ειδική Συνάντηση με Γονείς",
                "Γραπτό Πλάνο Δράσης",
                "Follow-up Τηλεφωνική Επαφή",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 bg-white/10 px-6 py-4 border border-white/20">
                  <CheckCircle2 size={20} className="text-brand-orange flex-shrink-0" strokeWidth={3} />
                  <span className="text-white font-black text-sm uppercase tracking-widest">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          8. FAQ
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="mb-16 text-center">
            <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-4">Συχνές Ερωτήσεις</div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter">
              ΣΥΧΝΕΣ <span className="text-brand-orange">ΕΡΩΤΗΣΕΙΣ</span>
            </h2>
          </div>
          <div>
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          9. FINAL CTA
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-gray-950 py-28 border-t-[6px] border-brand-orange relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-6">
            Μην χάσεις τον επόμενο κύκλο
          </div>
          <h2 className="text-5xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
            ΤΟ ΜΕΛΛΟΝ<br />
            <span className="text-brand-orange">ΣΕ ΠΕΡΙΜΕΝΕΙ</span>
          </h2>
          <p className="text-gray-400 font-bold text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Οι θέσεις για τον ετήσιο κύκλο ακαδημαϊκού προσανατολισμού είναι περιορισμένες. Κλείσε τη θέση σου έγκαιρα.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-brand-orange text-white px-14 py-6 font-black text-base uppercase tracking-widest border-4 border-transparent hover:border-white shadow-[0_0_60px_rgba(249,115,22,0.5)] hover:shadow-[0_0_80px_rgba(249,115,22,0.8)] hover:-translate-y-1 transition-all"
            >
              ΚΛΕΙΣΕ ΘΕΣΗ — ΔΩΡΕΑΝ
              <ArrowRight size={20} strokeWidth={3} />
            </Link>
            <a
              href="tel:2105063630"
              className="inline-flex items-center gap-3 border-4 border-white/20 text-white px-14 py-6 font-black text-base uppercase tracking-widest hover:border-brand-teal hover:text-brand-teal transition-colors"
            >
              <Phone size={18} strokeWidth={3} />
              21 0506 3630
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
