"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Users, Clock } from "lucide-react";
import { yearsOfExperience, type FactCounts } from "@/lib/facts";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("el-GR")}
      {suffix}
    </span>
  );
}

export default function SocialProofBar({ counts }: { counts?: FactCounts }) {
  // Μόνο ό,τι είναι αληθινό: τα χρόνια από την ίδρυση και ό,τι μετριέται στο Sanity.
  const stats = [
    { icon: <Clock size={20} strokeWidth={3} />, value: yearsOfExperience(), label: "ΧΡΟΝΙΑ ΕΜΠΕΙΡΙΑΣ" },
    { icon: <Users size={20} strokeWidth={3} />, value: counts?.teachers ?? 0, label: "ΚΑΘΗΓΗΤΕΣ" },
    { icon: <BookOpen size={20} strokeWidth={3} />, value: counts?.books ?? 0, label: "ΕΚΔΟΣΕΙΣ ΒΙΒΛΙΩΝ" },
  ].filter((stat) => stat.value > 0);

  return (
    <section className="relative w-full bg-[#031516] border-y-[6px] border-brand-orange overflow-hidden">
      {/* Stats Grid */}
      <div
        className="grid gap-0 divide-x-[3px] divide-brand-orange/30"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center py-6 md:py-8 px-4 text-center group hover:bg-brand-orange/10 transition-colors"
          >
            <div className="text-brand-orange mb-2">{stat.icon}</div>
            <span className="font-black text-white text-3xl md:text-4xl lg:text-5xl tracking-tighter leading-none">
              <AnimatedNumber target={stat.value} />
            </span>
            <span className="font-black text-gray-400 text-[10px] md:text-xs tracking-widest uppercase mt-2">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* University ticker */}
      <div className="border-t-[3px] border-brand-orange/30 bg-brand-teal-dark/50 py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {[1, 2].map((_, idx) => (
            <span key={idx} className="inline-flex items-center gap-6 mx-8 text-white/80 font-bold text-sm tracking-wide">
              <span className="text-brand-orange font-black">●</span> Ιατρική Αθηνών
              <span className="text-brand-orange font-black">●</span> ΕΜΠ Ηλεκτρολόγων
              <span className="text-brand-orange font-black">●</span> Νομική Αθηνών
              <span className="text-brand-orange font-black">●</span> ΟΠΑ Λογιστικής
              <span className="text-brand-orange font-black">●</span> Πολυτεχνείο Θεσσαλονίκης
              <span className="text-brand-orange font-black">●</span> Φαρμακευτική
              <span className="text-brand-orange font-black">●</span> Οδοντιατρική
              <span className="text-brand-orange font-black">●</span> Παιδαγωγικό
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
