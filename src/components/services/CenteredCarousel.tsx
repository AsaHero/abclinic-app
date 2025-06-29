// First, install the required dependencies:
// npm install embla-carousel-react embla-carousel-autoplay

// src/components/CenteredCarousel.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Check } from 'lucide-react';
import { serviceCategories, requiresConsultation } from '@/types/serviceData';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface CarouselItemProps {
  service: any;
  isActive: boolean;
  onClick: () => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ service, isActive, onClick }) => {
  if (!service) return null;

  // Find category safely with optional chaining
  const categoryTitle = service?.category
    ? serviceCategories.find((cat) => cat.id === service.category)?.title || 'Без категории'
    : 'Без категории';

  // Check if service requires consultation
  const needsConsultation = requiresConsultation(service);

  // Define animation variants
  const itemVariants = {
    active: {
      scale: 1,
      opacity: 1,
      zIndex: 10,
      transition: { duration: 0.4, type: 'spring', stiffness: 300, damping: 20 },
    },
    inactive: {
      scale: 0.85,
      opacity: 0.6,
      zIndex: 0,
      transition: { duration: 0.4, type: 'spring', stiffness: 300, damping: 20 },
    },
    hover: {
      scale: isActive ? 1.03 : 0.88,
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="
        relative
        w-[340px] sm:w-[400px]
        h-[400px] sm:h-[420px]
        transition-all
        bg-gradient-to-br from-[#1E2329] to-[#252A32]
        rounded-xl shadow-lg
        flex-shrink-0
        overflow-hidden
      "
      initial="inactive"
      animate={isActive ? 'active' : 'inactive'}
      whileHover="hover"
      variants={itemVariants}
    >
      {/* Subtle gradient overlay when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Animated highlight border when active */}
      {isActive && !service.isSpecialOffer && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-blue-400/30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Special gradient border for special offers with animation */}
      {service.isSpecialOffer && (
        <div className="absolute inset-0 rounded-xl z-0 overflow-hidden">
          <div
            className="absolute -inset-[100%] bg-gradient-to-r from-amber-500 via-pink-500 to-violet-500"
            style={{
              animation: 'rotate-gradient 3s linear infinite',
            }}
          />
          <div className="absolute inset-[2px] rounded-lg bg-gradient-to-br from-[#1E2329] to-[#252A32]" />
        </div>
      )}

      <div
        className={`block p-6 h-full flex flex-col cursor-pointer ${service.isSpecialOffer && 'relative z-10'}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (isActive) {
            // If active, navigate to service page
            window.location.href = `/services/${service.id}`;
          } else {
            // If not active, just make it active
            onClick();
          }
        }}
        aria-label={isActive ? `Подробнее о услуге: ${service.name}` : `Выбрать услугу: ${service.name}`}
      >
        <div className="mb-4">
          <motion.span
            className="text-gray-400 text-sm block mb-1 flex items-center"
            animate={isActive ? { color: '#94A3B8' } : { color: '#6B7280' }}
          >
            <Clock size={14} className="mr-2" />
            {service.duration}
          </motion.span>
          <motion.h3
            className="text-xl font-medium text-white mb-2"
            animate={
              isActive
                ? { fontSize: '1.5rem', lineHeight: '2rem' }
                : { fontSize: '1.25rem', lineHeight: '1.75rem' }
            }
            transition={{ duration: 0.3 }}
          >
            {service.name}
          </motion.h3>
          {service.price && (
            <motion.span
              className="text-blue-400 font-semibold text-lg"
              animate={
                isActive
                  ? { fontSize: '1.25rem', opacity: 1 }
                  : { fontSize: '1.125rem', opacity: 0.8 }
              }
              transition={{ duration: 0.3 }}
            >
              {typeof service.price === 'number'
                ? `${service.price.toLocaleString('ru-RU')} сум`
                : `${service.price} сум`}
            </motion.span>
          )}
        </div>

        {/* Info section - equal height regardless of content */}
        <div className="flex-grow flex flex-col">
          <AnimatePresence>
            {isActive && (
              <motion.p
                className="text-gray-300 mb-6 text-sm flex-grow overflow-hidden line-clamp-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {service.description}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isActive && (
              <motion.div
                className="flex flex-wrap gap-2 mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {service.popular && (
                  <motion.span
                    className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
                  >
                    Популярно
                  </motion.span>
                )}

                {service.isSpecialOffer && (
                  <motion.span
                    className="text-xs px-2 py-0.5 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-violet-500/20 text-pink-400 rounded-full"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(236, 72, 153, 0.3)' }}
                  >
                    Спецпредложение
                  </motion.span>
                )}

                {service.includesConsultation && (
                  <motion.span
                    className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full flex items-center"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 197, 94, 0.3)' }}
                  >
                    <Check size={10} className="mr-1" />
                    Включает консультацию
                  </motion.span>
                )}

                {needsConsultation && !service.includesConsultation && (
                  <motion.span
                    className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full flex items-center"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(249, 115, 22, 0.3)' }}
                  >
                    <AlertCircle size={10} className="mr-1" />
                    Требуется консультация
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <motion.span
            className="text-xs px-3 py-1 bg-white/10 rounded-full text-gray-300"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          >
            {categoryTitle}
          </motion.span>
          <motion.span
            className="text-blue-400 font-medium text-sm flex items-center group"
            whileHover={{ x: 3 }}
          >
            {isActive ? 'Подробнее' : 'Выбрать'}
            <motion.svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.span>
        </div>

        {/* Animated accent circle */}
        {isActive && (
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          />
        )}
      </div>
    </motion.div>
  );
};

interface CenteredCarouselProps {
  popularServices: any[];
  isNewClient: boolean;
}

const CenteredCarousel: React.FC<CenteredCarouselProps> = ({ popularServices, isNewClient }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: false });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  // For infinite loop, we need to create enough slides
  // We'll duplicate the services array to ensure smooth infinite scrolling
  const duplicatedServices = React.useMemo(() => {
    if (popularServices.length === 0) return [];
    
    // Create enough copies for smooth infinite loop
    const copies = Math.max(3, Math.ceil(20 / popularServices.length));
    const result = [];
    
    for (let i = 0; i < copies; i++) {
      result.push(...popularServices);
    }
    
    return result;
  }, [popularServices]);

  // Autoplay plugin configuration
  const autoplayRef = useRef(
    Autoplay({ 
      delay: 5000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: true,
      stopOnLastSnap: false
    })
  );

  // Main carousel setup with proper infinite loop
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true, // Enable native loop
      align: 'center',
      skipSnaps: false,
      dragFree: false,
      slidesToScroll: 1,
      startIndex: Math.floor(duplicatedServices.length / 2), // Start in middle
    },
    [autoplayRef.current]
  );

  // Map carousel index to original service index
  const getServiceIndex = useCallback((emblaIndex: number) => {
    if (popularServices.length === 0) return 0;
    return emblaIndex % popularServices.length;
  }, [popularServices.length]);

  // Update selected index when carousel changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(getServiceIndex(currentIndex));
  }, [emblaApi, getServiceIndex]);

  // Setup carousel event listeners
  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Handle mounted state for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Add global styles
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* Rotating gradient border animation */
      @keyframes rotate-gradient {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      /* Embla specific styles for centered carousel */
      .embla {
        overflow: hidden;
      }
      
      .embla__container {
        display: flex;
      }
      
      .embla__slide {
        flex: 0 0 auto;
        min-width: 0;
        margin-right: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* Responsive card widths */
      @media (min-width: 640px) {
        .embla__slide {
          flex: 0 0 400px;
        }
      }
      
      @media (max-width: 639px) {
        .embla__slide {
          flex: 0 0 340px;
        }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((targetServiceIndex: number) => {
    if (!emblaApi) return;
    
    // Find the closest slide to current position with the target service
    const currentSlide = emblaApi.selectedScrollSnap();
    const currentServiceIndex = getServiceIndex(currentSlide);
    
    // Calculate direction to minimize distance
    let targetSlide;
    if (targetServiceIndex > currentServiceIndex) {
      // Going forward
      const stepsForward = targetServiceIndex - currentServiceIndex;
      const stepsBackward = (currentServiceIndex + popularServices.length) - targetServiceIndex;
      
      if (stepsForward <= stepsBackward) {
        targetSlide = currentSlide + stepsForward;
      } else {
        targetSlide = currentSlide - stepsBackward;
      }
    } else if (targetServiceIndex < currentServiceIndex) {
      // Going backward
      const stepsBackward = currentServiceIndex - targetServiceIndex;
      const stepsForward = (targetServiceIndex + popularServices.length) - currentServiceIndex;
      
      if (stepsBackward <= stepsForward) {
        targetSlide = currentSlide - stepsBackward;
      } else {
        targetSlide = currentSlide + stepsForward;
      }
    } else {
      // Same service, no need to move
      return;
    }
    
    emblaApi.scrollTo(targetSlide);
  }, [emblaApi, getServiceIndex, popularServices.length]);

  // Handle card click
  const handleCardClick = useCallback((slideIndex: number) => {
    const serviceIndex = getServiceIndex(slideIndex);
    scrollTo(serviceIndex);
  }, [getServiceIndex, scrollTo]);

  // Hover handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    if (autoplayRef.current) {
      autoplayRef.current.stop();
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (autoplayRef.current) {
      autoplayRef.current.play();
    }
  }, []);

  // Don't render if no services
  if (!popularServices || popularServices.length === 0) {
    return null;
  }

  const showNavigation = popularServices.length > 1;

  return (
    <div
      className="relative w-full py-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation controls - left arrow */}
      {showNavigation && (
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: isHovering ? 1 : 0,
            x: isHovering ? 0 : -20,
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          <motion.button
            onClick={scrollPrev}
            className="pointer-events-auto p-3 rounded-full bg-[#252A32]/80 backdrop-blur-sm hover:bg-[#353A42]/80 transition-all text-white shadow-lg"
            aria-label="Предыдущая услуга"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleMouseEnter}
          >
            <ChevronLeft size={24} />
          </motion.button>
        </motion.div>
      )}

      {/* Main carousel container */}
      <div className="embla h-[470px] py-5" ref={emblaRef}>
        <div className="embla__container">
          {duplicatedServices.map((service, slideIndex) => {
            const serviceIndex = getServiceIndex(slideIndex);
            const isActive = selectedIndex === serviceIndex;

            return (
              <div key={`${service.id}-${slideIndex}`} className="embla__slide">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={hasMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(0.1 * serviceIndex, 0.4),
                  }}
                >
                  <CarouselItem 
                    service={service} 
                    isActive={isActive}
                    onClick={() => handleCardClick(slideIndex)}
                  />
                  
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation controls - right arrow */}
      {showNavigation && (
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: isHovering ? 1 : 0,
            x: isHovering ? 0 : 20,
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          <motion.button
            onClick={scrollNext}
            className="pointer-events-auto p-3 rounded-full bg-[#252A32]/80 backdrop-blur-sm hover:bg-[#353A42]/80 transition-all text-white shadow-lg"
            aria-label="Следующая услуга"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleMouseEnter}
          >
            <ChevronRight size={24} />
          </motion.button>
        </motion.div>
      )}

      {/* Pagination indicators */}
      {showNavigation && (
        <div className="flex justify-center mt-6 space-x-2">
          {popularServices.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Перейти к услуге ${index + 1}`}
              className="relative h-2 rounded-full overflow-hidden"
              initial={{ width: 8 }}
              animate={{
                width: index === selectedIndex ? 24 : 8,
                backgroundColor: index === selectedIndex ? '#3B82F6' : '#4B5563',
              }}
              whileHover={{
                width: index === selectedIndex ? 24 : 16,
                backgroundColor: index === selectedIndex ? '#3B82F6' : '#6B7280',
              }}
              transition={{ duration: 0.3 }}
            >
              {index === selectedIndex && (
                <motion.div
                  className="absolute inset-0 bg-blue-400/50"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatDelay: 0,
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CenteredCarousel;