import { client } from "@/sanity/client";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import {
  Newspaper, Calendar, Tag, ArrowRight, Clock, Users, ChevronRight,
  Megaphone, Bell, BookOpen, GraduationCap, TrendingUp, Star
} from "lucide-react";

export const metadata = {
  title: 'Νέα & Ανακοινώσεις | Φροντιστήριο Μόρφωση',
  description: 'Τελευταία νέα, ανακοινώσεις και ενημερώσεις από το Φροντιστήριο Μόρφωση. Εγγραφές, προγράμματα, αποτελέσματα και πολλά ακόμα.',
};

const ALL_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  category,
  "imageUrl": mainImage.asset->url,
  "excerpt": array::join(string::split(pt::text(body), "")[0..200], "")
}`;

// ─────────────────────────────────────────────
//  DYNAMIC YEAR LOGIC
// ─────────────────────────────────────────────
const now = new Date();
const currentYear = now.getFullYear(); // 2026
const nextYear = currentYear + 1; // 2027
const academicYear = `${currentYear}-${nextYear}`; // 2026-2027
const prevYear = currentYear - 1; // 2025

// Fallback posts for empty CMS
const FALLBACK_POSTS = [
  {
    _id: 'p1',
    title: `Εγγραφές ${academicYear}: Ξεκίνησε η Νέα Σχολική Χρονιά`,
    slug: { current: `egrafes-${academicYear}` },
    publishedAt: `${currentYear}-09-01T08:00:00Z`,
    category: 'general',
    imageUrl: null,
    excerpt: `Με μεγάλη χαρά ανακοινώνουμε ότι ξεκίνησαν οι εγγραφές για τη νέα σχολική χρονιά ${academicYear}. Επισκεφτείτε μας στο φροντιστήριο ή επικοινωνήστε μαζί μας για να εξασφαλίσετε θέση στα τμήματά μας.`
  },
  {
    _id: 'p2',
    title: `Αποτελέσματα Πανελληνίων ${prevYear}: Συγχαρητήρια στους μαθητές μας`,
    slug: { current: `apotelesmata-panellinion-${prevYear}` },
    publishedAt: `${currentYear}-07-15T10:00:00Z`,
    category: 'students',
    imageUrl: null,
    excerpt: `Συγχαίρουμε θερμά όλους τους μαθητές μας για την προσπάθειά τους στις Πανελλαδικές Εξετάσεις ${prevYear}. Τα ονόματα των επιτυχόντων θα τα βρείτε στη σελίδα «Επιτυχόντες».`
  },
  {
    _id: 'p3',
    title: 'Νέα Τμήματα Εντατικής Προετοιμασίας Πανελληνίων — Εαρινό 2026',
    slug: { current: 'nea-tmimata-entasikis-2026' },
    publishedAt: '2026-01-20T09:00:00Z',
    category: 'students',
    imageUrl: null,
    excerpt: 'Εντατικά τμήματα προετοιμασίας Πανελλαδικών για μαθητές Γ΄ Λυκείου. Μικρές ομάδες, στοχευμένη ύλη και εβδομαδιαία διαγνωστικά tests.'
  },
  {
    _id: 'p4',
    title: 'Ανοιχτή Ενημερωτική Εκδήλωση για Γονείς — Φεβρουάριος 2026',
    slug: { current: 'anoikti-ekdilosi-goneis-2026' },
    publishedAt: '2026-02-05T18:00:00Z',
    category: 'parents',
    imageUrl: null,
    excerpt: 'Σας καλούμε σε ανοιχτή ενημερωτική εκδήλωση για γονείς μαθητών Γ΄ Λυκείου. Θα αναλύσουμε τη στρατηγική για τις Πανελλαδικές Εξετάσεις 2026.'
  },
  {
    _id: 'p5',
    title: 'Λήψη Υποτροφιών 2025: Τρεις Μαθητές μας Βραβεύτηκαν',
    slug: { current: 'ypotrifies-2025' },
    publishedAt: '2025-12-10T11:00:00Z',
    category: 'students',
    imageUrl: null,
    excerpt: 'Τρεις μαθητές του Φροντιστηρίου Μόρφωση κέρδισαν υποτροφίες σε κορυφαία Ελληνικά Πανεπιστήμια. Είμαστε υπερήφανοι για αυτές τις διακρίσεις!'
  },
  {
    _id: 'p6',
    title: 'Νέα Ψηφιακή Πλατφόρμα e-MORFOSI: Μάθηση Online',
    slug: { current: 'e-morfosi-platform' },
    publishedAt: '2025-11-01T08:00:00Z',
    category: 'general',
    imageUrl: null,
    excerpt: 'Παρουσιάζουμε την ψηφιακή μας πλατφόρμα e-MORFOSI με βιντεομαθήματα, online ασκήσεις και live sessions με τους καθηγητές μας.'
  },
];

// Category metadata
const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  'general': {
    label: 'Γενικά',
    color: 'text-brand-teal',
    bg: 'bg-brand-teal',
    border: 'border-brand-teal',
    icon: <Megaphone size={14} />,
  },
  'students': {
    label: 'Μαθητές',
    color: 'text-brand-orange',
    bg: 'bg-brand-orange',
    border: 'border-brand-orange',
    icon: <GraduationCap size={14} />,
  },
  'parents': {
    label: 'Γονείς',
    color: 'text-brand-green',
    bg: 'bg-brand-green',
    border: 'border-brand-green',
    icon: <Users size={14} />,
  },
};

// Greek month names
const GREEK_MONTHS = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαϊ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: GREEK_MONTHS[d.getMonth()],
    year: d.getFullYear(),
    full: d.toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

// Accent color cycling for card borders
const CARD_ACCENTS = [
  { border: 'border-brand-teal', num: 'bg-brand-teal', tag: 'bg-brand-teal/10', tagText: 'text-brand-teal' },
  { border: 'border-brand-orange', num: 'bg-brand-orange', tag: 'bg-brand-orange/10', tagText: 'text-brand-orange' },
  { border: 'border-brand-green', num: 'bg-brand-green', tag: 'bg-brand-green/10', tagText: 'text-brand-green' },
  { border: 'border-brand-purple', num: 'bg-brand-purple', tag: 'bg-brand-purple/10', tagText: 'text-brand-purple' },
  { border: 'border-brand-red', num: 'bg-brand-red', tag: 'bg-brand-red/10', tagText: 'text-brand-red' },
];

export default async function NewsPage(props: { searchParams?: Promise<{ filter?: string }> }) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || 'all';

  let posts: any[] = [];

  try {
    posts = await client.fetch(ALL_POSTS_QUERY);
  } catch (e) {
    // Fallback if CMS is unavailable
  }

  const displayPosts = posts.length > 0 ? posts : FALLBACK_POSTS;

  // Featured post = newest
  const featuredPost = displayPosts[0];
  const restPostsRaw = displayPosts.slice(1);
  
  // Filtered posts for the main grid. 
  // If 'all', hide the newest one because it's featured above. 
  // If filtered, show ALL posts matching the category in the grid!
  const restPosts = filter === 'all' ? restPostsRaw : displayPosts.filter((p: any) => (p.category || 'general') === filter);

  // Latest 3 for sidebar (always from raw list so they don't disappear)
  const sidebarPosts = restPostsRaw.slice(0, 3);

  // Category counts
  const categoryCounts = displayPosts.reduce((acc: Record<string, number>, p: any) => {
    const cat = p.category || 'general';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-teal selection:text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#031516] overflow-hidden pt-48 pb-36">
        {/* Top rainbow bar */}
        <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-r from-brand-orange via-brand-teal to-brand-green" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #0c82a2 1px, transparent 1px)', backgroundSize: '50px 50px' }}
          aria-hidden="true"
        />

        {/* Giant background word */}
        <span
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[15vw] font-black text-white/[0.025] whitespace-nowrap select-none pointer-events-none uppercase tracking-widest"
          aria-hidden="true"
        >
          ΑΝΑΚΟΙΝΩΣΕΙΣ
        </span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12">
            {/* Left: Big title */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 bg-brand-teal px-6 py-3 border-4 border-white/20 mb-10">
                <Newspaper className="text-white" size={20} strokeWidth={3} />
                <span className="text-white font-black text-xs uppercase tracking-[0.3em]">Ενημερωτικό Κέντρο</span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
                ΝΕΑ &<br />
                <span className="text-brand-orange">ΑΝΑΚΟΙ</span>
                <span className="text-brand-teal">ΝΩΣΕΙΣ</span>
              </h1>

              <p className="text-gray-300 font-bold text-xl max-w-2xl leading-relaxed border-l-[6px] border-brand-orange pl-6">
                Μείνετε ενημερωμένοι για ό,τι συμβαίνει στο Φροντιστήριο Μόρφωση. Εγγραφές, αποτελέσματα, εκδηλώσεις και πολλά ακόμα.
              </p>
            </div>

            {/* Right: Category counters */}
            <div className="flex-shrink-0 grid grid-cols-3 gap-0 border-[4px] border-white/20 shadow-[12px_12px_0px_rgba(12,130,162,0.3)]">
              {[
                { key: 'general', label: 'Γενικά', icon: <Bell size={20} />, color: 'bg-brand-teal' },
                { key: 'students', label: 'Μαθητές', icon: <GraduationCap size={20} />, color: 'bg-brand-orange' },
                { key: 'parents', label: 'Γονείς', icon: <Users size={20} />, color: 'bg-brand-green' },
              ].map(({ key, label, icon, color }) => (
                <div key={key} className={`${color} px-8 py-7 border-r-[4px] last:border-r-0 border-white/20`}>
                  <div className="text-white mb-2">{icon}</div>
                  <div className="text-3xl font-black text-white leading-none">{categoryCounts[key] || 0}</div>
                  <div className="text-white/80 font-bold text-[10px] uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SCROLLING TICKER
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-brand-orange border-y-[6px] border-black overflow-hidden py-4">
        <div className="flex gap-12 animate-billboard whitespace-nowrap">
          {[...displayPosts, ...displayPosts].map((post: any, i: number) => (
            <span key={i} className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-4">
              <Bell size={12} className="flex-shrink-0" />
              {post.title}
              <span className="text-black/30">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED POST — Massive hero card
      ═══════════════════════════════════════════════════════════ */}
      {filter === 'all' && featuredPost && (() => {
        const date = formatDate(featuredPost.publishedAt);
        const catMeta = CATEGORY_META[featuredPost.category || 'general'] || CATEGORY_META['general'];

        return (
          <section className="bg-gray-50 py-20 border-b-[8px] border-brand-teal">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="flex items-center gap-4 mb-10">
                <Star size={20} className="text-brand-orange fill-brand-orange" />
                <span className="text-brand-orange font-black text-xs uppercase tracking-[0.3em]">Τελευταία Ανακοίνωση</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border-[6px] border-black shadow-[16px_16px_0px_#000] overflow-hidden">
                {/* Image / Color block */}
                <div className="lg:col-span-2 relative min-h-[300px] lg:min-h-[500px]">
                  {featuredPost.imageUrl ? (
                    <img
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-teal-dark to-brand-teal flex flex-col items-center justify-center p-12">
                      <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                        aria-hidden="true"
                      />
                      <Newspaper size={80} className="text-white/30" />
                      <div className="text-white/20 font-black text-[100px] leading-none select-none mt-4">
                        {date.day}
                      </div>
                    </div>
                  )}
                  {/* Date overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-6">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-brand-orange" />
                      <span className="text-white font-black text-xs uppercase tracking-widest">{date.full}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 bg-white p-10 lg:p-16 flex flex-col justify-between">
                  <div>
                    {/* Category badge */}
                    <div className={`inline-flex items-center gap-2 ${catMeta.bg} text-white font-black text-xs uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0px_#000] mb-8`}>
                      {catMeta.icon}
                      {catMeta.label}
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-8">
                      {featuredPost.title}
                    </h2>

                    {featuredPost.excerpt && (
                      <p className="text-gray-600 font-bold text-lg leading-relaxed border-l-[6px] border-brand-teal pl-6 mb-10">
                        {featuredPost.excerpt}...
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <Link
                      href={`/news/${featuredPost.slug?.current || featuredPost._id}`}
                      id={`post-featured-${featuredPost._id}`}
                      className="inline-flex items-center gap-3 bg-brand-teal text-white px-8 py-5 font-black uppercase tracking-widest border-4 border-black shadow-[5px_5px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                    >
                      ΔΙΑΒΑΣΤΕ ΠΕΡΙΣΣΟΤΕΡΑ
                      <ArrowRight size={18} strokeWidth={3} />
                    </Link>
                    <div className="text-gray-400 font-bold text-sm flex items-center gap-2">
                      <Clock size={14} />
                      {date.day} {date.month} {date.year}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          MAIN GRID + SIDEBAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">

            {/* LEFT: Main posts grid */}
            <div className="xl:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 border-b-[4px] border-black pb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                    ΟΛΑ ΤΑ <span className="text-brand-teal">ΝΕΑ</span>
                  </h2>
                  <span className="text-gray-400 font-bold text-sm">{restPosts.length} δημοσιεύσεις</span>
                </div>
                
                {/* ──────────────── TABS ──────────────── */}
                <div className="flex flex-wrap gap-2">
                  <Link 
                    href="?filter=all" 
                    scroll={false}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all ${filter === 'all' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}
                  >
                    ΟΛΑ
                  </Link>
                  <Link 
                    href="?filter=students" 
                    scroll={false}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all ${filter === 'students' ? 'bg-brand-orange text-white' : 'bg-white text-brand-orange'}`}
                  >
                    ΜΑΘΗΤΕΣ
                  </Link>
                  <Link 
                    href="?filter=parents" 
                    scroll={false}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all ${filter === 'parents' ? 'bg-brand-green text-white' : 'bg-white text-brand-green'}`}
                  >
                    ΓΟΝΕΙΣ
                  </Link>
                  <Link 
                    href="?filter=general" 
                    scroll={false}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all ${filter === 'general' ? 'bg-brand-teal text-white' : 'bg-white text-brand-teal'}`}
                  >
                    ΓΕΝΙΚΑ
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-0 border-[4px] border-black shadow-[10px_10px_0px_#000]">
                {restPosts.map((post: any, index: number) => {
                  const date = formatDate(post.publishedAt);
                  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
                  const catMeta = CATEGORY_META[post.category || 'general'] || CATEGORY_META['general'];

                  return (
                    <Link
                      href={`/news/${post.slug?.current || post._id}`}
                      key={post._id}
                      id={`post-card-${post._id}`}
                      className={`group flex gap-0 border-b-[4px] border-black last:border-b-0 hover:bg-gray-50 transition-colors relative overflow-hidden`}
                    >
                      {/* Left accent bar */}
                      <div className={`w-[8px] flex-shrink-0 ${accent.num} group-hover:w-[12px] transition-all duration-300`} />

                      {/* Date column */}
                      <div className="flex-shrink-0 w-28 p-6 flex flex-col items-center justify-start border-r-[4px] border-black bg-gray-50 group-hover:bg-white transition-colors">
                        <span className="text-4xl font-black text-gray-900 leading-none tracking-tighter">{date.day}</span>
                        <span className={`font-black text-xs uppercase tracking-widest mt-1 ${accent.tagText}`}>{date.month}</span>
                        <span className="text-xs font-bold text-gray-400 mt-1">{date.year}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8 flex flex-col justify-between">
                        <div>
                          {/* Category badge */}
                          <div className={`inline-flex items-center gap-2 ${catMeta.bg} text-white font-black text-[10px] uppercase tracking-widest px-3 py-1.5 mb-4`}>
                            {catMeta.icon}
                            {catMeta.label}
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-snug group-hover:text-brand-teal transition-colors mb-4">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-500 font-bold text-sm leading-relaxed line-clamp-2">
                              {post.excerpt}...
                            </p>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 mt-6 font-black text-xs uppercase ${accent.tagText} tracking-widest`}>
                          ΔΙΑΒΑΣΤΕ ΠΕΡΙΣΣΟΤΕΡΑ
                          <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>

                      {/* Index number */}
                      <div className="absolute top-4 right-4 text-[5rem] font-black text-gray-100 leading-none select-none pointer-events-none group-hover:text-gray-200 transition-colors">
                        {String(index + 2).padStart(2, '0')}
                      </div>
                    </Link>
                  );
                })}

                {/* If no posts */}
                {restPosts.length === 0 && (
                  <div className="p-16 text-center">
                    <Newspaper size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Δεν υπάρχουν ακόμα δημοσιεύσεις</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Sidebar */}
            <div className="xl:col-span-1 flex flex-col gap-10">

              {/* Categories filter */}
              <div className="border-[4px] border-black shadow-[6px_6px_0px_#000]">
                <div className="bg-[#031516] px-6 py-4 flex items-center gap-3">
                  <Tag size={16} className="text-brand-orange" />
                  <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Κατηγορίες</span>
                </div>
                <div className="divide-y-[3px] divide-black">
                  {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group cursor-pointer`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${meta.bg} flex items-center justify-center text-white flex-shrink-0 border-2 border-black`}>
                          {meta.icon}
                        </div>
                        <span className="font-black text-gray-900 text-sm uppercase tracking-tight">{meta.label}</span>
                      </div>
                      <div className={`${meta.bg} text-white font-black text-xs px-3 py-1 border border-black`}>
                        {categoryCounts[key] || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest posts mini-list */}
              <div className="border-[4px] border-black shadow-[6px_6px_0px_#0c82a2]">
                <div className="bg-brand-teal px-6 py-4 flex items-center gap-3">
                  <TrendingUp size={16} className="text-white" />
                  <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Πρόσφατα</span>
                </div>
                <div className="divide-y-[3px] divide-black">
                  {sidebarPosts.map((post: any, i: number) => {
                    const date = formatDate(post.publishedAt);
                    const catMeta = CATEGORY_META[post.category || 'general'] || CATEGORY_META['general'];
                    return (
                      <Link
                        key={post._id}
                        href={`/news/${post.slug?.current || post._id}`}
                        className="flex gap-4 p-5 hover:bg-gray-50 transition-colors group"
                      >
                        <div className={`${catMeta.bg} w-12 h-12 flex-shrink-0 flex items-center justify-center text-white font-black border-2 border-black text-sm`}>
                          {String(i + 2).padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
                            {date.day} {date.month} {date.year}
                          </div>
                          <h4 className="font-black text-sm text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-teal transition-colors tracking-tight">
                            {post.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Newsletter signup */}
              <div className="border-[4px] border-black shadow-[6px_6px_0px_#f58220] overflow-hidden">
                <div className="bg-brand-orange px-6 py-4 flex items-center gap-3">
                  <Bell size={16} className="text-white" />
                  <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Newsletter</span>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 font-bold text-sm leading-relaxed mb-6">
                    Γραφτείτε για να λαμβάνετε άμεσα τα τελευταία νέα και τις ανακοινώσεις μας στο email σας.
                  </p>
                  <NewsletterForm />
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-[#031516] border-[4px] border-black shadow-[6px_6px_0px_#000] p-8">
                <BookOpen size={32} className="text-brand-teal mb-4" />
                <h3 className="text-white font-black text-xl uppercase tracking-tight mb-4">
                  Θέλεις να ξέρεις περισσότερα;
                </h3>
                <p className="text-gray-400 font-bold text-sm leading-relaxed mb-6">
                  Επικοινώνησε μαζί μας απευθείας για ό,τι σε ενδιαφέρει.
                </p>
                <a
                  href="tel:+302101234567"
                  className="inline-flex items-center gap-2 bg-brand-teal text-white font-black text-xs uppercase tracking-widest px-6 py-4 border-2 border-brand-teal hover:bg-brand-orange hover:border-brand-orange transition-colors"
                >
                  ΚΑΛΕΣΤΕ ΜΑΣ
                  <ArrowRight size={14} strokeWidth={3} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FULL POST LISTING — Compact table view
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-24 border-t-[8px] border-brand-teal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <div className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Newspaper size={16} /> Αρχείο
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">
              {filter === 'all' && <>ΟΛΕΣ ΟΙ<br/></>}
              {filter === 'general' && <>ΓΕΝΙΚΕΣ<br/></>}
              {filter === 'students' && <>ΑΝΑΚΟΙΝΩΣΕΙΣ<br/></>}
              {filter === 'parents' && <>ΕΝΗΜΕΡΩΣΗ<br/></>}
              <span className="text-brand-orange">
                {filter === 'students' ? 'ΜΑΘΗΤΩΝ' : filter === 'parents' ? 'ΓΟΝΕΩΝ' : 'ΔΗΜΟΣΙΕΥΣΕΙΣ'}
              </span>
            </h2>
          </div>

          <div className="border-[4px] border-black shadow-[10px_10px_0px_#000] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-0 bg-[#031516] border-b-[4px] border-black">
              <div className="col-span-1 p-4 text-brand-teal font-black text-[10px] uppercase tracking-widest">#</div>
              <div className="col-span-6 p-4 text-brand-teal font-black text-[10px] uppercase tracking-widest">Τίτλος</div>
              <div className="col-span-2 p-4 text-brand-teal font-black text-[10px] uppercase tracking-widest hidden md:block">Κατηγορία</div>
              <div className="col-span-2 p-4 text-brand-teal font-black text-[10px] uppercase tracking-widest hidden md:block">Ημερομηνία</div>
              <div className="col-span-3 md:col-span-1 p-4 text-brand-teal font-black text-[10px] uppercase tracking-widest text-right">Link</div>
            </div>

            {/* Table rows */}
            {(() => {
              const filteredFullPosts = filter === 'all' ? displayPosts : displayPosts.filter((p: any) => (p.category || 'general') === filter);
              
              if (filteredFullPosts.length === 0) {
                return (
                  <div className="p-16 text-center bg-gray-50 text-gray-600 font-bold uppercase tracking-widest text-sm">
                    Δεν βρέθηκαν δημοσιεύσεις σε αυτή την κατηγορία.
                  </div>
                );
              }

              return filteredFullPosts.map((post: any, index: number) => {
                const date = formatDate(post.publishedAt);
                const catMeta = CATEGORY_META[post.category || 'general'] || CATEGORY_META['general'];
                const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

                return (
                  <div
                    key={post._id}
                    className="grid grid-cols-12 gap-0 border-b-[3px] border-gray-200 last:border-b-0 hover:bg-white transition-colors group"
                  >
                    <div className={`col-span-1 p-4 flex items-center font-black text-sm ${accent.tagText}`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="col-span-6 p-4 flex items-center">
                      <span className="font-black text-sm text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-teal transition-colors tracking-tight">
                        {post.title}
                      </span>
                    </div>
                    <div className="col-span-2 p-4 hidden md:flex items-center">
                      <span className={`${catMeta.bg} text-white font-black text-[9px] uppercase tracking-widest px-2 py-1 flex items-center gap-1`}>
                        {catMeta.icon} {catMeta.label}
                      </span>
                    </div>
                    <div className="col-span-2 p-4 hidden md:flex items-center">
                      <span className="text-gray-500 font-bold text-xs">{date.day} {date.month} {date.year}</span>
                    </div>
                    <div className="col-span-3 md:col-span-1 p-4 flex items-center justify-end">
                      <Link
                        href={`/news/${post.slug?.current || post._id}`}
                        id={`post-table-${post._id}`}
                        className={`${accent.num} text-white p-2 border border-black hover:scale-110 transition-transform inline-flex`}
                      >
                        <ChevronRight size={16} strokeWidth={3} />
                      </Link>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BOTTOM CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-orange py-20 border-t-[8px] border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <div className="text-white/80 font-black text-xs uppercase tracking-[0.3em] mb-3">Σχολική Χρονιά {academicYear}</div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                ΞΕΚΙΝΑ ΤΗΝ<br />
                ΠΡΟΕΤΟΙΜΑΣΙΑ ΣΟΥ
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-3 bg-white text-brand-orange px-10 py-5 font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              >
                ΥΠΟΛΟΓΙΣΜΟΣ ΜΟΡΙΩΝ
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <a
                href="tel:+302101234567"
                className="inline-flex items-center gap-3 bg-[#031516] text-white px-10 py-5 font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              >
                ΚΑΛΕΣΤΕ ΜΑΣ
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
