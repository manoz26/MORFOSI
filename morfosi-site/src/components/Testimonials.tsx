"use client"

import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export interface TestimonialType {
  _id: string;
  studentName: string;
  year?: number;
  university?: string;
  quote?: string;
  photoUrl?: string;
}

export default function Testimonials({ testimonials = [] }: { testimonials?: TestimonialType[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Χωρίς fallback data: οι μαρτυρίες είναι δηλώσεις πραγματικών μαθητών, οπότε
  // ή έρχονται εγκεκριμένες από το CMS ή δεν εμφανίζεται καθόλου η ενότητα.
  const items = testimonials;

  // Refs for scroll animations
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  const autoRotateInterval = 6000;

  // Animation variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Auto rotate testimonials
  useEffect(() => {
    if (autoRotateInterval <= 0 || items.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [autoRotateInterval, items.length])

  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 md:py-32 overflow-hidden bg-white border-t-[8px] border-black scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-16 w-full lg:grid-cols-2 lg:gap-24"
        >
          {/* Left side: Heading and navigation */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-brand-orange border-4 border-black shadow-[4px_4px_0px_#000] text-sm font-black uppercase tracking-widest text-white">
                <Star className="mr-2 h-4 w-4 fill-white" />
                <span>Οι Πρωταγωνιστες Μας</span>
              </div>

              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter text-gray-900 uppercase leading-[0.9] drop-shadow-sm">
                Ιστοριες <br/><span className="text-brand-orange bg-black px-2 mt-2 inline-block -rotate-1">Επιτυχιας</span>
              </h2>

              <p className="max-w-[600px] text-gray-600 font-bold md:text-xl/relaxed border-l-[6px] border-brand-teal pl-4">
                Δεν χρειάζεται να πούμε εμείς για το έργο μας. Δείτε τι λένε οι μαθητές μας για την εμπειρία τους και την πορεία τους προς την κορυφή.
              </p>

              <div className="flex items-center gap-6 pt-6 mt-4">
                <button
                  onClick={() => setActiveIndex((current) => (current - 1 + items.length) % items.length)}
                  className="w-12 h-12 border-[3px] border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  aria-label="Προηγούμενη αφήγηση"
                >
                  <ChevronLeft className="w-6 h-6 text-black" strokeWidth={3} />
                </button>

                <div className="flex items-center gap-3">
                  {items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-4 transition-all duration-300 border-[3px] border-black ${
                        activeIndex === index ? "w-16 bg-brand-teal shadow-[3px_3px_0px_#000]" : "w-4 bg-gray-100 hover:bg-gray-300"
                      }`}
                      aria-label={`Προβολή αφήγησης ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveIndex((current) => (current + 1) % items.length)}
                  className="w-12 h-12 border-[3px] border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  aria-label="Επόμενη αφήγηση"
                >
                  <ChevronRight className="w-6 h-6 text-black" strokeWidth={3} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right side: Testimonial cards */}
          <motion.div variants={itemVariants} className="relative grid w-full items-center">
            {items.map((testimonial, index) => (
              <motion.div
                key={testimonial._id || index}
                className="col-start-1 row-start-1 w-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  scale: activeIndex === index ? 1 : 0.95,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ 
                  zIndex: activeIndex === index ? 10 : 0,
                  pointerEvents: activeIndex === index ? "auto" : "none"
                }}
              >
                <div className="bg-white border-[6px] border-black shadow-[8px_8px_0px_#000] md:shadow-[16px_16px_0px_#000] p-6 md:p-12 h-full flex flex-col relative group">
                  {/* Rating Stars - Brutalist style */}
                  <div className="mb-6 flex gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="bg-brand-orange border-[3px] border-black p-1 shadow-[2px_2px_0px_#000] transform -rotate-6">
                           <Star className="h-5 w-5 fill-white text-white" />
                        </div>
                      ))}
                  </div>

                  <div className="relative mb-8 flex-1">
                    <Quote className="absolute -top-6 -left-6 h-12 w-12 text-brand-teal opacity-20 rotate-180" />
                    <p className="relative z-10 text-lg md:text-2xl font-bold leading-relaxed text-gray-900 tracking-tight">&quot;{testimonial.quote}&quot;</p>
                  </div>

                  {/* Hard Separator */}
                  <div className="w-full h-1 bg-black my-6"></div>

                  <div className="flex items-center gap-6">
                    {/* Avatar (Square & Sharp instead of Round) */}
                    <div className="h-20 w-20 border-[4px] border-black shadow-[4px_4px_0px_#000] bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                       {testimonial.photoUrl ? (
                         <Image src={testimonial.photoUrl} alt={testimonial.studentName} width={80} height={80} className="w-full h-full object-cover transition-all duration-500" />
                       ) : (
                         <span className="font-black text-3xl text-gray-400">{testimonial.studentName.charAt(0)}</span>
                       )}
                    </div>
                    <div>
                      <h3 className="font-black text-xl md:text-2xl uppercase tracking-tighter text-gray-900">{testimonial.studentName}</h3>
                      <p className="font-extrabold text-brand-teal uppercase tracking-widest text-sm mt-1">
                        {testimonial.university} {testimonial.year ? `(${testimonial.year})` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decorative elements behind cards */}
            <div className="hidden md:block absolute -bottom-8 -left-8 h-32 w-32 bg-brand-teal border-[4px] border-black -z-10 shadow-[8px_8px_0px_#000]"></div>
            <div className="hidden md:block absolute -top-8 -right-8 h-20 w-20 bg-brand-orange border-[4px] border-black -z-10 shadow-[8px_8px_0px_#000]"></div>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA — Conversion point */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-20 flex flex-col sm:flex-row justify-center items-center gap-6">
        <a
          href="/contact#enrollment-form"
          className="inline-flex items-center gap-3 bg-brand-orange text-white px-12 py-5 font-black uppercase tracking-widest text-sm border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
        >
          ΓΙΝΕ Ο ΕΠΟΜΕΝΟΣ ΕΠΙΤΥΧΩΝ →
        </a>
        <a
          href="/epityxontes"
          className="inline-flex items-center gap-3 bg-white text-brand-teal px-12 py-5 font-black uppercase tracking-widest text-sm border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[5px] hover:translate-y-[5px] transition-all hover:bg-brand-teal hover:text-white"
        >
          ΔΕΣ ΟΛΟΥΣ ΤΟΥΣ ΕΠΙΤΥΧΟΝΤΕΣ
        </a>
      </div>
    </section>
  )
}
