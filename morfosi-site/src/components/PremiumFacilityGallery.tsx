"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Images } from "lucide-react";

export type FacilityPhoto = {
  _id: string;
  title: string;
  photoUrl: string;
  /** Μία από τις 6 που φαίνονται πάντα. */
  featured?: boolean;
  /** Πολύ παρόμοια με άλλη — φαίνεται μόνο στο «Δείτε όλες». */
  hideFromMain?: boolean;
  /** Πλάτος/ύψος — κρατά τη θέση της πριν φορτώσει, για να μην «πηδάει» η σελίδα. */
  aspect?: number;
};

const FEATURED_COUNT = 6;

// Τα originals από το κινητό είναι ~1800px· το Sanity CDN τα κόβει στο μέγεθος που χρειάζεται.
const sized = (url: string, w: number) => `${url}?w=${w}&auto=format&q=75`;

/*
 * Bento για 6 φωτογραφίες, χωρίς κενά σε καμία οθόνη:
 *   κινητό (2 στήλες): [0 0] [1 2] [3 4] [5 5]
 *   desktop (3 στήλες): [0 0 1] [0 0 2] [3 4 5]
 */
const TILE_CLASSES = [
  "col-span-2 row-span-2",
  "",
  "",
  "",
  "",
  "col-span-2 lg:col-span-1",
];

interface PremiumFacilityGalleryProps {
  photos: FacilityPhoto[];
}

export default function PremiumFacilityGallery({ photos }: PremiumFacilityGalleryProps) {
  const [showAll, setShowAll] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  if (!photos || photos.length === 0) return null;

  // Οι «βασικές»: όσες είναι σημειωμένες στο Studio, συμπληρωμένες με τις
  // επόμενες κατά σειρά ώστε να είναι πάντα 6.
  const featured = photos.filter((p) => p.featured && !p.hideFromMain);
  for (const p of photos) {
    if (featured.length >= FEATURED_COUNT) break;
    if (!p.hideFromMain && !featured.includes(p)) featured.push(p);
  }
  const main = featured.slice(0, FEATURED_COUNT);

  // Όλες οι υπόλοιπες, χωρίς όσες είναι ίδιο αρχείο με κάποια που ήδη φαίνεται.
  const seen = new Set(main.map((p) => p.photoUrl));
  const rest = photos.filter((p) => {
    if (seen.has(p.photoUrl)) return false;
    seen.add(p.photoUrl);
    return true;
  });

  const toggle = () => {
    if (showAll) {
      // Κλείνοντας, γύρνα στην αρχή της gallery αντί να μείνεις στο κενό.
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setShowAll((v) => !v);
  };

  return (
    <div ref={topRef} className="scroll-mt-32">
      <div className="grid grid-cols-2 lg:grid-cols-3 auto-rows-[140px] sm:auto-rows-[200px] lg:auto-rows-[240px] gap-3 md:gap-4">
        {main.map((photo, i) => {
          const big = i === 0;
          return (
            <figure
              key={photo._id}
              className={`group relative overflow-hidden border-4 border-gray-900 bg-gray-200 shadow-[6px_6px_0px_#111] ${TILE_CLASSES[i] ?? ""}`}
            >
              <img
                src={sized(photo.photoUrl, big ? 1400 : 800)}
                alt={photo.title}
                loading={big ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <figcaption className="absolute left-0 bottom-0 bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] md:text-xs px-3 py-1.5">
                {photo.title}
              </figcaption>
            </figure>
          );
        })}
      </div>

      {rest.length > 0 && (
        <>
          <div className="flex justify-center mt-10 md:mt-12">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={showAll}
              aria-controls="facility-all-photos"
              className="group inline-flex items-center gap-4 bg-white border-4 border-gray-900 pl-6 pr-3 py-3 md:pl-8 md:pr-4 md:py-4 font-black uppercase tracking-[0.18em] text-xs md:text-sm text-gray-900 shadow-[6px_6px_0px_#111] hover:shadow-[2px_2px_0px_#111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/50"
            >
              <Images size={18} strokeWidth={2.5} className="text-brand-green" />
              <span>{showAll ? "Λιγότερες φωτογραφίες" : "Δείτε όλες τις φωτογραφίες"}</span>
              <span className="inline-flex items-center gap-1.5 bg-brand-green text-white px-2.5 py-1 text-[11px] md:text-xs tracking-normal">
                {showAll ? main.length + rest.length : `+${rest.length}`}
                <ChevronDown
                  size={16}
                  strokeWidth={3}
                  className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                />
              </span>
            </button>
          </div>

          {/* Φορτώνονται μόνο όταν ο επισκέπτης πατήσει το κουμπί. */}
          {showAll && (
            <motion.div
              id="facility-all-photos"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-10 columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4"
            >
              {/* Masonry με columns: κάθετες και οριζόντιες κρατούν τις αναλογίες τους */}
              {rest.map((photo) => (
                <figure
                  key={photo._id}
                  className="relative mb-3 md:mb-4 break-inside-avoid overflow-hidden border-4 border-gray-900 bg-gray-200"
                >
                  <img
                    src={sized(photo.photoUrl, 700)}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    style={photo.aspect ? { aspectRatio: photo.aspect } : undefined}
                    className="block w-full h-auto object-cover"
                  />
                </figure>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
