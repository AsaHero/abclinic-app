"use client";

// src/components/home/HeroSection.tsx
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import BookingButton from "@/components/common/BookingButton";
import { ArrowRight } from "lucide-react";

interface HeroSlide {
  id: string;
  photo: string;
  alt: string;
}

// Real photos live in /public/images/hero/ — today only the founder's
// portrait is wired up. Add more entries here once the owner sends
// team/family photos in the same style (transparent-background cutout,
// smiling, same crop) — the rotation logic already supports N slides.
const heroSlides: HeroSlide[] = [{ id: "founder", photo: "/images/hero/founder.png", alt: "Иброхимжон Азимов" }];

const EASE = [0.25, 0.1, 0, 1] as const;

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSlide] = useState(0);
  // Starts false (placeholder) rather than relying on the <img>'s onError —
  // for an already-broken src, the browser fires that native error event
  // while parsing the server-rendered HTML, before React hydrates and
  // attaches the listener, so it's silently missed. A plain client-side
  // preload check sidesteps the race entirely.
  const [photoReady, setPhotoReady] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setPhotoReady(true);
    img.onerror = () => setPhotoReady(false);
    img.src = heroSlides[0].photo;
  }, []);

  // Scroll-linked depth: the portrait scales, lifts, and tilts in 3D as the
  // hero scrolls past — perspective + rotateY instead of a 2D translate, so
  // it actually reads as a 3D move rather than a slide. Pure CSS transforms
  // driven by framer-motion, no WebGL/Canvas (see /history for why that
  // route was abandoned this session).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const photoRotateY = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const slide = heroSlides[activeSlide];

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-primary-900">
      {/* Portrait — the visual centerpiece */}
      <div className="absolute inset-0" style={{ perspective: "1400px" }}>
        {/* Backlight glow behind the portrait — was amber (read as an odd
            yellow stain behind him, per owner feedback); switched to the
            site's own forest accent so it reads as an intentional brand
            glow instead of a lighting artifact. */}
        <div className="absolute right-[5%] bottom-0 h-[70%] w-[45%] rounded-full bg-forest-500/15 blur-[100px] md:right-[15%]" />
        <motion.div
          className="absolute right-0 bottom-0 h-[78%] w-full origin-bottom md:top-[8%] md:h-auto md:w-[60%]"
          style={{
            y: photoY,
            scale: photoScale,
            rotateY: photoRotateY,
            // Fade the photo's own left edge into the background (alpha,
            // not a color wash) so it blends smoothly without tinting the
            // visible face/clothing — the overlay gradients below handle
            // text-side darkening only, scoped away from the portrait.
            maskImage: "linear-gradient(to left, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 88%, transparent 100%)",
          }}
        >
          {photoReady ? (
            <Image
              src={slide.photo}
              alt={slide.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain object-bottom md:object-cover md:object-top"
              draggable={false}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-t from-white/[0.05] via-white/[0.02] to-transparent" />
          )}
        </motion.div>
      </div>

      {/* Gradients so the headline reads against the dark background — scoped
          to the text side (left ~45%) so they never wash color across the
          portrait itself; the photo's own left-edge mask above handles its
          blend into the background. */}
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-primary-900 from-0% via-primary-900/55 via-20% to-transparent to-45% md:to-40%" />
      <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-primary-900 to-transparent" />

      <motion.div
        className="relative z-10 flex h-full w-full items-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <span className="size-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-medium tracking-[0.15em] text-white/70 uppercase">
                Стоматология восстановления · для взрослых
              </span>
            </motion.div>

            <motion.h1
              className="font-arista-bold text-4xl leading-[0.95] text-white uppercase md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
            >
              Восстанавливаем
            </motion.h1>
            <motion.p
              className="font-arista-light mt-1 text-2xl text-amber-400 italic md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: EASE }}
            >
              даже сильно разрушенные зубы
            </motion.p>

            <motion.div
              className="mt-8 flex items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div>
                <div className="font-arista-bold text-3xl text-white md:text-4xl">1936</div>
                <div className="text-xs tracking-wider text-white/50 uppercase">начало династии</div>
              </div>
              <div className="h-10 w-px bg-white/15" />
              <div>
                <div className="font-arista-bold text-3xl text-white md:text-4xl">3</div>
                <div className="text-xs tracking-wider text-white/50 uppercase">поколения врачей</div>
              </div>
            </motion.div>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              <BookingButton
                glass
                className="w-fit rounded-full px-7 py-4 text-sm font-medium text-white hover:scale-[1.03]"
              >
                <span>Разобрать случай</span>
                <ArrowRight size={16} className="stroke-2 transition-transform group-hover:translate-x-1" />
              </BookingButton>
            </motion.div>
          </div>
        </div>

        {/* Minimal scroll cue — no wordy call-to-action, just a hint */}
        <motion.button
          type="button"
          onClick={() =>
            document.getElementById("fit-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="group absolute bottom-10 left-6 flex cursor-pointer items-center gap-3 text-white/40 transition-colors hover:text-white/70 md:left-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase">Скролл</span>
          <motion.div
            className="h-px w-10 origin-left bg-white/30 group-hover:bg-white/60"
            animate={{ scaleX: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
