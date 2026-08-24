"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { timelineData } from "@/types/timelineData";
import BookingButton from "@/components/common/BookingButton";

// The gallery is a CSS 3D transform gallery driven by browser measurements and
// pointer events — it can't run on the server, and there's no meaningful SSR
// content to render for it anyway (the real text version of the history is the
// section below the fold).
const InfiniteGallery = dynamic(() => import("@/components/ui/3d-gallery-photography"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-primary-900 text-white/50 text-sm">
      Загрузка галереи…
    </div>
  ),
});

const galleryImages = timelineData.map((entry) => ({
  src: entry.image,
  alt: `${entry.year} — ${entry.title}`,
}));

export default function HistoryPageBody() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = timelineData[activeIndex] ?? timelineData[0];

  return (
    <div className="bg-primary-900 text-white">
      {/* Immersive 3D gallery hero */}
      <div className="relative h-screen w-full overflow-hidden">
        <InfiniteGallery
          images={galleryImages}
          speed={1}
          visibleCount={timelineData.length}
          blurSettings={{
            blurIn: { start: 0.0, end: 0.1 },
            blurOut: { start: 0.4, end: 0.43 },
            maxBlur: 4.0,
          }}
          className="h-screen w-full"
          onActiveIndexChange={setActiveIndex}
        />

        {/* Page title */}
        <div className="pointer-events-none fixed inset-x-0 top-12 z-10 flex flex-col items-center text-center px-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-2">История клиники</p>
          <h1 className="font-arista-regular text-4xl md:text-6xl">abclinic.uz</h1>
        </div>

        {/* Live-synced year/event label */}
        <div className="pointer-events-none fixed inset-x-0 bottom-28 z-10 flex flex-col items-center text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.year}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-5xl md:text-7xl font-arista-light">{active.year}</p>
              <p className="mt-2 max-w-md text-sm md:text-base text-white/70">{active.title}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pointer-events-none fixed bottom-8 left-0 right-0 text-center font-mono uppercase text-[11px] font-semibold text-white/40">
          <p>Прокрутите колесо мыши или используйте стрелки</p>
        </div>
      </div>

      {/* Full readable history — real content for accessibility/SEO and for
          anyone who'd rather read than scroll through the 3D gallery. */}
      <div className="max-w-screen-md mx-auto px-4 md:px-8 py-24">
        <h2 className="text-3xl md:text-4xl font-arista-light mb-4">Путь клиники</h2>
        <p className="text-gray-400 mb-16">
          Три поколения одной семьи в стоматологии — от самодельной установки в 1936 году до
          цифровой диагностики и имплантологии сегодня.
        </p>

        <div className="space-y-16">
          {timelineData.map((entry) => (
            <div key={entry.year} className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
              <p className="font-arista-light text-4xl md:text-5xl text-forest-400 md:w-32">{entry.year}</p>
              <div>
                <h3 className="text-xl font-medium mb-2">{entry.title}</h3>
                <p className="text-gray-400 leading-relaxed">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-4">
          <BookingButton className="inline-flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-medium px-6 py-3 rounded-full transition-colors">
            Записаться на консультацию
          </BookingButton>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-full transition-colors"
          >
            О клинике
          </Link>
        </div>
      </div>
    </div>
  );
}
