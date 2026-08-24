"use client";

// src/components/home/HeritageStripSection.tsx
//
// Deliberately compact — the full interactive timeline lives on /history
// (and now the About page, which links there too). Showing it a third time
// on the homepage was pure duplication; this is the "witrina" version: two
// real numbers and a link out.
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HeritageStripSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="w-full bg-primary-900 py-16">
      <motion.div
        ref={ref}
        className="mx-auto flex max-w-screen-2xl flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center md:px-8 lg:px-12"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-wrap items-center gap-7">
          <div className="text-center">
            <div className="font-arista-bold text-3xl text-white md:text-4xl">3</div>
            <div className="text-xs tracking-wider text-white/50 uppercase">поколения</div>
          </div>
          <div className="h-9 w-px bg-white/15" />
          <div className="text-center">
            <div className="font-arista-bold text-3xl text-white md:text-4xl">1936</div>
            <div className="text-xs tracking-wider text-white/50 uppercase">начало династии</div>
          </div>
          <div className="hidden h-9 w-px bg-white/15 md:block" />
          <p className="max-w-md text-sm leading-relaxed text-gray-400">
            Мы не начинаем стоматологическое дело — мы принимаем его от предыдущих поколений, развиваем и передаём
            дальше.
          </p>
        </div>

        <Link
          href="/history"
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
        >
          История династии
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
};

export default HeritageStripSection;
