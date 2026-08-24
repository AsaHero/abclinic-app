"use client";

// src/components/home/MethodologySection.tsx
//
// The real patient journey, packaged for the site — his own words (2026-08-22),
// restructured into six stages rather than four abstract principles:
// первая встреча → диагностика и план → согласование → лечение → сдача
// работы → сопровождение. Each stage is honest about what actually happens
// and why (e.g. "no obligation at the first visit" is a real operating
// choice, not a marketing line).
//
// Card art: real stock photography (Unsplash), same treatment as
// FitSection's cards — generic, honestly-representative scenario photos,
// not claiming to depict this clinic's actual staff/patients/premises.
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Handshake, Stethoscope, FileSignature, Camera, CheckCircle2, CalendarClock, type LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}

const steps: Step[] = [
  {
    icon: Handshake,
    title: "Знакомство",
    description:
      "Первая встреча: обсуждаем ситуацию, ориентировочные варианты, сроки и бюджет. Вы видите клинику и врача — без обязательств и без погружения в детали.",
    image: "/images/methodology/greeting.jpg",
  },
  {
    icon: Stethoscope,
    title: "Диагностика и план",
    description: "Если наш подход откликается — идём глубже: полная диагностика и конкретный план лечения.",
    image: "/images/methodology/diagnosis.jpg",
  },
  {
    icon: FileSignature,
    title: "Согласование",
    description: "Утверждаем детали: визиты, объём работы, документы. Начинаем только когда всё понятно и подтверждено.",
    image: "/images/methodology/agreement.jpg",
  },
  {
    icon: Camera,
    title: "Лечение",
    description: "Каждый этап — с фотопротоколом. Вы всегда знаете, что происходит и почему.",
    image: "/images/methodology/treatment.jpg",
  },
  {
    icon: CheckCircle2,
    title: "Сдача работы",
    description: "Принимаете результат лично — ничего не скрыто.",
    image: "/images/methodology/reveal.jpg",
  },
  {
    icon: CalendarClock,
    title: "Сопровождение",
    description: "Контрольные осмотры после лечения — мы не исчезаем после последнего визита.",
    image: "/images/methodology/followup.jpg",
  },
];

const StepCard = ({ icon: Icon, title, description, image, index }: Step & { index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="relative z-10 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]"
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/10 to-transparent" />
        <span className="absolute top-3 left-4 font-arista-bold text-2xl text-white/60">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute bottom-3 left-4 flex size-9 items-center justify-center rounded-full border border-forest-400/40 bg-primary-900/70 backdrop-blur-sm">
          <Icon size={16} className="text-forest-400" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="mb-2 text-[15px] font-medium text-white">{title}</h3>
        <p className="text-[13px] leading-relaxed text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
};

const MethodologySection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="w-full border-y border-white/6 bg-[#002a27] py-24">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8 lg:px-12">
        <motion.p
          className="section-label mb-3 text-xs font-semibold tracking-[0.15em] text-forest-400 uppercase"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          Подход
        </motion.p>
        <motion.h2
          className="mb-16 font-inter text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Как мы работаем
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <StepCard key={step.title} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
