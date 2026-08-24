"use client";

// src/components/home/FitSection.tsx
//
// "Узнаёте себя?" — recognition triggers (JTBD-flavored: different visitors
// arrive with different real motives), one step warmer than ValueShiftSection.
// Scenarios are grounded in business/ab-clinic-positioning-strategy.md's
// clinical niche framing — the chain traditional dentistry defaults to
// (big defect → post → core buildup → full crown → extraction+implant) and
// the specific entry points his niche is built to catch instead: no-post
// restoration, no-full-crown restoration, re-evaluating "hopeless" teeth,
// alternatives to extraction, huge failing old fillings, redoing failed
// restorations.
//
// Card art: real stock photography (owner's explicit go-ahead, 2026-08-22)
// where a photo honestly represents the scenario. Two stay gradient+icon
// on purpose — "on a post" and "hopeless tooth" don't have a photo that
// wouldn't either misrepresent a specific clinical state or read as
// alarmingly graphic for a homepage card.
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldAlert, Camera, RotateCcw, Anchor, Hourglass, Frown, Skull, Crown, Smile, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Carousel from "@/components/home/Carousel";

interface FitItem {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  image?: string;
}

const GRADIENTS = [
  "from-forest-700 via-primary-800 to-primary-900",
  "from-forest-600 via-primary-800 to-primary-900",
];

const items: FitItem[] = [
  {
    icon: ShieldAlert,
    title: "Вам сказали «только имплант» или «только коронка»",
    description:
      "А вы не готовы расставаться со своим зубом — и не уверены, что это единственный вариант.",
    gradient: GRADIENTS[0],
    image: "/images/stock/consultation-thoughtful.jpg",
  },
  {
    icon: Camera,
    title: "Вы стесняетесь улыбаться на фото",
    description:
      "Прикрываете рот рукой, выбираете ракурс, избегаете вспышки — и устали с этим жить.",
    gradient: GRADIENTS[1],
    image: "/images/stock/covering-smile.jpg",
  },
  {
    icon: RotateCcw,
    title: "Один и тот же зуб лечили уже не раз",
    description:
      "Пломба за пломбой, а результат держится всё меньше — и вы чувствуете, что дело не в невезении.",
    gradient: GRADIENTS[0],
    image: "/images/stock/dental-treatment.jpg",
  },
  {
    icon: Anchor,
    title: "Зуб держится на штифте",
    description:
      "И вы боитесь, что он снова сломается — штифт и культя не всегда были единственным путём.",
    gradient: GRADIENTS[1],
  },
  {
    icon: Hourglass,
    title: "Вам кажется, что «уже не тот возраст»",
    description:
      "Начинать лечение никогда не рано и редко поздно — возраст сам по себе не противопоказание.",
    gradient: GRADIENTS[0],
    image: "/images/stock/age-smile.jpg",
  },
  {
    icon: Frown,
    title: "Есть зуб, который вы «временно» не лечите",
    description:
      "Уже несколько лет. Отложенное решение не то же самое, что решённая проблема.",
    gradient: GRADIENTS[1],
    image: "/images/stock/procrastination.jpg",
  },
  {
    icon: Skull,
    title: "Зуб разрушен настолько, что кажется — там уже нечего спасать",
    description:
      "Часто «безнадёжный» зуб — это диагноз со слов другого врача, а не факт. Стоит проверить.",
    gradient: GRADIENTS[0],
  },
  {
    icon: Crown,
    title: "Вам уже ставили коронки — не одну",
    description:
      "И вы не уверены, что это было нужно каждый раз. Коронка — не всегда первый и не всегда лучший вариант.",
    gradient: GRADIENTS[1],
    image: "/images/stock/dental-treatment.jpg",
  },
  {
    icon: Smile,
    title: "Боитесь получить «неестественные» зубы",
    description:
      "Слишком белые, слишком ровные — не хочется, чтобы было видно, что вы «сделали зубы». Это тоже решаемо.",
    gradient: GRADIENTS[0],
    image: "/images/stock/natural-smile.jpg",
  },
];

const FitCard = ({ icon: Icon, title, description, gradient, image }: FitItem) => (
  <div className="flex h-full min-h-[380px] flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
    {/* Top half — visual */}
    <div className="relative flex h-[45%] shrink-0 items-center justify-center overflow-hidden">
      {image ? (
        <>
          <Image src={image} alt={title} fill sizes="(max-width: 640px) 82vw, 360px" className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Icon size={16} className="text-white" />
          </div>
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
          <div className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-[0.08]" />
          <Icon size={44} strokeWidth={1.1} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90" />
        </div>
      )}
    </div>
    {/* Bottom half — text */}
    <div className="flex flex-1 flex-col justify-center p-6">
      <h3 className="mb-1.5 text-base font-medium text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-400">{description}</p>
    </div>
  </div>
);

const FitSection = () => {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, amount: 0.3 });

  return (
    <section id="fit-section" className="w-full border-y border-white/6 bg-[#002a27] py-16">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8 lg:px-12">
        <motion.h2
          ref={headingRef}
          className="font-inter text-2xl md:text-3xl font-bold text-white mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Узнаёте себя?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Carousel slides={items.map((item) => <FitCard key={item.title} {...item} />)} />
        </motion.div>

        <motion.p
          className="text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={isHeadingInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Если узнали себя хотя бы в одном — вам, скорее всего, к нам.
        </motion.p>
      </div>
    </section>
  );
};

export default FitSection;
