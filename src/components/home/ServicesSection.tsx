// src/components/sections/ServicesSection.tsx
import React, { useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

// Service category interface with enhanced fields
interface ServiceCategory {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  services: string[];
  featured?: boolean;
}

// Animated section heading component
const SectionHeading = ({ children }) => {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={headingRef}
      className="relative mb-4"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-white"
        initial={{ y: 40 }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        {children}
      </motion.h2>

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

// Service card component with premium styling
const ServiceCard = ({ category, index, href }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
        <motion.div
      ref={cardRef}
      key={category.id}
      className={`relative overflow-hidden rounded-2xl p-8 flex flex-col min-h-[400px] border border-transparent transition-all duration-500
        ${
          category.featured
            ? 'bg-gradient-to-br from-blue-900/40 via-primary-800 to-primary-900 hover:border-blue-500/30'
            : 'bg-[#1e2329] hover:bg-[#22272e] hover:border-gray-700/30'
        }`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 * index }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      {/* Link */}

      <Link to={href} className="absolute w-full h-full top-0 left-0 z-10" />

      {/* Subtle background patterns for depth */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L100 0 L100 100" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Service icon with premium animation */}
      <motion.div
        className="mb-6 text-white/80"
        animate={isInView ? { scale: [0.5, 1.1, 1], opacity: [0, 1] } : {}}
        transition={{ duration: 0.6, delay: 0.2 * index, times: [0, 0.7, 1] }}
      >
        {category.icon}
      </motion.div>

      {/* Category title with premium styling */}
      <h3 className="text-2xl font-inter font-medium mb-4 text-white">{category.title}</h3>

      {/* Category description */}
      <p className="text-gray-400 mb-6 font-light leading-relaxed">{category.description}</p>

      {/* Featured badge */}
      {category.featured && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
            Популярно
          </span>
        </div>
      )}

      {/* Service list with premium styling */}
      <div className="mt-auto">
        <div className="space-y-2.5">
          {category.services.map((service, idx) => (
            <motion.div
              key={idx}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg py-3 px-4 text-sm
                font-medium transition-all duration-300 cursor-pointer border border-transparent
                hover:border-white/10 flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <CheckCircle size={14} className="mr-2 text-white/60" />
              <span className="text-white/90">{service}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced service categories with more detailed information
const serviceCategories: ServiceCategory[] = [
  {
    id: 'consultation',
    title: 'Консультация и диагностика',
    href: '/services?category=consultation',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 12L11 14L15 10M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    description: 'Проведение первичной консультации и диагностики состояния зубов.',
    services: ['«Первичная консультация»', '«Диагностика зубов»'],
  },
  {
    id: 'hygiene',
    title: 'Гигиена и профилактика',
    href: '/services?category=hygiene',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M17 9.24C16.605 9.725 16.065 10 15.5 10C14.935 10 14.395 9.725 14 9.24M10 9.24C9.605 9.725 9.065 10 8.5 10C7.935 10 7.395 9.725 7 9.24M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    description: 'Профессиональная чистка и поддерживающая гигиена зубов.',
    services: ['«Профессиональная гигиена»', '«Поддерживающая гигиена»'],
    featured: true,
  },
  {
    id: 'restoration',
    title: 'Лечение и восстановление',
    href: '/services?category=treatment',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 3V10H20M20 14V17.5C20 20.5376 16 20.5 16 20.5C16 20.5 8 20.5 8 20.5C8 20.5 4 20.5 4 17.5C4 14.5 4 6 4 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 6C18.5 4.5 16.5 3 14.5 3C12.5 3 11.1063 4 11 6C10.8937 8 12 10 16 10C20 10 20.5 14 18.5 16C16.5 18 13 16.5 13 14.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    description:
      'Стоматологическое лечение и восстановление формы и функции зубов с помощью непрямой и керамической реставрации.',
    services: ['«Непрямая реставрация»', '«Керамическая реставрация»'],
    featured: true,
  },
  {
    id: 'aesthetic',
    title: 'Эстетическая стоматология',
    href: '/services?category=aesthetic',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 12H4.5M4.5 12H7.5M4.5 12V5M7.5 12H10.5M7.5 12V5M10.5 12H13.5M10.5 12V5M13.5 12H16.5M13.5 12V5M16.5 12H19.5M16.5 12V5M19.5 12H22M19.5 12V5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    description: 'Эстетические процедуры для создания гармоничной и привлекательной улыбки.',
    services: ['Профессиональное отбеливание', 'Профессиональное отбеливание'],
  },
];

const ServicesSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-primary-900 text-white w-full relative overflow-hidden"
    >
      {/* Premium background elements */}
      <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

      {/* Animated gradient accent */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        {/* Premium section heading */}
        <div className="mb-16 md:mb-20">
          <SectionHeading>Услуги клиники</SectionHeading>

          <motion.p
            className="text-lg text-gray-400 max-w-2xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Наша клиника предлагает полный спектр стоматологических услуг, используя передовые
            технологии и материалы премиального качества.
          </motion.p>
        </div>

        {/* Enhanced service cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {serviceCategories.map((category, index) => (
            <ServiceCard key={category.id} category={category} index={index} href={category.href} />
          ))}
        </motion.div>

        {/* Premium CTA button */}
        <div className="flex justify-center mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link
              to="/services"
              className="relative group flex items-center overflow-hidden bg-white text-primary-900 hover:bg-gray-100
                rounded-full font-inter px-8 py-4 text-lg transition-all duration-300"
            >
              <span className="mr-2">Полный прайс</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
              >
                <ArrowRight size={18} />
              </motion.div>

              {/* Animated highlight effect */}
              <motion.div
                className="absolute inset-0 bg-white/30 -z-10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
