import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

export const revalidate = 60; // Refresh every 60 seconds

const POST_QUERY = `*[_type == "post" && (slug.current == $slug || _id == $slug)][0] {
  _id,
  title,
  publishedAt,
  category,
  body,
  "imageUrl": mainImage.asset->url
}`;

const FALLBACK_POSTS: Record<string, any> = {
  'egrafes-2026-2027': {
    title: 'Εγγραφές 2026-2027: Ξεκίνησε η Νέα Σχολική Χρονιά',
    publishedAt: '2026-09-01T08:00:00Z',
    category: 'general',
    body: [{ _type: 'block', children: [{ _type: 'span', text: 'Με μεγάλη χαρά ανακοινώνουμε ότι ξεκίνησαν οι εγγραφές για τη νέα σχολική χρονιά 2026-2027. Επισκεφτείτε μας στο φροντιστήριο ή επικοινωνήστε μαζί μας για να εξασφαλίσετε θέση στα τμήματά μας.' }] }]
  },
  'apotelesmata-panellinion-2025': {
    title: 'Αποτελέσματα Πανελληνίων 2025: Συγχαρητήρια στους μαθητές μας',
    publishedAt: '2026-07-15T10:00:00Z',
    category: 'students',
    body: [{ _type: 'block', children: [{ _type: 'span', text: 'Συγχαίρουμε θερμά όλους τους μαθητές μας για την προσπάθειά τους στις Πανελλαδικές Εξετάσεις 2025. Τα ονόματα των επιτυχόντων θα τα βρείτε στη σελίδα «Επιτυχόντες».' }] }]
  },
  // We can add a fallback for 'pasxa' just in case it's in the DB but not synced yet, 
  // actually Sanity will return the real one if it exists.
};

const CATEGORY_META: Record<string, { label: string; bg: string; text: string }> = {
  general: { label: 'Γενικά', bg: 'bg-brand-teal', text: 'text-brand-teal' },
  students: { label: 'Μαθητές', bg: 'bg-brand-orange', text: 'text-brand-orange' },
  parents: { label: 'Γονείς', bg: 'bg-brand-green', text: 'text-brand-green' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Custom components for Portable Text (styling headings, links, etc.)
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-8 relative w-full h-[400px]">
          <img src={value.asset.url} alt="Εικόνα άρθρου" className="object-cover w-full h-full border-[4px] border-black shadow-[8px_8px_0px_#000]" />
        </div>
      );
    }
  },
  block: {
    normal: ({ children }: any) => <p className="text-lg text-gray-700 leading-relaxed mb-6">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 mt-12 tracking-tight">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 mt-12 tracking-tight">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 mt-8 tracking-tight">{children}</h3>,
    blockquote: ({ children }: any) => <blockquote className="border-l-[6px] border-brand-teal pl-6 py-2 my-8 font-bold text-xl italic text-gray-600 bg-gray-50">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 space-y-2 text-lg text-gray-700">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg text-gray-700">{children}</ol>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-black text-gray-900">{children}</strong>,
    link: ({ children, value }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-brand-teal underline font-bold hover:text-brand-orange transition-colors">
        {children}
      </a>
    ),
  },
};

export default async function SinglePostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;

  let post: any = null;

  try {
    post = await client.fetch(POST_QUERY, { slug });
  } catch (e) {
    console.error("Error fetching post:", e);
  }

  // Check fallback if not in CMS
  if (!post && FALLBACK_POSTS[slug]) {
    post = FALLBACK_POSTS[slug];
  }

  if (!post) {
    notFound();
  }

  const catMeta = CATEGORY_META[post.category || 'general'] || CATEGORY_META.general;
  const formattedDate = formatDate(post.publishedAt || new Date().toISOString());

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 font-sans selection:bg-brand-teal selection:text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        
        {/* Back Link */}
        <Link 
          href="/news" 
          className="inline-flex items-center gap-2 text-gray-500 font-extrabold uppercase text-xs tracking-widest hover:text-brand-teal transition-colors mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Οι Ανακοινώσεις μας
        </Link>

        {/* Post Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 py-3 mb-6 border-b-[3px] border-black">
            <div className={`inline-flex items-center gap-2 ${catMeta.bg} text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest border-2 border-black`}>
              <Tag size={12} />
              {catMeta.label}
            </div>
            <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
              <Calendar size={14} />
              {formattedDate}
            </div>
            <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
              <Clock size={14} />
              2 ΛΕΠΤΑ
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-tight mb-8">
            {post.title}
          </h1>
        </div>

        {/* Main Image */}
        {post.imageUrl && (
          <div className="relative w-full h-[300px] md:h-[500px] mb-16 border-[6px] border-black shadow-[12px_12px_0px_#000] overflow-hidden">
            <Image 
              src={post.imageUrl} 
              alt={post.title} 
              fill 
              className="object-cover hover:scale-105 transition-transform duration-700" 
              priority
            />
          </div>
        )}

        {/* Article Body */}
        <article className="prose prose-lg max-w-none prose-img:border-[4px] prose-img:border-black prose-img:shadow-[8px_8px_0px_#000]">
          {post.body ? (
            <PortableText value={post.body} components={ptComponents} />
          ) : (
            <p className="text-lg text-gray-500 italic">Το περιεχόμενο της ανακοίνωσης δεν είναι διαθέσιμο αυτή τη στιγμή.</p>
          )}
        </article>

        {/* Footer / Share container */}
        <div className="mt-20 pt-10 border-t-[4px] border-brand-teal flex flex-col sm:flex-row items-center justify-between gap-6">
          <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Μοιραστείτε το:</h3>
          <ShareButtons title={post.title} />
        </div>

      </div>
    </div>
  );
}
