// src/components/timeline/Timeline.tsx - New Structure
import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TimelineEntry } from '../../types/timelineData';
import TimelineYears from './TimelineYears';

interface TimelineProps {
  entries: TimelineEntry[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

// Individual Timeline Item that stays in DOM
const TimelineItem = ({
  entry,
  index,
  activeIndex,
  totalItems
}: {
  entry: TimelineEntry;
  index: number;
  activeIndex: number;
  totalItems: number;
}) => {
  const isActive = index === activeIndex;
  const offset = index - activeIndex;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      animate={{
        x: `${offset * 100}%`,
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.95,
        zIndex: isActive ? 10 : 1,
      }}
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      }}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden group">
        <div className="max-h-[600px] md:max-h-[700px] w-full overflow-hidden">
          {/* Background image container */}
          <div className="relative w-full h-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">

            {/* Image with enhanced zoom effect - NEVER UNMOUNTS */}
            <motion.div
              className="w-full h-full"
              animate={isActive ? {
                scale: [1.05, 1.12, 1.05],
                filter: ['brightness(0.9)', 'brightness(1)', 'brightness(0.9)'],
              } : {
                scale: 1.05,
                filter: 'brightness(0.9)'
              }}
              transition={{
                duration: 15,
                ease: 'easeInOut',
                repeat: isActive ? Infinity : 0,
                repeatType: 'reverse',
                times: [0, 0.5, 1],
              }}
            >
              <img
                src={entry.image}
                alt={`${entry.year} - ${entry.title}`}
                className="w-full h-full object-cover object-center"
                loading={index <= 1 ? "eager" : "lazy"}
                style={{
                  // Keep image loaded even when not active
                  visibility: 'visible',
                  position: 'relative'
                }}
              />
            </motion.div>

            {/* Premium gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/40 to-primary-900/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-900/30" />

            {/* Decorative elements */}
            {isActive && (
              <>
                <motion.div
                  className="absolute w-2 h-2 rounded-full bg-white/40"
                  style={{ top: '10%', left: '5%' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <motion.div
                    className="w-full h-full rounded-full bg-white/40"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(255,255,255,0.2)',
                        '0 0 20px rgba(255,255,255,0.4)',
                        '0 0 0px rgba(255,255,255,0.2)',
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                  />
                </motion.div>

                <motion.div
                  className="absolute w-1 h-1 rounded-full bg-white/40"
                  style={{ top: '30%', left: '80%' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />

                <motion.div
                  className="absolute w-1 h-1 rounded-full bg-white/40"
                  style={{ top: '70%', left: '10%' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                />
              </>
            )}

            {/* Hover vignette */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none bg-gradient-radial from-transparent to-primary-900/40" />
          </div>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 md:p-10 lg:p-16">
            <div className="max-w-screen-lg mx-auto">
              <div className="space-y-6">
                {/* Title with reveal animation */}
                <motion.div
                  className="overflow-hidden"
                  animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.h3
                    className="text-4xl md:text-6xl font-inter font-bold text-white tracking-tight"
                    animate={isActive ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.1, 0, 1],
                      delay: isActive ? 0.3 : 0,
                    }}
                  >
                    {entry.title}
                  </motion.h3>
                </motion.div>

                {/* Separator line */}
                <motion.div
                  className="h-px bg-gradient-to-r from-white/20 via-white/60 to-white/20"
                  animate={isActive ? { width: '80px', opacity: 1 } : { width: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay: isActive ? 0.5 : 0 }}
                />

                {/* Description */}
                <motion.div
                  className="overflow-hidden"
                  animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.p
                    className="text-lg md:text-xl max-w-2xl font-inter text-gray-100 leading-relaxed"
                    animate={isActive ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.1, 0, 1],
                      delay: isActive ? 0.5 : 0,
                    }}
                  >
                    {entry.description}
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Timeline = ({ entries, activeIndex, setActiveIndex }: TimelineProps) => {
  const [direction, setDirection] = useState<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressControls = useAnimation();

  const activeYear = entries[activeIndex]?.year || entries[0].year;

  const handleYearClick = (year: number) => {
    const currentIndex = entries.findIndex((entry) => entry.year === activeYear);
    const selectedIndex = entries.findIndex((entry) => entry.year === year);

    setDirection(selectedIndex > currentIndex ? 1 : -1);
    setActiveIndex(selectedIndex);

    if (timelineRef.current && window.innerWidth < 1680) {
      timelineRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const progress = activeIndex / (entries.length - 1);
    progressControls.start({ scaleX: progress, transition: { duration: 0.6 } });
  }, [activeIndex, entries.length, progressControls]);

  return (
    <div ref={timelineRef} className="timeline-container w-full">
      {/* Progress indicator */}
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

      {/* Content container - ALL IMAGES STAY IN DOM */}
      <div className="w-full overflow-hidden">
        <div className="relative w-full h-[400px] md:h-[600px]">
          {entries.map((entry, index) => (
            <TimelineItem
              key={entry.year} // This key won't cause unmounting since we're not using AnimatePresence
              entry={entry}
              index={index}
              activeIndex={activeIndex}
              totalItems={entries.length}
            />
          ))}
        </div>
      </div>

      {/* Navigation dots for mobile */}
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

      {/* Year counter */}
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