// src/components/timeline/TimelineContent.tsx
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TimelineEntry } from '../../types/timelineData';

interface TimelineContentProps {
  entry: TimelineEntry;
  isFirst: boolean;
  isLast: boolean;
  direction: number;
}

// Text reveal animation component
const RevealText = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={`overflow-hidden ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <motion.div
      initial={{ y: 40 }}
      animate={{ y: 0 }}
      exit={{ y: -40 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  </motion.div>
);

// Premium decorative element
const DecorativeElement = ({ top, left, size = 1, delay = 0 }) => (
  <motion.div
    className="absolute"
    style={{ top, left }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0 }}
    transition={{ duration: 0.8, delay }}
  >
    <motion.div
      className={`w-${size} h-${size} rounded-full bg-white/40`}
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
);

const TimelineContent: React.FC<TimelineContentProps> = ({ entry, isFirst, isLast, direction }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when content changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [entry.year]);

  // Enhanced animation variants for slide transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '10%' : '-10%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '10%' : '-10%',
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <motion.div
      ref={contentRef}
      key={entry.year}
      className="relative w-full overflow-hidden"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      }}
    >
      <div className="relative w-full rounded-xl overflow-hidden group">
        <div className="max-h-[600px] md:max-h-[700px] w-full overflow-hidden">
          {/* Background image container with premium treatment */}
          <div className="relative w-full h-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            {/* Image with enhanced zoom effect */}
            <motion.div
              className="w-full h-full"
              initial={{ scale: 1.05 }}
              animate={{
                scale: [1.05, 1.12, 1.05],
                filter: ['brightness(0.9)', 'brightness(1)', 'brightness(0.9)'],
              }}
              transition={{
                duration: 15,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                times: [0, 0.5, 1],
              }}
            >
              <img
                src={entry.image}
                alt={`${entry.year} - ${entry.title}`}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

            {/* Premium gradient overlays for depth and visual interest */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/40 to-primary-900/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-900/30" />

            {/* Decorative elements positioned strategically */}
            <DecorativeElement top="10%" left="5%" size={2} delay={0.6} />
            <DecorativeElement top="30%" left="80%" size={1} delay={0.8} />
            <DecorativeElement top="70%" left="10%" size={1} delay={1.0} />

            {/* Subtle vignette effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none bg-gradient-radial from-transparent to-primary-900/40" />
          </div>
        </div>

        {/* Premium content container with improved typography */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 md:p-10 lg:p-16">
            <div className="max-w-screen-lg mx-auto">
              <div className="space-y-6">
                {/* Title with premium typography */}
                <RevealText delay={0.3}>
                  <h3 className="text-4xl md:text-6xl font-inter font-bold text-white tracking-tight">
                    {entry.title}
                  </h3>
                </RevealText>

                {/* Enhanced separator line */}
                <motion.div
                  className="h-px bg-gradient-to-r from-white/20 via-white/60 to-white/20 w-0"
                  initial={{ width: 0 }}
                  animate={{ width: '80px' }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />

                {/* Description with improved readability */}
                <RevealText delay={0.5}>
                  <p className="text-lg md:text-xl max-w-2xl font-inter text-gray-100 leading-relaxed">
                    {entry.description}
                  </p>
                </RevealText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineContent;
