"use client";

// src/components/home/ServicesSection.tsx
import React, { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ServiceCategory {
  id: string;
  title: string;
  href: string;
  image: string;
  description: string;
  featured?: boolean;
}

// Animated section heading component
const SectionHeading = ({ children }: { children: ReactNode }) => {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={headingRef}
      className="relative mb-4"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-white"
        initial={{ y: 40 }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        {children}
      </motion.h2>

      {/* Premium animated underline */}
      <motion.div
        className="h-px w-0 bg-gradient-to-r from-white/5 via-white/80 to-white/5 mt-4"
        initial={{ width: 0 }}
        animate={isInView ? { width: "140px" } : { width: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.div>
  );
};

// Real photos, not decorative stock — see comments per category below for
// why each was picked. Hover-expand panel: collapsed panels show just the
// title, the one under the pointer grows and reveals the description.
const serviceCategories: ServiceCategory[] = [
  {
    id: "restoration",
    title: "Восстановление зуба накладками",
    href: "/services?category=treatment",
    image: "/images/gallery/nakladki-group.jpg",
    description:
      "Керамические накладки (onlay/overlay) вместо коронки — сохраняем максимум собственной ткани зуба.",
    featured: true,
  },
  {
    id: "consultation",
    title: "Консультация и диагностика",
    href: "/services?category=consultation",
    image: "/images/headers/consultation-header.jpg",
    description: "Проведение первичной консультации и диагностики состояния зубов.",
  },
  {
    id: "hygiene",
    title: "Гигиена и профилактика",
    href: "/services?category=hygiene",
    // sterilization.jpg, not hygiene-header.jpg — that one's a real
    // before-cleaning close-up (blood, plaque), fine in the context of a
    // service detail page but too graphic for a homepage thumbnail.
    image: "/images/gallery/sterilization.jpg",
    description: "Профессиональная чистка и поддерживающая гигиена зубов.",
  },
  {
    id: "aesthetic",
    title: "Эстетическая стоматология",
    href: "/services?category=aesthetic",
    image: "/images/gallery/nakladki-estetics.png",
    description: "Эстетические процедуры для создания гармоничной и привлекательной улыбки.",
  },
];

const GalleryPanel = ({ category, index }: { category: ServiceCategory; index: number }) => {
  const panelRef = useRef(null);
  const isInView = useInView(panelRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className="group relative h-40 w-full overflow-hidden rounded-2xl md:h-full md:w-auto md:flex-[1.2] md:transition-[flex] md:duration-500 md:ease-out md:hover:flex-[3.5]"
    >
      <Link href={category.href} className="absolute inset-0 z-10" aria-label={category.title} />

      <Image
        src={category.image}
        alt={category.title}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className="object-cover transition-transform duration-700 md:group-hover:scale-105"
      />

      {/* Scrim — darker at rest so the title always reads, deepens further on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-500 md:group-hover:from-black/90" />

      {category.featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center rounded-full bg-forest-500/20 px-2.5 py-0.5 text-xs font-medium text-forest-200 backdrop-blur-sm">
            Популярно
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
        <h3 className="font-inter text-lg leading-tight font-medium text-white md:text-xl">{category.title}</h3>

        {/* Description is always shown on mobile (no hover there) — only
            collapsed-until-hover on desktop, where the panel itself expands. */}
        <div className="mt-2 grid grid-rows-[1fr] opacity-100 transition-all duration-500 md:mt-0 md:grid-rows-[0fr] md:opacity-0 md:group-hover:mt-3 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100">
          <div className="overflow-hidden">
            <p className="text-sm leading-relaxed text-white/70">{category.description}</p>
            <span className="mt-3 hidden items-center gap-1.5 text-sm font-medium text-white md:inline-flex">
              Подробнее
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-primary-900 text-white w-full relative overflow-hidden"
    >
      {/* Premium background elements */}
      <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

      {/* Animated gradient accent */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-forest-500/5 blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        {/* Premium section heading */}
        <div className="mb-16 md:mb-20">
          <SectionHeading>Услуги клиники</SectionHeading>

          <motion.p
            className="text-lg text-gray-400 max-w-2xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Мы не про «полный спектр для всех» — мы специализируемся на
            одном: восстановление и лечение зубов непрямыми керамическими
            накладками, светлые естественные улыбки. Не ставим брекеты,
            мосты и металлокерамику — но закрываем почти любой случай,
            кроме тех, где нужна эндодонтия.
          </motion.p>
        </div>

        {/* Stacked cards on mobile (no hover there); hover-expand gallery from md+ */}
        <div className="flex flex-col gap-3 md:h-[480px] md:flex-row md:items-stretch">
          {serviceCategories.map((category, index) => (
            <GalleryPanel key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* Premium CTA button */}
        <div className="flex justify-center mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link
              href="/services"
              className="relative group flex items-center overflow-hidden bg-white text-primary-900 hover:bg-gray-100
                rounded-full font-inter px-8 py-4 text-lg transition-all duration-300"
            >
              <span className="mr-2">Полный прайс</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <ArrowRight size={18} />
              </motion.div>

              {/* Animated highlight effect */}
              <motion.div
                className="absolute inset-0 bg-white/30 -z-10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
