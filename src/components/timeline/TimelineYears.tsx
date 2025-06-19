import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface TimelineYearsProps {
  years: number[];
  activeYear: number;
  onYearClick: (year: number) => void;
}

const TimelineYears = ({ years, activeYear, onYearClick }: TimelineYearsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeYearRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState<boolean>(false);
  const [useFullWidth, setUseFullWidth] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Controls for animations
  const lineControls = useAnimation();

  // Generate premium tick marks between years
  const generateTickMarks = (yearIndex: number) => {
    // Create variable-height tick marks with premium styling
    const ticks = [
      <motion.div
        key={`tick-${yearIndex}-1`}
        className="h-1 w-1 rounded-full bg-gray-500/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 * yearIndex, duration: 0.5 }}
      />,
      <motion.div
        key={`tick-${yearIndex}-2`}
        className="h-3 w-px bg-gray-500/30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.1 * yearIndex + 0.05, duration: 0.5 }}
      />,
      <motion.div
        key={`tick-${yearIndex}-3`}
        className="h-5 w-px bg-gray-500/30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.1 * yearIndex + 0.1, duration: 0.5 }}
      />,
      <motion.div
        key={`tick-${yearIndex}-4`}
        className="h-3 w-px bg-gray-500/30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.1 * yearIndex + 0.15, duration: 0.5 }}
      />,
      <motion.div
        key={`tick-${yearIndex}-5`}
        className="h-5 w-px bg-gray-500/30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.1 * yearIndex + 0.2, duration: 0.5 }}
      />,
      <motion.div
        key={`tick-${yearIndex}-6`}
        className="h-3 w-px bg-gray-500/30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.1 * yearIndex + 0.25, duration: 0.5 }}
      />,
      <motion.div
        key={`tick-${yearIndex}-7`}
        className="h-1 w-1 rounded-full bg-gray-500/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 * yearIndex + 0.3, duration: 0.5 }}
      />,
    ];

    return ticks;
  };

  // Handle year click with premium interaction
  const handleYearClick = (year: number, index: number) => {
    if (animating || year === activeYear) return;

    setAnimating(true);
    onYearClick(year);

    // Animate the line to the new position
    lineControls.start({
      left: `${index * (100 / (years.length - 1))}%`,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    });

    // Short delay to prevent rapid clicking
    setTimeout(() => setAnimating(false), 500);
  };

  // Check screen width and number of years to determine layout mode
  useEffect(() => {
    const checkWidth = () => {
      // If we have enough space to show all years comfortably (120px per year including ticks)
      const minWidthNeeded = years.length * (120 + 90);
      setUseFullWidth(window.innerWidth > minWidthNeeded);
    };

    // Initial check
    checkWidth();

    // Add resize listener
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [years]);

  // Scroll to active year when it changes (only in scrollable mode)
  useEffect(() => {
    if (!useFullWidth && activeYearRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = activeYearRef.current;
      const currentIndex = years.findIndex((year) => year === activeYear);

      // Position the line indicator
      lineControls.start({
        left: `${currentIndex * (100 / (years.length - 1))}%`,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      });

      // Calculate the scroll position to center the active year
      const scrollLeft =
        activeElement.offsetLeft - container.clientWidth / 2 + activeElement.clientWidth / 2;

      // Smooth scroll to the position
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeYear, useFullWidth, years, lineControls]);

  // Function to scroll the timeline left or right
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.5; // Scroll by half the container width

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Find the current active year index
  const activeIndex = years.findIndex((year) => year === activeYear);

  return (
    <div className="relative w-full py-12">
      {/* Enhanced navigation arrows with premium styling - only show in scrollable mode */}
      {!useFullWidth && (
        <>
          <motion.div
            className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => handleScroll('left')}
              className="p-3 bg-gray-800/50 hover:bg-gray-700/70 rounded-full text-white border border-white/10 backdrop-blur-sm
                transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Scroll timeline left"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
          </motion.div>

          {/* Right navigation arrow with premium styling */}
          <motion.div
            className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => handleScroll('right')}
              className="p-3 bg-gray-800/50 hover:bg-gray-700/70 rounded-full text-white border border-white/10 backdrop-blur-sm
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Scroll timeline right"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </motion.div>
        </>
      )}

      {/* Premium timeline container with enhanced styling */}
      <div className="relative overflow-hidden mx-4 md:mx-14">
        {/* Gradient fades for premium scrolling effect - only in scrollable mode */}
        {!useFullWidth && (
          <>
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-primary-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-primary-900 to-transparent z-10 pointer-events-none" />
          </>
        )}

        {/* Premium scrolling container */}
        <div
          ref={scrollContainerRef}
          className={`py-4 ${!useFullWidth ? 'overflow-x-auto scrollbar-hide' : 'overflow-visible'}`}
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          {/* Timeline years with premium styling */}
          <div
            className={`flex items-center ${useFullWidth ? 'justify-between w-full' : ''} relative`}
            style={
              !useFullWidth
                ? { minWidth: 'max-content', paddingLeft: '4rem', paddingRight: '4rem' }
                : {}
            }
          >

            {years.map((year, index) => (
              <div
                key={year}
                className="flex items-center"
                style={
                  !useFullWidth
                    ? { minWidth: index < years.length - 1 ? '180px' : '80px' }
                    : { flex: 1 }
                }
              >
                {/* Year marker and label with premium styling */}
                <div
                  ref={year === activeYear ? activeYearRef : null}
                  className="flex flex-col items-center relative"
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <motion.button
                    onClick={() => handleYearClick(year, index)}
                    className={`group flex flex-col items-center focus:outline-none ${
                      year === activeYear ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    disabled={animating || year === activeYear}
                    aria-label={`View ${year} timeline`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Premium animated year number */}
                    <motion.span
                      className={`text-3xl md:text-5xl transition-all duration-300 ${
                        year === activeYear
                          ? 'text-white font-semibold'
                          : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                      initial={false}
                      animate={{
                        opacity: year === activeYear ? 1 : 0.7,
                        y: year === activeYear ? -4 : 0,
                      }}
                    >
                      {year}
                    </motion.span>
                  </motion.button>

                  {/* Premium hover tooltip */}
                  <AnimatePresence>
                    {hoverIndex === index && year !== activeYear && (
                      <motion.div
                        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800/90 text-white
                          text-xs py-1 px-2 rounded backdrop-blur-sm border border-white/10 whitespace-nowrap"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        Перейти к {year} году
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Premium tick marks between years (except after the last year) */}
                {index < years.length - 1 && (
                  <div
                    className="flex justify-evenly items-center"
                    style={useFullWidth ? { flex: 1 } : { width: '100px' }}
                  >
                    {generateTickMarks(index)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium mobile scroll indicator - only in scrollable mode */}
      {!useFullWidth && (
        <motion.div
          className="mt-4 text-center text-gray-400 text-sm md:hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 19L3 12L10 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <span>Проведите для навигации</span>
            <motion.div
              animate={{ x: [5, -5, 5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 5L21 12L14 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TimelineYears;
