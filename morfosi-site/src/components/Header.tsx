"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Menu,
  X,
  Calculator,
  BookOpen,
  GraduationCap,
  FileText,
  Users,
  Phone,
  MapPin,
  ChevronRight,
  FlaskConical,
  Sigma,
  Globe,
  Pencil,
  Star,
  Newspaper,
  Target,
  CalendarDays,
  Info,
  Mail,
} from "lucide-react";

// ─────────────────────────────────────────────
//  DYNAMIC YEAR LOGIC
// ─────────────────────────────────────────────
const now = new Date();
const currentYear = now.getFullYear(); // 2026
const nextYear = currentYear + 1; // 2027
const academicYear = `${currentYear}-${nextYear}`; // 2026-2027
const academicYearShort = `${currentYear}-${nextYear.toString().slice(-2)}`; // 2026-27

// ─────────────────────────────────────────────
//  TYPE DEFINITIONS
// ─────────────────────────────────────────────
interface SubItem {
  href: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavItem {
  id: string;
  label: string;
  href?: string;
  children?: SubItem[];
  featured?: {
    title: string;
    description: string;
    cta: string;
    href: string;
    color: string;
  };
}

// ─────────────────────────────────────────────
//  NAV DATA  (προσαρμοσμένο για μικρό φροντιστήριο)
// ─────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    id: "plano",
    label: "ΠΛΑΝΟ ΣΠΟΥΔΩΝ",
    children: [
      {
        href: "/plano",
        label: "Το Πλάνο μας",
        description: "Μεθοδολογία & πρόγραμμα σπουδών ανά βαθμίδα",
        icon: <GraduationCap size={20} strokeWidth={2.5} />,
        badge: "ΝΕΟ",
      },
      {
        href: "/plano?level=gymnasio",
        label: "Γυμνάσιο",
        description: "Α΄, Β΄, Γ΄ Γυμνασίου — πλάνο & μαθήματα",
        icon: <BookOpen size={20} strokeWidth={2.5} />,
      },
      {
        href: "/plano?level=lykeio",
        label: "Λύκειο",
        description: "Α΄, Β΄, Γ΄ Λυκείου — πανελλήνιες & μόρια",
        icon: <GraduationCap size={20} strokeWidth={2.5} />,
      },
      {
        href: "/prosanatolismos",
        label: "Προσανατολισμός",
        description: "Τεστ & προσωπικές συνεντεύξεις",
        icon: <Target size={20} strokeWidth={2.5} />,
      },
    ],
    featured: {
      title: "Το Πλάνο μας",
      description: "Δες αναλυτικά πώς δουλεύουμε σε κάθε εκπαιδευτική βαθμίδα, από το Γυμνάσιο μέχρι τις Πανελλήνιες.",
      cta: "ΔΕΣ ΤΟ ΠΛΑΝΟ",
      href: "/plano",
      color: "bg-brand-teal-dark",
    },
  },
  {
    id: "mathimata",
    label: "ΜΑΘΗΜΑΤΑ",
    children: [
      {
        href: "/plano?level=lykeio#thetikes",
        label: "Θετικές Σπουδές",
        description: "Μαθηματικά, Φυσική, Χημεία, Βιολογία",
        icon: <Sigma size={20} strokeWidth={2.5} />,
      },
      {
        href: "/plano?level=lykeio#anthropistikes",
        label: "Ανθρωπιστικές Σπουδές",
        description: "Έκθεση, Ιστορία, Λογοτεχνία, Λατινικά",
        icon: <Pencil size={20} strokeWidth={2.5} />,
      },
      {
        href: "/plano?level=lykeio#ygeias",
        label: "Σπουδές Υγείας",
        description: "Βιολογία, Χημεία, Φυσική",
        icon: <FlaskConical size={20} strokeWidth={2.5} />,
      },
      {
        href: "/plano?level=lykeio#oikonomias",
        label: "Οικονομίας & Πληροφορικής",
        description: "Μαθηματικά, ΑΟΔΕ, Πληροφορική",
        icon: <Globe size={20} strokeWidth={2.5} />,
      },
    ],
    featured: {
      title: "Εγγράψου τώρα",
      description:
        "Οι εγγραφές για τη νέα σχολική χρονιά είναι ανοιχτές. Μη χάσεις τη θέση σου!",
      cta: "ΔΩΡΕΑΝ ΑΞΙΟΛΟΓΗΣΗ",
      href: "/contact#enrollment-form",
      color: "bg-brand-orange",
    },
  },
  {
    id: "panhellinia",
    label: "ΠΑΝΕΛΛΗΝΙΕΣ",
    children: [
      {
        href: "/exams",
        label: "Παλιά Θέματα & Διαγωνίσματα",
        description: `Αναλυτικός οδηγός Πανελληνίων ${currentYear}`,
        icon: <FileText size={20} strokeWidth={2.5} />,
      },
      {
        href: "/schedule-exams",
        label: "Πρόγραμμα Εξετάσεων",
        description: "Ημερομηνίες & Παρατηρήσεις",
        icon: <CalendarDays size={20} strokeWidth={2.5} />,
      },
      {
        href: "/calculator",
        label: "Υπολογισμός Μορίων",
        description: "Δες πού μπαίνεις τώρα!",
        icon: <Calculator size={20} strokeWidth={2.5} />,
        badge: "ΔΩΡΕΑΝ",
      },
    ],
    featured: {
      title: "Υπολογιστής Μορίων",
      description:
        "Το πιο εξελιγμένο εργαλείο. Σύγκρινε τα μόριά σου με τις βάσεις εισαγωγής.",
      cta: "ΧΡΗΣΙΜΟΠΟΙΗΣΕ ΤΟ",
      href: "/calculator",
      color: "bg-brand-teal",
    },
  },
  {
    id: "bibliothiki",
    label: "ΒΙΒΛΙΟΘΗΚΗ",
    children: [
      {
        href: "/books",
        label: "Εκδόσεις Μόρφωσης",
        description: "Τα δικά μας συγγράμματα & σημειώσεις",
        icon: <BookOpen size={20} strokeWidth={2.5} />,
      },
      {
        href: "/books",
        label: "Δωρεάν Υλικό",
        description: "PDFs, Διαγωνίσματα & Ασκήσεις",
        icon: <GraduationCap size={20} strokeWidth={2.5} />,
      },
    ],
    featured: {
      title: "Νέες Εκδόσεις",
      description:
        "Κατέβασε δωρεάν δείγματα των συγγραμμάτων μας για όλα τα μαθήματα.",
      cta: "ΔΕΣ ΤΑ ΒΙΒΛΙΑ",
      href: "/books",
      color: "bg-brand-teal-dark",
    },
  },
  {
    id: "neo",
    label: "ΝΕΑ",
    children: [
      {
        href: "/news",
        label: "Ανακοινώσεις",
        description: "Νέα & ενημερώσεις από το φροντιστήριο",
        icon: <Newspaper size={20} strokeWidth={2.5} />,
      },
      {
        href: "/#testimonials",
        label: "Επιτυχίες Μαθητών",
        description: "Σπουδαστές που μπήκαν στη σχολή τους",
        icon: <Star size={20} strokeWidth={2.5} />,
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featured: null as any,
  },
  {
    id: "morfosi",
    label: "ΜΟΡΦΩΣΗ",
    children: [
      {
        href: "/epityxontes",
        label: "Επιτυχόντες",
        description: "Οι επιτυχίες των μαθητών μας",
        icon: <Star size={20} strokeWidth={2.5} />,
      },
      {
        href: "/about",
        label: "Σχετικά με Εμάς",
        description: "Ιστορία, αξίες & ομάδα του φροντιστηρίου",
        icon: <Info size={20} strokeWidth={2.5} />,
      },
      {
        href: "/teachers",
        label: "Καθηγητές μας",
        description: "Γνώρισε την ομάδα μας",
        icon: <Users size={20} strokeWidth={2.5} />,
      },
      {
        href: "/contact#contact-form",
        label: "Φόρμα Επικοινωνίας",
        description: "Στείλε μας μήνυμα άμεσα",
        icon: <Mail size={20} strokeWidth={2.5} />,
      },
      {
        href: "/contact#map",
        label: "Πώς να μας βρεις",
        description: "Χάρτης & οδηγίες πρόσβασης",
        icon: <MapPin size={20} strokeWidth={2.5} />,
      },
      {
        href: "/contact#enrollment-form",
        label: `Εγγραφές ${academicYearShort}`,
        description: "Διαδικασία & απαραίτητα δικαιολογητικά",
        icon: <Info size={20} strokeWidth={2.5} />,
        badge: "ΑΝΟΙΧΤΕΣ",
      },
    ],
    featured: {
      title: "Επικοινωνήστε μαζί μας",
      description: "Είμαστε εδώ για κάθε απορία γιά εγγραφές, προγράμματα ή οτιδήποτε άλλο.",
      cta: "ΚΑΛΕΣΕ ΜΑΣ",
      href: "tel:2105063630",
      color: "bg-black",
    },
  },
];

// ─────────────────────────────────────────────
//  DROPDOWN PANEL
// ─────────────────────────────────────────────
function DropdownPanel({
  item,
  isOpen,
  contactPhone,
}: {
  item: NavItem;
  isOpen: boolean;
  contactPhone: string;
}) {
  if (!item.children) return null;

  const isFirst = item.id === "plano";
  const isLast = item.id === "morfosi";

  return (
    <div
      className={`absolute top-full mt-0 z-[200] transition-all duration-300 ease-out ${
        isFirst ? "left-0" : isLast ? "right-0" : "left-1/2 -translate-x-1/2"
      } ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-3 pointer-events-none"
      }`}
      style={{ minWidth: item.featured ? "700px" : "380px" }}
    >
      {/* Arrow */}
      <div
        className={`absolute -top-2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200 z-10 ${
          isFirst
            ? "left-[60px]"
            : isLast
            ? "right-[60px]"
            : "left-1/2 -translate-x-1/2"
        }`}
      />

      <div
        className={`relative bg-white border-2 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex overflow-hidden rounded-none mt-2 ${item.featured ? "flex-row" : "flex-col"
          }`}
      >
        {/* Links Column */}
        <div className={`flex flex-col p-3 ${item.featured ? "w-[55%]" : "w-full"}`}>
          <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase px-3 pt-2 pb-3 border-b border-gray-100 mb-2">
            {item.label}
          </p>
          {item.children.map((child) => (
            <Link
              key={child.href + child.label}
              href={child.href}
              className="group flex items-start gap-3 px-3 py-3 hover:bg-gray-50 transition-colors rounded-sm relative"
            >
              <div className="flex-shrink-0 w-9 h-9 bg-gray-100 group-hover:bg-brand-teal group-hover:text-white text-gray-600 flex items-center justify-center transition-colors rounded-sm">
                {child.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-gray-900 group-hover:text-brand-teal transition-colors uppercase tracking-wide">
                    {child.label}
                  </span>
                  {child.badge && (
                    <span className="text-[9px] font-black bg-brand-orange text-white px-1.5 py-0.5 tracking-wider uppercase leading-none">
                      {child.badge}
                    </span>
                  )}
                </div>
                {child.description && (
                  <p className="text-xs text-gray-500 font-medium mt-0.5 leading-snug line-clamp-1">
                    {child.description}
                  </p>
                )}
              </div>
              <ChevronRight
                size={14}
                className="flex-shrink-0 text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all mt-1"
              />
            </Link>
          ))}
        </div>

        {/* Featured Panel */}
        {item.featured && (
          <div
            className={`w-[45%] ${item.featured.color} p-6 flex flex-col justify-between`}
          >
            <div>
              <div className="w-10 h-1 bg-white mb-4" />
              <h3 className="text-white font-black text-lg uppercase tracking-tight leading-tight mb-3">
                {item.featured.title}
              </h3>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                {item.featured.description}
              </p>
            </div>
            <Link
              href={item.featured.href.startsWith("tel:") ? `tel:${contactPhone.replace(/\s+/g, "")}` : item.featured.href}
              className="mt-6 bg-white text-gray-900 px-4 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors inline-flex items-center gap-2 w-full justify-center"
            >
              {item.featured.cta}
              <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MOBILE MENU
// ─────────────────────────────────────────────
function MobileMenu({
  isOpen,
  onClose,
  contactPhone,
}: {
  isOpen: boolean;
  onClose: () => void;
  contactPhone: string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Το `overflow: hidden` στο body ΔΕΝ κλειδώνει το scroll στο iOS Safari — η
  // σελίδα συνέχιζε να κυλάει πίσω από το ανοιχτό μενού. Το `position: fixed` με
  // αρνητικό top είναι ο τρόπος που δουλεύει παντού· κρατάμε τη θέση και την
  // επαναφέρουμε στο κλείσιμο.
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setExpandedId(null), 0);
      return;
    }

    const scrollY = window.scrollY;
    const { body } = document;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-[10000] bg-white shadow-2xl transform transition-transform duration-400 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-4 border-gray-900 flex-shrink-0">
          <Image
            src="/morfosi.jpg"
            alt="Μόρφωση"
            width={200}
            height={48}
            priority
            className="h-12 w-auto object-contain"
          />
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white hover:bg-brand-orange transition-colors"
            aria-label="Κλείσιμο μενού"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <div key={item.id} className="border-b border-gray-100">
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                    className="w-full flex items-center justify-between px-6 py-4 text-left group"
                  >
                    <span className="font-black text-sm uppercase tracking-widest text-gray-900 group-hover:text-brand-teal transition-colors">
                      {item.label}
                    </span>
                    <ChevronDown
                      size={16}
                      strokeWidth={2.5}
                      className={`text-gray-500 transition-transform duration-200 ${expandedId === item.id ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${expandedId === item.id ? "max-h-[500px]" : "max-h-0"
                      }`}
                  >
                    <div className="bg-gray-50 px-4 pb-4 pt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href + child.label}
                          href={child.href}
                          onClick={onClose}
                          className="flex items-center gap-3 px-3 py-3 hover:bg-white rounded-sm group transition-colors"
                        >
                          <div className="w-8 h-8 bg-white group-hover:bg-brand-teal group-hover:text-white text-brand-teal flex items-center justify-center rounded-sm flex-shrink-0 transition-colors shadow-sm">
                            {child.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-900 group-hover:text-brand-teal transition-colors">
                                {child.label}
                              </span>
                              {child.badge && (
                                <span className="text-[9px] font-black bg-brand-orange text-white px-1.5 py-0.5 tracking-wider uppercase leading-none">
                                  {child.badge}
                                </span>
                              )}
                            </div>
                            {child.description && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                {child.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                      {item.featured && (
                        <Link
                          href={item.featured.href.startsWith("tel:") ? `tel:${contactPhone.replace(/\s+/g, "")}` : item.featured.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-4 py-3 mt-2 ${item.featured.color} text-white group transition-opacity hover:opacity-90`}
                        >
                          <span className="font-black text-xs uppercase tracking-widest">
                            {item.featured.cta}
                          </span>
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-4 font-black text-sm uppercase tracking-widest text-gray-900 hover:text-brand-teal hover:bg-gray-50 transition-colors"
                >
                  {item.label}
                  <ChevronRight size={16} strokeWidth={2.5} className="text-gray-300" />
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div className="flex-shrink-0 p-6 bg-gray-900 space-y-3">
          <a
            href={`tel:${contactPhone.replace(/\s+/g, "")}`}
            className="flex items-center gap-3 text-white hover:text-brand-orange transition-colors group"
          >
            <div className="w-9 h-9 bg-brand-orange flex items-center justify-center flex-shrink-0">
              <Phone size={16} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">
                Τηλέφωνο
              </p>
              <p className="font-black text-lg tracking-tighter group-hover:text-brand-orange transition-colors">
                {contactPhone}
              </p>
            </div>
          </a>
          <Link
            href="/contact#enrollment-form"
            onClick={onClose}
            className="w-full bg-brand-orange text-white py-4 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
          >
            <Mail size={16} strokeWidth={2.5} />
            ΕΓΓΡΑΦΕΣ & ΕΠΙΚΟΙΝΩΝΙΑ
          </Link>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
//  TOP ANNOUNCEMENTS TICKER
// ─────────────────────────────────────────────
function AnnouncementBar({ contactPhone }: { contactPhone: string }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-brand-teal-dark text-white overflow-hidden h-9 flex items-center">
      <div className="absolute inset-0 flex items-center">
        <div className="flex animate-marquee whitespace-nowrap">
          {[
            `🎓 Ξεκίνησαν οι εγγραφές για το έτος ${academicYear} — Κάλεσε στο ${contactPhone}`,
            "📚 Νέα συγγράμματα Πανελληνίων διαθέσιμα στη βιβλιοθήκη",
            "🏆 Δες τις λίστες επιτυχόντων στις Πανελλήνιες",
            "⚡ Δωρεάν υπολογιστής μορίων — Υπολόγισε τώρα",
            `🎓 Ξεκίνησαν οι εγγραφές για το έτος ${academicYear} — Κάλεσε στο ${contactPhone}`,
            "📚 Νέα συγγράμματα Πανελληνίων διαθέσιμα στη βιβλιοθήκη",
            "🏆 Δες τις λίστες επιτυχόντων στις Πανελλήνιες",
            "⚡ Δωρεάν υπολογιστής μορίων — Υπολόγισε τώρα",
          ].map((msg, i) => (
            <span key={i} className="text-xs font-bold tracking-wide mr-16">
              {msg}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-0 inset-y-0 px-3 flex items-center bg-brand-teal-dark shadow-[-10px_0_10px_#095f77] text-white/60 hover:text-white transition-colors z-10"
        aria-label="Κλείσιμο ανακοίνωσης"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN HEADER
// ─────────────────────────────────────────────
export default function Header({ contactPhone = "21 0506 3630" }: { contactPhone?: string }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Scroll behavior: compact on scroll, hide on scroll-down, show on scroll-up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);

      if (currentY > 300) {
        if (currentY > prevScrollY + 5) {
          setHidden(true);
          setOpenMenu(null);
        } else if (currentY < prevScrollY - 5) {
          setHidden(false);
        }
      } else {
        setHidden(false);
      }
      setPrevScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (id: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenMenu(id);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  const dynamicNavItems = NAV_ITEMS.map((item) => {
    if (item.id === "morfosi" && item.featured) {
      return {
        ...item,
        featured: {
          ...item.featured,
          href: `tel:${contactPhone.replace(/\s+/g, "")}`,
        },
      };
    }
    return item;
  });

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[150] transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"
          }`}
      >
        {/* Announcement Ticker */}
        <AnnouncementBar contactPhone={contactPhone} />

        {/* Main Navigation Bar */}
        <div
          className={`relative transition-all duration-300 ${scrolled
              ? "bg-white/95 backdrop-blur-md shadow-[0_4px_0_0_rgba(12,130,162,1)] py-2"
              : "bg-white shadow-[0_6px_0_0_rgba(12,130,162,1)] py-0"
            }`}
        >
          <div className="w-full px-4 md:px-6 lg:px-2 xl:px-2 min-[1400px]:px-4 2xl:px-8 flex items-center justify-between">

            {/* LEFT GROUP: Logo + Nav */}
            <div className="flex items-center">
              {/* Logo */}
              <Link
                href="/"
                className="flex-shrink-0 relative z-10 mr-4 lg:mr-1 xl:mr-4"
              >
                <Image
                  src="/morfosi.jpg"
                  alt="Μόρφωση Φροντιστήριο"
                  width={300}
                  height={80}
                  priority
                  className={`object-contain w-auto transition-all duration-300 ${scrolled ? "h-12 md:h-14 lg:h-10 xl:h-12" : "h-16 md:h-20 lg:h-12 xl:h-16"
                    }`}
                />
              </Link>

              {/* Desktop Nav */}
              <nav
                className="hidden lg:flex items-center lg:gap-0 xl:gap-0 min-[1400px]:gap-2 2xl:gap-4"
                onMouseLeave={handleMouseLeave}
              >
                {dynamicNavItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                  >
                    {item.href && !item.children ? (
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 px-2 lg:px-0.5 xl:px-1 min-[1400px]:px-2 2xl:px-3 py-5 font-black lg:text-[8px] xl:text-[9px] min-[1400px]:text-[11px] 2xl:text-[13px] uppercase tracking-tighter lg:tracking-tight xl:tracking-tight 2xl:tracking-widest text-gray-800 hover:text-brand-teal transition-colors relative group whitespace-nowrap"
                      >
                        {item.label}
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                      </Link>
                    ) : (
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === item.id ? null : item.id)
                        }
                        className={`flex items-center gap-1 px-2 lg:px-0.5 xl:px-1 min-[1400px]:px-2 2xl:px-3 py-5 font-black lg:text-[8px] xl:text-[9px] min-[1400px]:text-[11px] 2xl:text-[13px] uppercase tracking-tighter lg:tracking-tight xl:tracking-tight 2xl:tracking-widest transition-colors relative group cursor-pointer whitespace-nowrap ${openMenu === item.id
                            ? "text-brand-teal"
                            : "text-gray-800 hover:text-brand-teal"
                          }`}
                        aria-expanded={openMenu === item.id}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDown
                          size={13}
                          strokeWidth={2.5}
                          className={`transition-transform duration-200 ${openMenu === item.id ? "rotate-180 text-brand-orange" : ""
                            }`}
                        />
                        <span
                          className={`absolute bottom-0 left-0 right-0 h-[3px] bg-brand-orange transition-transform duration-200 origin-center ${openMenu === item.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                            }`}
                        />
                      </button>
                    )}

                    {/* Dropdown */}
                    {item.children && (
                      <DropdownPanel item={item} isOpen={openMenu === item.id} contactPhone={contactPhone} />
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* RIGHT GROUP: Phone + Buttons */}
            <div className="flex items-center gap-2 lg:gap-1 xl:gap-2 min-[1400px]:gap-3 2xl:gap-6 flex-shrink-0">
              {/* Phone number - desktop */}
              <a
                href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                className="hidden lg:flex flex-col items-end lg:scale-[0.65] xl:scale-[0.80] min-[1400px]:scale-90 2xl:scale-100 origin-right transition-transform"
              >
                <span className="text-[10px] font-black tracking-[0.15em] text-brand-orange uppercase">
                  Επικοινωνία
                </span>
                <span className="font-black text-gray-900 tracking-tighter hover:text-brand-teal transition-colors text-xl leading-none">
                  {contactPhone}
                </span>
              </a>

              {/* Enrollment CTA Button */}
              <Link
                href="/contact"
                className={`hidden xl:inline-flex items-center gap-2 bg-brand-orange text-white font-black uppercase tracking-wider hover:bg-orange-600 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(245,130,32,0.5)] active:scale-95 relative overflow-hidden group/enroll ${scrolled ? "px-4 py-2.5 text-[10px] xl:px-2 xl:py-1.5 min-[1400px]:px-3 min-[1400px]:py-2 2xl:px-4 2xl:py-2.5" : "px-5 py-3 text-[11px] xl:px-3 xl:py-2 min-[1400px]:px-4 min-[1400px]:py-2.5 2xl:px-5 2xl:py-3"
                  }`}
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover/enroll:translate-x-[110%] transition-transform duration-500 skew-x-12 pointer-events-none" />
                ΕΓΓΡΑΨΟΥ ΤΩΡΑ
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-11 h-11 flex items-center justify-center bg-gray-900 text-white hover:bg-brand-teal transition-colors"
                aria-label="Άνοιγμα μενού"
              >
                <Menu size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to push content below fixed header */}
      <div className={`transition-all duration-300 ${scrolled ? "h-[82px]" : "h-[96px]"} md:${scrolled ? "h-[90px]" : "h-[112px]"}`} aria-hidden="true" />

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} contactPhone={contactPhone} />
    </>
  );
}
