import { client } from "@/sanity/client";
import ContactForm from "@/components/ContactForm";
import EnrollmentForm from "@/components/EnrollmentForm";
import { FAQSchema, BreadcrumbSchema } from "@/components/SchemaOrg";
import {
  Phone, Mail, MapPin, Clock,
  GraduationCap, MessageSquare, UserPlus,
  ArrowRight, Star, CheckCircle, Sparkles, Users, Award, ChevronDown
} from "lucide-react";

export const metadata = {
  title: 'Επικοινωνία & Εγγραφές | Φροντιστήριο Μόρφωση',
  description: 'Επικοινωνήστε με το Φροντιστήριο Μόρφωση. Online αίτηση εγγραφής για μαθητές Γυμνασίου & Λυκείου. Βρείτε μας στον Άγιο Δημήτριο.',
};

const SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  contactEmail,
  contactPhone,
  address,
  socialMedia
}`;

const FAQ = [
  {
    q: "Πότε ξεκινούν τα μαθήματα;",
    a: "Τα τμήματα ξεκινούν στις αρχές Σεπτεμβρίου. Για εντατικά τμήματα Πανελλαδικών ξεκινάμε και από Ιανουάριο. Επικοινωνήστε μαζί μας για τρέχουσες ημερομηνίες.",
  },
  {
    q: "Πόσοι μαθητές υπάρχουν σε κάθε τμήμα?",
    a: "Τηρούμε μικρά τμήματα έως 7 μαθητών ώστε κάθε παιδί να λαμβάνει εξατομικευμένη προσοχή. Δεν κάνουμε εκπτώσεις στην ποιότητα.",
  },
  {
    q: "Πώς μπορώ να κάνω την εγγραφή μου;",
    a: "Η διαδικασία είναι απλή: Μπορείτε να συμπληρώσετε την online φόρμα εγγραφής, να μας καλέσετε στο τηλέφωνο ή να επισκεφθείτε το χώρο μας για μια συνάντηση γνωριμίας και ενημέρωσης."
  },
  {
    q: "Μπορώ να εγγραφώ μέσα στη χρονιά;",
    a: "Δεχόμαστε εγγραφές καθ' όλη τη διάρκεια του σχολικού έτους, εφόσον υπάρχει διαθέσιμη θέση στο αντίστοιχο τμήμα.",
  },
  {
    q: "Πώς γίνεται η αξιολόγηση της προόδου;",
    a: "Κάθε μήνα πραγματοποιούμε γραπτά διαγνωστικά tests και ενημερώνουμε τους γονείς. Για μαθητές Γ΄ Λυκείου, εβδομαδιαία αξιολόγηση.",
  },
  {
    q: "Ποιο είναι το κόστος φοίτησης;",
    a: "Τα δίδακτρα εξαρτώνται από τον αριθμό μαθημάτων και την τάξη. Επικοινωνήστε μαζί μας για αναλυτική προσφορά βάσει των αναγκών σας.",
  },
];

// Hours config
const HOURS = [
  { day: "Δευτέρα – Παρασκευή", time: "15:00 – 21:30" },
  { day: "Σάββατο", time: "09:00 – 15:00" },
  { day: "Κυριακή", time: "Κλειστά" },
];

// Why choose section
const WHY_ITEMS = [
  { icon: <Users size={28} />, title: "Μικρά Τμήματα", desc: "Έως 7 μαθητές ανά τμήμα για εξατομικευμένη διδασκαλία", color: "bg-brand-teal" },
  { icon: <Award size={28} />, title: "Εβδομαδιαία Αξιολόγηση", desc: "Τακτικά διαγωνίσματα και ενημέρωση γονέων για την πρόοδο", color: "bg-brand-orange" },
  { icon: <Star size={28} />, title: "Κορυφαίοι Καθηγητές", desc: "Επιλεγμένοι εκπαιδευτικοί με αποδεδειγμένα αποτελέσματα", color: "bg-brand-green" },
  { icon: <CheckCircle size={28} />, title: "Άμεση Εγγραφή", desc: "Διαδικασία εξπρές για να ξεκινήσετε αμέσως.", color: "bg-brand-purple" },
];

export default async function ContactPage() {
  let settings: any = null;
  try {
    settings = await client.fetch(SETTINGS_QUERY);
  } catch (e) { /* fallback */ }

  const phone    = settings?.contactPhone || "2105063610";
  const email    = settings?.contactEmail || "chronakesm@gmail.com";
  const address  = settings?.address      || "25ης Μαρτίου 84, Άγιος Δημήτριος";
  const facebook = settings?.socialMedia?.facebook;
  const instagram= settings?.socialMedia?.instagram;
  const youtube  = settings?.socialMedia?.youtube;

  // Permanent Google Maps link using Place ID (never breaks)
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJ2dY8P6WjoRQRkE-VfXoIcO8";

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-teal selection:text-white overflow-x-hidden">
      <FAQSchema faqs={FAQ} />
      <BreadcrumbSchema items={[
        { name: "Αρχική", url: "https://morfosi.edu.gr" },
        { name: "Επικοινωνία", url: "https://morfosi.edu.gr/contact" },
      ]} />

      {/* ═══════════════════════════════════════════════════════════
          HERO — Dark brutalist header
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#031516] overflow-hidden pt-48 pb-36">
        {/* Rainbow top bar */}
        <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-r from-brand-teal via-brand-orange to-brand-green" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #f58220 1px, transparent 1px)', backgroundSize: '55px 55px' }}
          aria-hidden="true"
        />

        {/* Giant BG text */}
        <span
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[14vw] font-black text-white/[0.025] whitespace-nowrap select-none pointer-events-none uppercase tracking-widest"
          aria-hidden="true"
        >
          ΕΠΙΚΟΙΝΩΝΙΑ
        </span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-16">

            {/* Left: Title */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 bg-brand-orange border-4 border-white/20 px-6 py-3 mb-10">
                <MessageSquare className="text-white" size={20} strokeWidth={3} />
                <span className="text-white font-black text-xs uppercase tracking-[0.3em]">Είμαστε εδώ για εσάς</span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
                <span className="text-white">ΕΠΙΚΟΙ</span><span className="text-brand-orange">ΝΩΝΙΑ</span><br />
                <span className="text-brand-teal">&</span><br />
                <span className="text-white/60">ΕΓΓΡΑΦΕΣ</span>
              </h1>

              <p className="text-gray-300 font-bold text-xl max-w-2xl leading-relaxed border-l-[6px] border-brand-teal pl-6">
                Ένα βήμα χωρίζει το παιδί σας από την καλύτερη εκπαίδευση. Επικοινωνήστε μαζί μας σήμερα — γρήγορα, εύκολα, χωρίς υποχρεώσεις.
              </p>
            </div>

            {/* Right: Quick contact cards */}
            <div className="flex flex-col gap-0 border-[4px] border-white/20 shadow-[12px_12px_0px_rgba(245,130,32,0.3)] flex-shrink-0 min-w-[260px]">
              {/* Phone */}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                id="hero-phone-link"
                className="flex items-center gap-4 bg-brand-teal hover:bg-brand-teal-dark transition-colors px-8 py-6 border-b-[4px] border-white/20 group"
              >
                <Phone size={24} className="text-white flex-shrink-0" strokeWidth={2} />
                <div>
                  <div className="text-white/70 font-black text-[9px] uppercase tracking-widest">Τηλέφωνο</div>
                  <div className="text-white font-black text-xl tracking-tight">{phone}</div>
                </div>
              </a>
              {/* Email */}
              <a
                href={`mailto:${email}`}
                id="hero-email-link"
                className="flex items-center gap-4 bg-brand-orange hover:bg-brand-orange/80 transition-colors px-8 py-6 border-b-[4px] border-white/20 group"
              >
                <Mail size={24} className="text-white flex-shrink-0" strokeWidth={2} />
                <div>
                  <div className="text-white/70 font-black text-[9px] uppercase tracking-widest">Email</div>
                  <div className="text-white font-black text-sm tracking-tight break-all">{email}</div>
                </div>
              </a>
              {/* Address */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-maps-link"
                className="flex items-center gap-4 bg-[#052a2d] hover:bg-[#073e43] transition-colors px-8 py-6 group"
              >
                <MapPin size={24} className="text-brand-teal flex-shrink-0" strokeWidth={2} />
                <div>
                  <div className="text-white/70 font-black text-[9px] uppercase tracking-widest">Διεύθυνση</div>
                  <div className="text-white font-bold text-sm leading-snug">{address}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHY US — 4 reasons strip
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b-[8px] border-brand-teal">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-x-0">
            {WHY_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`${item.color} p-10 border-r-[4px] last:border-r-0 border-black group hover:scale-105 transition-transform duration-300 relative overflow-hidden`}
              >
                <div className="absolute -top-2 -right-2 text-[6rem] font-black text-black/10 leading-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-white mb-5 relative z-10">{item.icon}</div>
                <div className="text-white font-black text-lg uppercase tracking-tight mb-3 relative z-10">{item.title}</div>
                <div className="text-white/85 font-bold text-sm leading-relaxed relative z-10">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MAIN: TWO-COLUMN LAYOUT
          Left: Tab toggle Contact|Enroll + Forms
          Right: Info panel + Map
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-16">

            {/* ──────────── LEFT COL: Forms ──────────── */}
            <div className="xl:col-span-3">
              {/* Tab-like section headers */}
              <div className="flex gap-0 mb-0 border-[4px] border-black shadow-[6px_6px_0px_#031516]">
                <a
                  href="#contact-form"
                  id="tab-contact"
                  className="flex-1 flex items-center justify-center gap-3 py-5 bg-brand-teal text-white font-black uppercase tracking-widest text-sm border-r-[4px] border-black"
                >
                  <MessageSquare size={18} strokeWidth={2.5} />
                  Επικοινωνία
                </a>
                <a
                  href="#enrollment-form"
                  id="tab-enroll"
                  className="flex-1 flex items-center justify-center gap-3 py-5 bg-brand-orange text-white font-black uppercase tracking-widest text-sm"
                >
                  <UserPlus size={18} strokeWidth={2.5} />
                  Εγγραφή
                </a>
              </div>

              {/* Contact form */}
              <div id="contact-form" className="mt-12 scroll-mt-40">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-brand-teal border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
                    <MessageSquare size={22} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em]">Φόρμα</div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Στείλτε μήνυμα</h2>
                  </div>
                </div>
                <ContactForm contactEmail={email} />
              </div>

              {/* Divider */}
              <div className="my-16 flex items-center gap-6">
                <div className="flex-1 h-[4px] bg-brand-orange" />
                <span className="font-black text-gray-400 text-xs uppercase tracking-widest flex-shrink-0">ή</span>
                <div className="flex-1 h-[4px] bg-brand-teal" />
              </div>

              {/* Enrollment form */}
              <div id="enrollment-form" className="scroll-mt-40">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-brand-orange border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
                    <UserPlus size={22} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em]">Online Αίτηση</div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Εγγραφή Μαθητή</h2>
                  </div>
                </div>
                <p className="text-gray-500 font-bold mb-8 leading-relaxed">
                  Συμπληρώστε την παρακάτω φόρμα και θα επικοινωνήσουμε μαζί σας εντός 24 ωρών για να συζητήσουμε τις ανάγκες σας.
                </p>
                <EnrollmentForm />
              </div>
            </div>

            {/* ──────────── RIGHT COL: Info ──────────── */}
            <div className="xl:col-span-2 flex flex-col gap-10">

              {/* Hours card */}
              <div className="border-[4px] border-black shadow-[8px_8px_0px_#0c82a2] overflow-hidden">
                <div className="bg-brand-teal px-6 py-5 flex items-center gap-3">
                  <Clock size={20} className="text-white" />
                  <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Ώρες Λειτουργίας</span>
                </div>
                <div className="bg-white divide-y-[3px] divide-black">
                  {HOURS.map((h, i) => (
                    <div key={i} className={`flex justify-between items-center px-6 py-5 ${h.time === "Κλειστά" ? "opacity-50" : ""}`}>
                      <span className="font-black text-gray-900 text-sm uppercase tracking-tight">{h.day}</span>
                      <span className={`font-black text-sm ${h.time === "Κλειστά" ? "text-gray-400" : "text-brand-teal"}`}>
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-brand-orange/10 border-t-[3px] border-black px-6 py-4">
                  <p className="text-gray-700 font-bold text-xs leading-relaxed">
                    📞 Για επείγουσες επικοινωνίες εκτός ωρών: <span className="font-black">{phone}</span>
                  </p>
                </div>
              </div>

              {/* Contact details card */}
              <div className="border-[4px] border-black shadow-[8px_8px_0px_#f58220] overflow-hidden">
                <div className="bg-brand-orange px-6 py-5 flex items-center gap-3">
                  <Phone size={20} className="text-white" />
                  <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Στοιχεία Επικοινωνίας</span>
                </div>
                <div className="bg-white">
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-5 px-6 py-5 border-b-[3px] border-black hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-brand-teal flex items-center justify-center flex-shrink-0 border-2 border-black group-hover:scale-110 transition-transform">
                      <Phone size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Τηλέφωνο</div>
                      <div className="font-black text-lg text-gray-900 tracking-tight">{phone}</div>
                    </div>
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-5 px-6 py-5 border-b-[3px] border-black hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-brand-orange flex items-center justify-center flex-shrink-0 border-2 border-black group-hover:scale-110 transition-transform">
                      <Mail size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email</div>
                      <div className="font-black text-sm text-gray-900 tracking-tight break-all">{email}</div>
                    </div>
                  </a>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-5 px-6 py-5 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-brand-green flex items-center justify-center flex-shrink-0 border-2 border-black group-hover:scale-110 transition-transform">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Διεύθυνση</div>
                      <div className="font-black text-sm text-gray-900 leading-snug">{address}</div>
                      <div className="text-brand-teal font-black text-[10px] uppercase tracking-widest mt-1">→ Χάρτης Google</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media card */}
              {(facebook || instagram || youtube) && (
                <div className="border-[4px] border-black shadow-[8px_8px_0px_#8e4585] overflow-hidden">
                  <div className="bg-brand-purple px-6 py-5 flex items-center gap-3">
                    <Sparkles size={20} className="text-white" />
                    <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Social Media</span>
                  </div>
                  <div className="bg-white flex flex-col gap-0 divide-y-[3px] divide-black">
                    {facebook && (
                      <a
                        href={facebook}
                        id="social-facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-[#1877F2] flex items-center justify-center flex-shrink-0 border-2 border-black group-hover:scale-110 transition-transform">
                          <svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </div>
                        <span className="font-black text-gray-900 text-sm uppercase tracking-tight">Facebook</span>
                        <ArrowRight size={14} className="ml-auto text-gray-400 group-hover:text-brand-purple transition-colors" />
                      </a>
                    )}
                    {instagram && (
                      <a
                        href={instagram}
                        id="social-instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4] flex items-center justify-center flex-shrink-0 border-2 border-black group-hover:scale-110 transition-transform">
                          <svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </div>
                        <span className="font-black text-gray-900 text-sm uppercase tracking-tight">Instagram</span>
                        <ArrowRight size={14} className="ml-auto text-gray-400 group-hover:text-brand-purple transition-colors" />
                      </a>
                    )}
                    {youtube && (
                      <a
                        href={youtube}
                        id="social-youtube"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-[#FF0000] flex items-center justify-center flex-shrink-0 border-2 border-black group-hover:scale-110 transition-transform">
                          <svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </div>
                        <span className="font-black text-gray-900 text-sm uppercase tracking-tight">YouTube</span>
                        <ArrowRight size={14} className="ml-auto text-gray-400 group-hover:text-brand-purple transition-colors" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Call to action direct call */}
              <div className="bg-[#031516] border-[4px] border-brand-teal shadow-[8px_8px_0px_#0c82a2] p-8">
                <GraduationCap size={36} className="text-brand-orange mb-4" strokeWidth={1.5} />
                <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-3">Άμεση Εξυπηρέτηση</div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tight leading-tight mb-4">
                  Προτιμάτε να<br />μιλήσουμε;
                </h3>
                <p className="text-gray-400 font-bold text-sm leading-relaxed mb-6">
                  Καλέστε μας τώρα και ένας από τους συμβούλους μας θα απαντήσει στις ερωτήσεις σας.
                </p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  id="sidebar-call-cta"
                  className="flex items-center gap-3 bg-brand-teal text-white font-black text-sm uppercase tracking-widest px-6 py-4 border-2 border-brand-teal hover:bg-brand-orange hover:border-brand-orange transition-colors w-full justify-center"
                >
                  <Phone size={16} strokeWidth={2.5} />
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MAP SECTION — Google Maps embed
      ═══════════════════════════════════════════════════════════ */}
      <section id="map" className="bg-white border-t-[8px] border-brand-orange scroll-mt-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            {/* Label */}
            <div className="flex-shrink-0 lg:w-72">
              <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <MapPin size={16} /> Βρείτε μας
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight mb-6">
                ΕΙΜΑΣΤΕ<br />
                <span className="text-brand-teal">ΕΔΩ</span>
              </h2>
              <div className="bg-gray-100 border-[4px] border-black p-6 mb-6">
                <p className="font-black text-gray-900 text-sm leading-relaxed">{address}</p>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="map-directions-btn"
                className="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-black shadow-[5px_5px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                <MapPin size={16} strokeWidth={3} />
                ΟΔΗΓΙΕΣ
              </a>
            </div>

            {/* Map iframe */}
            <div className="flex-1 border-[6px] border-black shadow-[12px_12px_0px_#031516] overflow-hidden min-h-[400px] lg:min-h-[500px]">
              <iframe
                title="Χάρτης Φροντιστηρίου Μόρφωση"
                width="100%"
                height="100%"
                style={{ minHeight: "480px", display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent("25ης Μαρτίου 84, Αγίου Δημητρίου 17, Πετρούπολη 132 31")}&t=m&z=18&ie=UTF8&iwloc=near&output=embed`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-28 border-t-[8px] border-brand-teal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left: Title */}
            <div className="lg:col-span-1">
              <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <MessageSquare size={16} /> Συχνές Ερωτήσεις
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-tight mb-8">
                ΑΠΟΡΙ<span className="text-brand-orange">ΕΣ;</span>
              </h2>
              <p className="text-gray-500 font-bold leading-relaxed mb-10">
                Αν δεν βρείτε απάντηση εδώ, στείλτε μας μήνυμα ή καλέστε μας άμεσα.
              </p>
              <a
                href="#contact-form"
                className="inline-flex items-center gap-3 bg-brand-teal text-white px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-black shadow-[5px_5px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                ΡΩΤΗΣΤΕ ΜΑΣ
                <ArrowRight size={16} strokeWidth={3} />
              </a>
            </div>

            {/* Right: FAQ list */}
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-0 border-[4px] border-black shadow-[10px_10px_0px_#000]">
                {FAQ.map((item, i) => {
                  const colors = [
                    "border-brand-teal", "border-brand-orange", "border-brand-green",
                    "border-brand-purple", "border-brand-red", "border-brand-teal-dark"
                  ];
                  const numColors = ["bg-brand-teal", "bg-brand-orange", "bg-brand-green", "bg-brand-purple", "bg-brand-red", "bg-brand-teal-dark"];
                  return (
                    <details
                      key={i}
                      className={`group border-b-[4px] last:border-b-0 ${colors[i % colors.length]} border-b-black bg-white`}
                    >
                      <summary className="flex items-center gap-5 px-6 py-5 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
                        <div className={`${numColors[i % numColors.length]} text-white font-black text-xs w-8 h-8 flex items-center justify-center flex-shrink-0 border-2 border-black`}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <span className="font-black text-gray-900 text-base leading-snug flex-1 uppercase tracking-tight">
                          {item.q}
                        </span>
                        <ChevronDown size={20} className="flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className={`px-6 pb-6 pt-2 border-t-[3px] border-black bg-gray-50`}>
                        <div className={`border-l-[5px] ${colors[i % colors.length]} pl-5`}>
                          <p className="text-gray-700 font-bold leading-relaxed">{item.a}</p>
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-teal py-24 border-t-[8px] border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div>
              <div className="text-white/70 font-black text-xs uppercase tracking-[0.3em] mb-4">
                Ξεκινήστε Σήμερα — Χωρίς Καθυστέρηση
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
                ΚΑΝΕ ΤΗΝ <span className="text-brand-orange border-b-4 border-brand-orange">ΕΓΓΡΑΦΗ</span> ΣΟΥ ΤΩΡΑ
              </h2>
              <p className="text-white/80 font-bold text-lg mt-4 max-w-xl leading-relaxed">
                Ξεκινήστε σήμερα την προετοιμασία σας. Εξασφαλίστε τη θέση σας στα ολιγομελή τμήματά μας και κάντε το πρώτο βήμα για την επιτυχία.
              </p>
            </div>
            <div className="flex flex-col gap-4 flex-shrink-0">
              <a
                href="#enrollment-form"
                id="final-enroll-cta"
                className="inline-flex items-center gap-3 bg-brand-orange text-white px-12 py-6 font-black uppercase tracking-widest text-base border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[6px] hover:translate-y-[6px] transition-all"
              >
                <UserPlus size={22} strokeWidth={2.5} />
                ΑΙΤΗΣΗ ΕΓΓΡΑΦΗΣ
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                id="final-call-cta"
                className="inline-flex items-center gap-3 bg-white text-brand-teal px-12 py-6 font-black uppercase tracking-widest text-base border-4 border-black shadow-[8px_8px_0px_#031516] hover:shadow-[2px_2px_0px_#031516] hover:translate-x-[6px] hover:translate-y-[6px] transition-all"
              >
                <Phone size={22} strokeWidth={2.5} />
                {phone}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
