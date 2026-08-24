"use client";

// src/components/home/Carousel.tsx
//
// Shared embla-carousel shell (mechanics only) for the two homepage
// carousels — ValueShiftSection and FitSection each bring their own slide
// visuals via `slides`, this just handles drag/autoplay/dots/arrows.
// Follows the embla-carousel-react + embla-carousel-autoplay pattern
// already established in components/services/CenteredCarousel.tsx.
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  slides: ReactNode[];
  slideClassName?: string;
}

const Carousel = ({
  slides,
  slideClassName = "flex-[0_0_82%] sm:flex-[0_0_360px]",
}: CarouselProps) => {
  const autoplayRef = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true, stopOnMouseEnter: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    autoplayRef.current,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {slides.map((slide, i) => (
            <div key={i} className={slideClassName}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Слайд ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedIndex ? "w-6 bg-forest-400" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            aria-label="Предыдущий слайд"
            className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Следующий слайд"
            className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
