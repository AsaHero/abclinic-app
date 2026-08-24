"use client";

// src/components/home/BeforeAfterSection.tsx
//
// "До и после" — real case photos, grouped by category tabs in the
// patient's own language ("Чистые зубы", "Кариес", "Восстановление",
// "Ровные зубы") rather than the price-list's clinical categories, per
// the owner's explicit request — adapted from a tabbed-carousel reference
// he shared, re-themed to the site's forest palette and rebuilt on real
// data instead of stock Unsplash photos.
//
// Data comes from getBeforeAfterCases(), which aggregates every service's
// beforeAfterImages from the DB (see lib/services/queries.ts) — only
// entries an admin has explicitly tagged with one of the four categories
// show up here, so new real cases appear automatically once tagged,
// nothing hardcoded. Renders nothing if there are no tagged cases at all;
// never fabricate before/after photos for a medical business.
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { BEFORE_AFTER_CATEGORIES, type BeforeAfterCategory } from "@/types/serviceData";
import type { BeforeAfterCase } from "@/lib/services/queries";

const AUTOPLAY_INTERVAL_MS = 4500;
const RESUME_AFTER_INTERACTION_MS = 6000;

const CaseCard = ({
  item,
  onExpand,
  cardRef,
}: {
  item: BeforeAfterCase;
  onExpand: (showAfter: boolean) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}) => {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div
      ref={cardRef}
      onClick={() => onExpand(showAfter)}
      className="group relative aspect-[4/3] w-[82%] shrink-0 snap-start cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-primary-800 sm:w-[360px]"
    >
      <Image
        src={showAfter ? item.after : item.before}
        alt={showAfter ? `${item.serviceName} — после` : `${item.serviceName} — до`}
        fill
        sizes="(max-width: 640px) 82vw, 360px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-3 left-3 flex rounded-full bg-black/60 p-0.5 backdrop-blur-sm"
      >
        <button
          onClick={() => setShowAfter(false)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !showAfter ? "bg-white text-primary-900" : "text-white/80 hover:text-white"
          }`}
        >
          До
        </button>
        <button
          onClick={() => setShowAfter(true)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            showAfter ? "bg-white text-primary-900" : "text-white/80 hover:text-white"
          }`}
        >
          После
        </button>
      </div>

      {item.description && (
        <p className="absolute right-3 bottom-3 left-24 line-clamp-2 text-right text-[11px] leading-snug text-white/60">
          {item.description}
        </p>
      )}
    </div>
  );
};

const EmptyTab = () => (
  <div className="flex h-[240px] w-full items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-gray-500">
    Скоро добавим примеры по этой категории
  </div>
);

const BeforeAfterSection = ({ cases }: { cases: BeforeAfterCase[] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set right before any scrollIntoView we trigger ourselves (arrows, dots,
  // autoplay). The scroll listener below fires many times mid-animation as
  // a smooth scroll plays out — without this, its debounced readout can
  // land on an in-flight scrollLeft and stomp the correct index we already
  // set synchronously. When this is non-null the listener trusts it instead
  // of recomputing from a possibly mid-transition scroll position.
  const programmaticTargetRef = useRef<number | null>(null);

  const [activeTab, setActiveTab] = useState<BeforeAfterCategory>(BEFORE_AFTER_CATEGORIES[0]);
  const [modal, setModal] = useState<{ index: number; showAfter: boolean } | null>(null);
  const [current, setCurrent] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  const tabCases = cases.filter((c) => c.category === activeTab);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    setCurrent(0);
    programmaticTargetRef.current = null;
  }, [activeTab]);

  // Tracks which card the user has manually scrolled/dragged to, so the dot
  // indicator stays correct even without clicking an arrow or dot. Based on
  // scroll position relative to card spacing rather than "most visible"
  // intersection — on desktop the track is wide enough to show more than
  // one full card at once, so an intersection-ratio comparison ties between
  // neighbors and never settles on the one actually scrolled to.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || tabCases.length < 2) return;

    let debounceId: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        if (programmaticTargetRef.current !== null) {
          setCurrent(programmaticTargetRef.current);
          programmaticTargetRef.current = null;
          return;
        }
        // Near the end, scrollWidth - clientWidth is less than the last
        // card's offsetLeft, so the browser clamps scrollLeft below what
        // scrollLeft/step would need to land on the true last index —
        // treat "at max scroll" as an explicit case rather than dividing.
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScrollLeft - 2) {
          setCurrent(tabCases.length - 1);
          return;
        }
        const first = cardRefs.current[0];
        const second = cardRefs.current[1];
        if (!first || !second) return;
        const step = second.offsetLeft - first.offsetLeft;
        const index = Math.round(track.scrollLeft / step);
        setCurrent(Math.max(0, Math.min(tabCases.length - 1, index)));
      }, 120);
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      clearTimeout(debounceId);
    };
  }, [tabCases.length, activeTab]);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    programmaticTargetRef.current = index;
    // scrollIntoView({inline:"start"}) asks the browser to left-align the
    // card, but for the last one or two cards that position exceeds the
    // track's actual max scrollLeft — the browser clamps it, which used to
    // leave the last card unreachable. Clamping the target ourselves means
    // we always ask for a position that's really reachable.
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: Math.min(card.offsetLeft, maxScrollLeft), behavior: "smooth" });
  }, []);

  const pauseThenResume = useCallback(() => {
    setAutoplayPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setAutoplayPaused(false), RESUME_AFTER_INTERACTION_MS);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(index);
      scrollToIndex(index);
      pauseThenResume();
    },
    [scrollToIndex, pauseThenResume]
  );

  // Relative step (prev/next arrows) — reads the *latest* current index via
  // React's functional update form rather than the value closed over at
  // render time, so two rapid clicks each advance one card instead of both
  // computing the same "next" from a stale value and only moving once.
  const step = useCallback(
    (delta: 1 | -1) => {
      setCurrent((prev) => {
        const next = (prev + delta + tabCases.length) % tabCases.length;
        scrollToIndex(next);
        return next;
      });
      pauseThenResume();
    },
    [tabCases.length, scrollToIndex, pauseThenResume]
  );

  // Autoplay — advances to the next card on a timer, but only while the
  // section is on screen, more than one card exists, and nothing paused it
  // (hover, touch, or a manual interaction in the last few seconds).
  useEffect(() => {
    if (!isInView || autoplayPaused || tabCases.length < 2) return;
    const id = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % tabCases.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isInView, autoplayPaused, tabCases.length, scrollToIndex]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  if (cases.length === 0) return null;

  const openModal = (index: number, showAfter: boolean) => setModal({ index, showAfter });
  const closeModal = () => setModal(null);
  const stepModal = (dir: 1 | -1) => {
    if (!modal) return;
    const next = (modal.index + dir + tabCases.length) % tabCases.length;
    setModal({ index: next, showAfter: false });
  };

  const modalCase = modal ? tabCases[modal.index] : null;

  return (
    <section className="w-full border-y border-white/6 bg-[#002a27] py-20 md:py-24">
      <div ref={ref} className="mx-auto max-w-screen-2xl px-4 md:px-8 lg:px-12">
        <motion.p
          className="mb-3 text-xs font-semibold tracking-[0.15em] text-forest-400 uppercase"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Реальные случаи
        </motion.p>
        <motion.h2
          className="mb-8 font-inter text-2xl font-bold text-white md:text-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          До и после
        </motion.h2>

        <motion.div
          className="mb-8 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {BEFORE_AFTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === cat
                  ? "bg-forest-500 text-white"
                  : "border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {tabCases.length === 0 ? (
            <EmptyTab />
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setAutoplayPaused(true)}
              onMouseLeave={() => setAutoplayPaused(false)}
              onTouchStart={pauseThenResume}
            >
              <div
                ref={trackRef}
                className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none" }}
              >
                {tabCases.map((c, i) => (
                  <CaseCard
                    key={`${c.before}-${c.after}`}
                    item={c}
                    onExpand={(showAfter) => openModal(i, showAfter)}
                    cardRef={(el) => {
                      cardRefs.current[i] = el;
                    }}
                  />
                ))}
              </div>

              {/* Explicit affordance that there's more to see — arrows plus
                  a position count, not just a partial-card peek that's easy
                  to miss. */}
              {tabCases.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Предыдущий случай"
                    className="absolute top-1/2 -left-2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-primary-900/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary-900 sm:flex md:-left-4"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Следующий случай"
                    className="absolute top-1/2 -right-2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-primary-900/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary-900 sm:flex md:-right-4"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <div className="mt-5 flex items-center justify-center gap-2">
                    {tabCases.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Случай ${i + 1} из ${tabCases.length}`}
                        aria-current={i === current}
                        className={`h-1.5 rounded-full transition-all ${
                          i === current ? "w-6 bg-forest-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {modalCase &&
        createPortal(
          // Portaled to <body> — <main> carries z-10 for the sticky-footer
          // reveal (see (public)/layout.tsx), which caps everything
          // rendered inside it below the header's z-50 regardless of its
          // own z-index. Portaling escapes that stacking context.
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-8"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              aria-label="Закрыть"
              className="absolute top-6 right-6 z-50 flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>

          {tabCases.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stepModal(-1);
                }}
                aria-label="Предыдущий случай"
                className="absolute left-4 z-50 flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 md:left-10"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stepModal(1);
                }}
                aria-label="Следующий случай"
                className="absolute right-4 z-50 flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 md:right-10"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-[85vh] max-w-3xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] max-h-[70vh] w-full overflow-hidden rounded-2xl">
              <Image
                src={modal!.showAfter ? modalCase.after : modalCase.before}
                alt={modal!.showAfter ? "После" : "До"}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <div className="mt-5 flex items-center gap-1 rounded-full bg-white/5 p-0.5">
              <button
                onClick={() => setModal({ ...modal!, showAfter: false })}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  !modal!.showAfter ? "bg-white text-primary-900" : "text-white/80 hover:text-white"
                }`}
              >
                До
              </button>
              <button
                onClick={() => setModal({ ...modal!, showAfter: true })}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  modal!.showAfter ? "bg-white text-primary-900" : "text-white/80 hover:text-white"
                }`}
              >
                После
              </button>
            </div>
            {modalCase.description && (
              <p className="mt-3 max-w-lg text-center text-sm text-gray-400">{modalCase.description}</p>
            )}
          </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default BeforeAfterSection;
