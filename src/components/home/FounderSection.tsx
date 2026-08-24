"use client";

// src/components/home/FounderSection.tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BookingButton from "@/components/common/BookingButton";

const FounderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="w-full bg-primary-900 py-24 md:py-32">
      <div ref={ref} className="mx-auto grid max-w-screen-2xl grid-cols-1 items-stretch gap-0 md:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          className="relative aspect-square w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[520px]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/images/hero/founder-loupes.jpg"
            alt="Иброхимжон Азимов за работой в бинокулярах"
            fill
            // The box is a tall portrait crop of a landscape (16:9) source,
            // so object-cover throws away most of the width to fill the
            // height — a width-based sizes hint (e.g. "40vw") badly
            // undersells the resolution actually needed and Next serves an
            // image the browser then has to stretch. Sized generously
            // here so the delivered source is always taller than the box.
            sizes="(max-width: 768px) 150vw, 2400px"
            quality={90}
            className="object-cover object-[65%_35%]"
          />
          {/* No hard frame on any side — a vignette fades the photo into
              the section background on all four edges at once, per the
              owner's request, instead of a directional gradient that still
              left a visible edge on two sides. */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_25%,var(--color-primary-900)_100%)]" />
        </motion.div>

        <div className="px-4 pt-8 md:px-8 md:pt-0 lg:px-12">
          <motion.div
            className="section-label text-xs font-semibold tracking-[0.15em] text-forest-400 uppercase"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Врач-владелец
          </motion.div>

          <motion.h2
            className="mt-4 font-inter text-3xl leading-tight font-bold text-white md:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Специализируюсь на восстановлении разрушенных зубов накладками —
            без коронок и имплантов там, где можно сохранить свой зуб
          </motion.h2>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-gray-400"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Первым в биомиметическую реставрацию меня привёл Dr. Matt Nejad
            (Nejad Institute, США) — это перевернуло моё понимание профессии.
            Сейчас учусь напрямую у Pascal Magne — основателя этого
            направления в стоматологии. Тема моей научной работы —
            восстановление зубов накладками нового поколения.
          </motion.p>

          <motion.p
            className="mt-4 max-w-xl text-base leading-relaxed text-gray-400"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            Магистр челюстно-лицевой хирургии и дополнительная специализация
            по ортопедической стоматологии (Ташкентский государственный
            стоматологический институт), стажировки в Tokai Central Hospital
            (Япония) и Gülhane (Турция).
          </motion.p>

          <motion.p
            className="mt-4 max-w-xl text-base leading-relaxed text-gray-400"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.34 }}
          >
            Консультацию и саму реставрацию накладками провожу лично, от
            диагностики до готового результата. Если зубу перед этим нужна
            подготовка — гигиена, лечение кариозных полостей — этими
            этапами занимается команда под моим контролем.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.42 }}
          >
            <div>
              <div className="font-arista-bold text-3xl text-white">3</div>
              <div className="text-xs tracking-wider text-white/50 uppercase">поколения в профессии</div>
            </div>
            <div className="h-10 w-px bg-white/15" />
            <Link
              href="/team/ibrokhimjon-azimov"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
            >
              Все дипломы и сертификаты
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <BookingButton className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-500 to-forest-400 px-7 py-3.5 text-sm font-medium text-white hover:from-forest-600 hover:to-forest-500">
              Разобрать мой случай
            </BookingButton>
            <span className="text-xs text-gray-500">Консультация ни к чему не обязывает</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
