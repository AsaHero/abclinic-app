"use client";

// src/components/home/ValueShiftSection.tsx
//
// Coldest step of the funnel — before any offer. No CTA here on purpose:
// this section only resets the frame ("your teeth matter more than you
// think"), the way a visitor who never considered dental care as anything
// but an inconvenience needs before the rest of the page will land.
//
// Claims here are calibrated to what the research actually supports —
// checked against real sources (not just restated as fact):
// - Facial aging from tooth/bone loss: strong evidence (PMC11870634,
//   PMC9199120 — edentulous adults show measurable facial collapse).
// - Confidence/self-esteem link: strong evidence (dental satisfaction
//   correlates with self-esteem and social confidence in multiple studies).
// - Occlusion-posture link: genuinely mixed evidence (~2/3 of reviewed
//   studies find a relationship,~1/3 don't, no confirmed cause-effect per
//   PubMed 22435603) — worded as "researchers are still studying this",
//   not asserted as settled fact.
//
// "Подробнее" now opens a real blog article per point (owner's request,
// 2026-08-22) instead of the earlier in-page modal — each `slug` below
// maps to a real post seeded into blog_posts, same claims/sourcing as the
// card text, just expanded. Card art: photography where a real stock
// photo fits the point; the two points with no honest photographic
// equivalent (posture, decay progression — nothing to literally show)
// keep the gradient+icon treatment instead of a generic stock stand-in.
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PersonStanding, TrendingDown, ArrowRight, type LucideIcon } from "lucide-react";
import Carousel from "@/components/home/Carousel";

interface Point {
  slug: string;
  badge: string;
  title: string;
  text: string;
  image?: string;
  icon?: LucideIcon;
  gradient: string;
}

const points: Point[] = [
  {
    slug: "zhevanie-i-zdorove",
    badge: "Функция",
    title: "Это не только еда",
    text: "Жевание — это пищеварение, энергия и то, как вы чувствуете себя каждый день.",
    image: "/images/stock/eating-apple.jpg",
    gradient: "from-forest-700 via-primary-800 to-primary-900",
  },
  {
    slug: "prikus-i-osanka",
    badge: "Тело",
    title: "Это может влиять на осанку",
    text: "Учёные до сих пор изучают связь между прикусом и тем, как вы держите тело — но сама эта связь обсуждается всерьёз, не как миф.",
    icon: PersonStanding,
    gradient: "from-forest-600 via-primary-800 to-primary-900",
  },
  {
    slug: "poterya-zubov-i-litso",
    badge: "Внешность",
    title: "Это меняет форму лица",
    text: "Без опоры на зубы кость и мягкие ткани со временем «проседают» — щёки и губы теряют объём, лицо визуально стареет быстрее.",
    image: "/images/stock/face-closeup.jpg",
    gradient: "from-forest-700 via-primary-700 to-primary-900",
  },
  {
    slug: "ulybka-i-vospriyatie",
    badge: "Статус",
    title: "Это часть того, как вас воспринимают",
    text: "Можно выглядеть уверенно во всём остальном — а зубы выдавать старые компромиссы. Исследования подтверждают: это напрямую связано с тем, как вас воспринимают в общении.",
    image: "/images/stock/confident-smile.jpg",
    gradient: "from-forest-600 via-primary-700 to-primary-900",
  },
  {
    slug: "svoboda-i-uverennost",
    badge: "Свобода",
    title: "Это про свободу",
    text: "Есть что хочется, смеяться в голос, не думать о зубах в моменте — это тоже часть здоровья, а не мелочь.",
    image: "/images/stock/laughing-freely.jpg",
    gradient: "from-forest-700 via-primary-800 to-primary-900",
  },
  {
    slug: "pochemu-nelzya-otkladyvat",
    badge: "Прогноз",
    title: "Разрушение не останавливается само",
    text: "Без внимания проблема не стоит на месте — с каждым годом лечить сложнее и дороже.",
    icon: TrendingDown,
    gradient: "from-forest-600 via-primary-800 to-primary-900",
  },
];

const PointCard = ({ point }: { point: Point }) => {
  const Icon = point.icon;
  return (
    <Link
      href={`/blog/${point.slug}`}
      className={`group relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl border border-white/8 p-6 transition-transform duration-500 hover:scale-[1.02] ${
        point.image ? "bg-primary-900" : `bg-gradient-to-br ${point.gradient}`
      }`}
    >
      {point.image ? (
        <>
          <Image
            src={point.image}
            alt={point.title}
            fill
            sizes="(max-width: 640px) 82vw, 360px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-[0.06]" />
          {Icon && (
            <Icon
              size={72}
              strokeWidth={1}
              className="pointer-events-none absolute top-6 right-6 text-white/10 transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </>
      )}

      <div className="relative z-10 mb-auto flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white/70 uppercase backdrop-blur-sm">
        <span className="text-forest-400">✦</span>
        {point.badge}
      </div>

      <h3 className="relative z-10 text-lg leading-snug font-medium text-white">{point.title}</h3>
      <span className="relative z-10 mt-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[11px] font-bold tracking-tight text-primary-900 transition-colors group-hover:bg-forest-100">
        Подробнее
        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
};

const ValueShiftSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="w-full bg-primary-900 py-24 md:py-28">
      <div ref={ref} className="mx-auto max-w-screen-2xl px-4 md:px-8 lg:px-12">
        <motion.p
          className="text-xs font-semibold tracking-[0.15em] text-forest-400 uppercase mb-5"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Прежде чем говорить о лечении
        </motion.p>

        <motion.h2
          className="font-inter text-3xl md:text-5xl font-bold text-white max-w-3xl mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Зубы — это не только зубы
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel slides={points.map((p) => <PointCard key={p.slug} point={p} />)} />
        </motion.div>

        <motion.p
          className="text-base text-gray-500 mt-10 max-w-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Это не повод для тревоги — это повод присмотреться к тому, что
          происходит именно у вас.
        </motion.p>
      </div>
    </section>
  );
};

export default ValueShiftSection;
