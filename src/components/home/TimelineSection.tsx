// src/components/sections/TimelineSection.tsx
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Timeline from '../timeline/Timeline';
import { timelineData } from '../../types/timelineData';

// Premium animated heading component
const AnimatedHeading = ({ children, delay = 0, className = '' }) => {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={headingRef}
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={isInView ? { y: 0 } : {}}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0, 1],
          delay,
        }}
      >
        {children}
      </motion.div>

      {/* Premium animated underline */}
      <motion.div
        className="h-px w-0 bg-gradient-to-r from-white/5 via-white/80 to-white/5 mt-4"
        initial={{ width: 0 }}
        animate={isInView ? { width: '140px' } : { width: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.div>
  );
};

// Animated paragraph component
const AnimatedParagraph = ({ children, delay = 0, className = '' }) => {
  const paragraphRef = useRef(null);
  const isInView = useInView(paragraphRef, { once: true, amount: 0.5 });

  return (
    <motion.p
      ref={paragraphRef}
      className={className}
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.p>
  );
};

// Glowing dot animation for background
const GlowingDots = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const TimelineSection = () => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Enhanced parallax and scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Transform values based on scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const containerOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const containerScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.98, 1, 1, 0.98]);

  // Section visibility detection for animation triggers
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Auto-advance the timeline
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timelineData.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      id="timeline-section"
      ref={sectionRef}
      className="py-32 md:py-40 bg-primary-900 text-white w-full overflow-hidden relative"
      style={{
        opacity: containerOpacity,
        scale: containerScale,
      }}
    >
      {/* Background elements */}
      <GlowingDots />

      {/* Subtle moving gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-transparent to-primary-900/0"
        style={{ y: backgroundY }}
      />

      {/* Premium section content */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 md:mb-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20">
          <AnimatedHeading className="mb-10 md:mb-0">
            <h2 className="text-4xl md:text-6xl font-inter font-bold">История клиники</h2>
          </AnimatedHeading>

          <AnimatedParagraph
            className="md:max-w-md text-lg md:text-xl font-inter text-gray-300 leading-relaxed"
            delay={0.3}
          >
            Погружение в историю стоматологии от ее древних корней до современных достижений.
          </AnimatedParagraph>
        </div>
      </div>

      {/* Enhanced Timeline Component */}
      <motion.div
        className="w-full max-w-screen-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={isSectionInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Timeline
          entries={timelineData}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </motion.div>

      {/* Premium section footer with decorative elements */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 mt-20">
        <motion.div
          className="relative h-px"
          initial={{ opacity: 0 }}
          animate={isSectionInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {/* Decorative animated line */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />

          {/* Base line */}
          <div className="absolute inset-0 bg-white/10" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TimelineSection;
