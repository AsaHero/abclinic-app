// src/components/timeline/Timeline.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { TimelineEntry } from '../../types/timelineData';
import TimelineYears from './TimelineYears';
import TimelineContent from './TimelineContent';

interface TimelineProps {
  entries: TimelineEntry[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const Timeline = ({ entries, activeIndex, setActiveIndex }: TimelineProps) => {
  const [direction, setDirection] = useState<number>(0); // -1 for left, 1 for right, 0 for initial
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressControls = useAnimation();

  // Convert index to year and year to index
  const activeYear = entries[activeIndex]?.year || entries[0].year;

  const handleYearClick = (year: number) => {
    const currentIndex = entries.findIndex((entry) => entry.year === activeYear);
    const selectedIndex = entries.findIndex((entry) => entry.year === year);

    // Determine animation direction
    setDirection(selectedIndex > currentIndex ? 1 : -1);
    setActiveIndex(selectedIndex);

    // Auto-scroll to timeline if needed
    if (timelineRef.current && window.innerWidth < 1680) {
      setIsAutoScrolling(true);
      timelineRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Reset scrolling flag after animation
      setTimeout(() => setIsAutoScrolling(false), 800);
    }
  };

  // Navigation functions with direction setting
  const handlePrevious = () => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < entries.length - 1) {
      setDirection(1);
      setActiveIndex(activeIndex + 1);
    }
  };

  // Update progress bar when active year changes
  useEffect(() => {
    const progress = activeIndex / (entries.length - 1);
    progressControls.start({ scaleX: progress, transition: { duration: 0.6 } });
  }, [activeIndex, entries.length, progressControls]);

  // Get current entry info
  const activeEntry = entries[activeIndex] || entries[0];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === entries.length - 1;

  return (
    <div ref={timelineRef} className="timeline-container w-full">
      {/* Premium progress indicator */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 mb-6">
        <div className="relative h-[2px] bg-white/10 w-full">
          <motion.div
            className="absolute top-0 left-0 h-full bg-white/40 origin-left"
            animate={progressControls}
            initial={{ scaleX: 0 }}
          />
        </div>
      </div>

      {/* Timeline years navigation */}
      <div className="w-full mb-16 md:mb-20">
        <TimelineYears
          years={entries.map((entry) => entry.year)}
          activeYear={activeYear}
          onYearClick={handleYearClick}
        />
      </div>

      {/* Content with enhanced animation */}
      <div className="w-full overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <TimelineContent
            key={activeYear}
            entry={activeEntry}
            isFirst={isFirst}
            isLast={isLast}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Premium navigation dots for mobile */}
      <div className="md:hidden flex justify-center mt-10 space-x-1.5">
        {entries.map((entry, index) => (
          <motion.button
            key={entry.year}
            onClick={() => setActiveIndex(index)}
            className="relative"
            aria-label={`Go to year ${entry.year}`}
            initial={{ opacity: 0.5, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />

            {index === activeIndex && (
              <motion.div
                layoutId="activeDot"
                className="absolute inset-0 w-2 h-2 rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3 }}
                style={{ opacity: 0.5, filter: 'blur(2px)' }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Premium year counter */}
      <div className="hidden md:flex justify-end items-center max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 mt-10">
        <div className="text-sm text-white/60 font-light">
          <span className="text-white/90 font-medium">{activeIndex + 1}</span>
          <span className="mx-1">/</span>
          <span>{entries.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
