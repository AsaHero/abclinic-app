// src/components/sections/HeroSection.tsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';

// Split text animation helper component
const SplitText = ({ text, className, delay = 0 }) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        className={className}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.1, 0, 1],
          delay: delay,
        }}
      >
        {text}
      </motion.div>
    </div>
  );
};

const SplitTextOutline = ({ text, className, delay = 0 }) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <div
      className={className}
      style={{
        WebkitTextStroke: '2px white',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-opacity duration-300 ${
            index < visibleChars ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

// Floating accent component
const FloatingAccent = ({ x, y, delay, size = 4, color = 'bg-white' }) => (
  <motion.div
    className={`absolute w-${size} h-${size} ${color} opacity-20 rounded-full blur-sm`}
    style={{ x, y }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.8, 0] }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      repeatType: 'reverse',
    }}
  />
);

function translateValueWithConstraints<T>(
  value: MotionValue<number>,
  input: number[],
  output: T[]
): MotionValue<T> {
  return useTransform(value, input, output);
}
const HeroSection = () => {
  const sectionRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Enhanced parallax effect setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentOpacity = translateValueWithConstraints(scrollYProgress, [0, 0.7], [1, 0]);
  const contentScale = translateValueWithConstraints(scrollYProgress, [0, 0.7], [1, 0.95]);
  const blur = translateValueWithConstraints(scrollYProgress, [0, 0.7], [0, 5]);

  // Handle mouse movement for subtle parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Trigger mount animations after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Smooth scroll to next section
  const scrollToNext = () => {
    const nextSection = document.getElementById('timeline-section');
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-primary-900">
      {/* Decorative elements */}
      <FloatingAccent x={-20} y={100} delay={0.5} size={16} color="bg-blue-400" />
      <FloatingAccent x={200} y={-150} delay={2} size={12} color="bg-white" />
      <FloatingAccent x={-200} y={200} delay={3.5} size={10} color="bg-indigo-300" />

      {/* Background with enhanced parallax effect */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          y: backgroundY,
          filter: `blur(${blur}px)`,
        }}
      >
        <div className="relative w-full h-full">
          {/* Hero background with premium treatment */}
          <div
            className="absolute inset-0 bg-cover bg-center w-full h-full"
            style={{ backgroundImage: `url('/images/hero.png')` }}
          />

          {/* Enhanced gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-primary-900/50" />
        </div>
      </motion.div>

      {/* Subtle animated overlay pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat opacity-5 mix-blend-soft-light" />

      {/* Content container with enhanced animation */}
      <motion.div
        className="relative h-full w-full z-10"
        style={{
          opacity: contentOpacity,
          scale: contentScale,
        }}
      >
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <div className="max-w-4xl text-center">
            {/* Enhanced staggered animation for content */}
            <motion.div className="flex flex-col items-center gap-6">
              {/* Premium tag line */}
              <motion.div
                className="mb-4 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
              ></motion.div>

              {/* Title with enhanced reveal animation */}
              <SplitTextOutline
                text="abclinic"
                className="text-5xl md:text-8xl lg:text-9xl font-arista-regular mb-2 mt-8 tracking-normal"
                delay={0.2}
              />

              {/* Enhanced subtitle with reveal animation */}
              <SplitText
                text="cоздай историю"
                className="text-xl md:text-4xl lg:text-5xl font-arista-extralight my-8 text-white/90 tracking-wide"
                delay={0.3}
              />

              {/* Description text */}
              <motion.p
                className="max-w-xl text-base md:text-lg font-light text-white/70 mb-8 leading-relaxed flex "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                abclinic.uz — семейная стоматология, вдохновлённая природой, где мы объединяем
                наследие трёх поколений, цифровые технологии и минимализм в каждой детали.
              </motion.p>

              {/* Enhanced CTA Button group */}
              <motion.div
                className="flex flex-col w-full sm:flex-row gap-4 items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  asChild
                  className="bg-white hover:bg-white/90 text-primary-900 rounded-full w-1/2 sm:w-1/3 px-6 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg group overflow-hidden relative"
                >
                  <Link to="/contacts" className="flex items-center gap-2 ">
                    <span>Записаться</span>
                    <motion.div className="relative" initial={{ x: 0 }} whileHover={{ x: 5 }}>
                      <ArrowRight size={18} className="stroke-2" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border border-white/30 text-white bg-transparent hover:bg-white/10 rounded-full w-1/2 sm:w-1/3 py-6 text-base font-medium backdrop-blur-sm"
                >
                  <Link to="/services">Наши услуги</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator with premium animation */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            onClick={scrollToNext}
            className="group flex flex-col items-center justify-center space-y-2 cursor-pointer"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <span className="text-white/60 text-sm font-light tracking-wider group-hover:text-white/90 transition-colors">
              Наша история
            </span>
            <motion.div
              className="w-[1px] h-10 bg-white/30 origin-top"
              animate={{ scaleY: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
