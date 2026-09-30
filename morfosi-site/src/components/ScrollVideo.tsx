"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent, useSpring } from "framer-motion";

const FRAME_COUNT = 62;

/**
 * Δύο εντελώς διαφορετικές υλοποιήσεις, γιατί το κινητό και το desktop έχουν
 * διαφορετικούς περιορισμούς:
 *
 * - Desktop: scroll-scrubbing σε canvas με 62 WebP καρέ (1.26MB, 1280px πλάτος).
 * - Κινητό: ένα portrait mp4 300KB που παίζει μόνο του. Το scrubbing με ακολουθία
 *   εικόνων στο κινητό σήμαινε 5MB κατέβασμα και 62 αποκωδικοποιημένα bitmap στη
 *   μνήμη — ο βασικός λόγος που το site κόλλαγε. Επιπλέον, το landscape βίντεο σε
 *   κάθετη οθόνη πετούσε το 74% του πλάτους του καρέ, οπότε το mp4 είναι ήδη
 *   κομμένο σε 9:16 και δείχνει καθαρότερο με 17x λιγότερα bytes.
 */
function frameSrc(index: number) {
  return `/video-frames/w1280/frame_${index.toString().padStart(4, "0")}.webp`;
}

// ─── Κινητό: απλό autoplay βίντεο, μηδέν scroll hijacking ──────────────────────
function MobileHeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);

  // Κατεβάζουμε το βίντεο μόνο όταν πλησιάσει στο viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrc("/video/hero-mobile.mp4");
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Το autoplay μπορεί να απορριφθεί (π.χ. Low Power Mode στο iOS)· τότε μένει το poster.
  useEffect(() => {
    if (!src) return;
    videoRef.current?.play().catch(() => {});
  }, [src]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[80svh] bg-black border-y-8 border-brand-teal overflow-hidden"
    >
      <video
        ref={videoRef}
        src={src}
        poster="/video/hero-mobile-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </section>
  );
}

// ─── Desktop: scroll scrubbing σε canvas ──────────────────────────────────────
function DesktopScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasStartedLoading = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = imagesRef.current[index - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const ratio = Math.max(canvas.width / iw, canvas.height / ih);
    const x = (canvas.width - iw * ratio) / 2;
    const y = (canvas.height - ih * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, iw, ih, x, y, iw * ratio, ih * ratio);
  }, []);

  const currentIndex = useCallback(
    () => Math.min(FRAME_COUNT, Math.max(1, Math.floor(smoothProgress.get() * FRAME_COUNT) + 1)),
    [smoothProgress]
  );

  // Το canvas δουλεύει σε φυσικά pixel — χωρίς αυτό η εικόνα βγαίνει θολή σε retina.
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      renderFrame(currentIndex());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame, currentIndex]);

  // Πρώτα το καρέ 1 (για να φύγει ο loader αμέσως), μετά τα υπόλοιπα στο παρασκήνιο.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const startLoading = () => {
      if (hasStartedLoading.current) return;
      hasStartedLoading.current = true;

      const load = (i: number) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = frameSrc(i);
          img.onload = () => resolve();
          img.onerror = () => resolve();
          imagesRef.current[i - 1] = img;
        });

      load(1).then(() => {
        renderFrame(1);
        setIsLoaded(true);
        const rest = [];
        for (let i = 2; i <= FRAME_COUNT; i++) rest.push(load(i));
        Promise.all(rest).then(() => renderFrame(currentIndex()));
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoading();
          observer.disconnect();
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [renderFrame, currentIndex]);

  useMotionValueEvent(smoothProgress, "change", () => {
    if (imagesRef.current.length < 1) return;
    const frameIndex = currentIndex();
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  return (
    <section ref={containerRef} className="relative w-full h-[300vh] bg-black">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black border-y-8 border-brand-teal z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-10 h-10 border-4 border-brand-teal border-t-white rounded-full animate-spin opacity-40" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>
    </section>
  );
}

export default function ScrollVideo() {
  // `null` μέχρι να γίνει mount, ώστε server και client να συμφωνούν στο πρώτο render.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (isDesktop === null) {
    return <section className="w-full h-[80svh] bg-black border-y-8 border-brand-teal" />;
  }

  return isDesktop ? <DesktopScrollVideo /> : <MobileHeroVideo />;
}
