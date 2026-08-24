"use client";

// src/components/home/GalleryStripSection.tsx
//
// A curated taste, not the museum — the full filterable/lightbox gallery
// lives on /about#gallery. Five real photos, no interaction beyond a link out.
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const photos = [
  { src: "/images/gallery/abclinic-night.jpg", alt: "Клиника вечером", className: "row-span-2" },
  { src: "/images/gallery/white-cab.jpg", alt: "Кабинет" },
  { src: "/images/gallery/sterilization.jpg", alt: "Стерилизация" },
  { src: "/images/gallery/nakladki-estetics.png", alt: "Эстетика лечения" },
  { src: "/images/gallery/oda.jpg", alt: "Международный проект" },
];

const GalleryStripSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="w-full bg-primary-900 py-20 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <motion.h2
            className="font-inter text-2xl font-bold text-white md:text-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Клиника изнутри
          </motion.h2>
          <Link href="/about#gallery" className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white">
            Смотреть все фото
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile: horizontal swipe strip (a cramped 3-col grid reads as tiny slivers below md).
            Desktop: the asymmetric grid. */}
        <motion.div
          className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:hidden md:px-0"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {photos.map((photo) => (
            <div
              key={photo.src}
              className="relative h-[220px] w-[70vw] shrink-0 snap-start overflow-hidden rounded-2xl"
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="70vw" className="object-cover" />
            </div>
          ))}
        </motion.div>

        <motion.div
          className="hidden h-[420px] grid-cols-3 grid-rows-2 gap-4 md:grid"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {photos.map((photo) => (
            <div key={photo.src} className={`relative overflow-hidden rounded-2xl ${photo.className ?? ""}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GalleryStripSection;
