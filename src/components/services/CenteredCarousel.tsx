// src/components/CenteredCarousel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Check } from 'lucide-react';
import { serviceCategories, requiresConsultation } from '@/types/serviceData';

interface CarouselItemProps {
  service: any;
  isActive: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ service, isActive }) => {
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

      <Link
        to={`/services/${service.id}`}
        className={`block p-6 h-full flex flex-col ${service.isSpecialOffer && 'relative z-10'}`}
        aria-label={`Подробнее о услуге: ${service.name}`}
        onClick={(e) => {
          // Only allow navigation when clicking on the active item
          if (!isActive) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
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
            Подробнее
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
      </Link>
    </motion.div>
  );
};

interface CenteredCarouselProps {
  popularServices: any[];
  isNewClient: boolean;
}

// CSS for hiding scrollbars
const hideScrollbarStyles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const CenteredCarousel: React.FC<CenteredCarouselProps> = ({ popularServices, isNewClient }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(400); // Default, will be updated
  const [cardMargin, setCardMargin] = useState(32); // Default gap between cards
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const isTransitioning = useRef(false);

  // Add global styles to hide scrollbars and add gradient border animation
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      ${hideScrollbarStyles}

      /* Rotating gradient border animation */
      @keyframes rotate-gradient {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Calculate and update container and card dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (carouselContainerRef.current) {
        const containerRect = carouselContainerRef.current.getBoundingClientRect();
        setContainerWidth(containerRect.width);

        // Adjust card width based on container width
        const isMobile = containerRect.width < 640;
        setCardWidth(isMobile ? 340 : 400);
      }
    };

    // Initial calculation
    updateDimensions();

    // Recalculate on window resize
    window.addEventListener('resize', updateDimensions);

    // Set mounted flag after a slight delay for animations
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 100);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  // Reset active index when services change
  useEffect(() => {
    setActiveIndex(0);
  }, [popularServices]);

  // Handle autoplay
  useEffect(() => {
    if (isPaused || popularServices.length <= 1 || isTransitioning.current) return;

    const startAutoplay = () => {
      autoplayTimerRef.current = setInterval(() => {
        handleNextItem();
      }, 5000);
    };

    startAutoplay();

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPaused, popularServices.length]);

  // Pause autoplay on hover/drag
  useEffect(() => {
    setIsPaused(isHovering || isDragging);
  }, [isHovering, isDragging]);

  // Get the modulo that works correctly with negative numbers
  const mod = (n: number, m: number): number => {
    return ((n % m) + m) % m;
  };

  // Get the actual index considering infinite looping
  const getRealIndex = (index: number): number => {
    return mod(index, Math.max(1, popularServices.length));
  };

  // Handle next/prev item navigation
  const handleNextItem = () => {
    if (popularServices.length <= 1 || isTransitioning.current) return;
    setActiveIndex((prev) => getRealIndex(prev + 1));
  };

  const handlePrevItem = () => {
    if (popularServices.length <= 1 || isTransitioning.current) return;
    setActiveIndex((prev) => getRealIndex(prev - 1));
  };

  // Get the array of items to display with proper infinite scrolling
  const getDisplayItems = () => {
    if (!popularServices.length) return [];
    if (popularServices.length === 1) return [...popularServices];

    // Create a wrapping effect by adding items from both ends
    // This creates a natural infinite scrolling effect
    const itemsToWrap = Math.min(2, popularServices.length);

    // Get wrap-around items from end to prepend
    const wrappedBefore = popularServices.slice(-itemsToWrap);

    // Get wrap-around items from beginning to append
    const wrappedAfter = popularServices.slice(0, itemsToWrap);

    // Return the complete wrapped array with all items
    return [...wrappedBefore, ...popularServices, ...wrappedAfter];
  };

  // Calculate the visual index in our display array
  const getDisplayIndex = (index: number): number => {
    if (popularServices.length <= 1) return 0;

    // Add wrapping offset to account for the prepended items
    const itemsToWrap = Math.min(2, popularServices.length);
    return getRealIndex(index) + itemsToWrap;
  };

  // Calculate position for the carousel to center active item
  const getCarouselTransform = () => {
    if (!containerWidth || popularServices.length === 0) return { transform: 'translateX(0)' };

    // If only one item, center it
    if (popularServices.length === 1) {
      const centerOffset = (containerWidth - cardWidth) / 2;
      return { transform: `translateX(${centerOffset}px)` };
    }

    // For multiple items, calculate position to center the active one
    const totalWidth = cardWidth + cardMargin;
    const centerOffset = (containerWidth - cardWidth) / 2;

    // Use the display index which includes our wrapped items
    const displayIndex = getDisplayIndex(activeIndex);
    const activeOffset = displayIndex * totalWidth;

    return {
      transform: `translateX(${centerOffset - activeOffset}px)`,
    };
  };

  // Determine if an item is active
  const isItemActive = (index: number): boolean => {
    if (popularServices.length <= 1) return index === 0;

    // Get the target index in our display array
    const targetIndex = getDisplayIndex(activeIndex);
    return index === targetIndex;
  };

  // Mouse/Touch event handlers
  const handleDragStart = (clientX: number) => {
    if (isTransitioning.current) return;

    setIsDragging(true);
    dragStartX.current = clientX;
    dragCurrentX.current = clientX;

    // Clear autoplay during dragging
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    dragCurrentX.current = clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    // Calculate drag distance and direction
    const dragDistance = dragCurrentX.current - dragStartX.current;

    // Only change slide if drag was significant enough
    if (Math.abs(dragDistance) > 80 && popularServices.length > 1) {
      if (dragDistance > 0) {
        handlePrevItem();
      } else {
        handleNextItem();
      }
    }

    setIsDragging(false);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Don't render if no services
  if (!popularServices || popularServices.length === 0) {
    return null;
  }

  // Determine if navigation controls should be shown
  const showNavigation = popularServices.length > 1;

  // Get the display items with proper wrapping
  const displayItems = getDisplayItems();

  // The wrapping offset - number of items added before the original array
  const wrappingOffset = Math.min(2, popularServices.length);

  return (
    <div
      className="relative w-full py-10 overflow-hidden"
      ref={carouselContainerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation controls - left arrow */}
      {showNavigation && (
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: isHovering ? 1 : 0,
            x: isHovering ? 0 : -20,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={handlePrevItem}
            className="p-3 rounded-full bg-[#252A32]/80 backdrop-blur-sm hover:bg-[#353A42]/80 transition-all text-white shadow-lg"
            aria-label="Предыдущая услуга"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
        </motion.div>
      )}

      {/* Main carousel container */}
      <div className="relative h-[470px] overflow-hidden" style={{ touchAction: 'pan-y' }}>
        <motion.div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex no-scrollbar"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          animate={getCarouselTransform()}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
            onStart: () => {
              isTransitioning.current = true;
            },
            onComplete: () => {
              isTransitioning.current = false;
            },
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {displayItems.map((service, index) => {
            // Calculate the original index in the popularServices array
            let originalIndex;
            if (index < wrappingOffset) {
              // It's a wrapped item from the end
              originalIndex = popularServices.length - wrappingOffset + index;
            } else if (index >= wrappingOffset + popularServices.length) {
              // It's a wrapped item from the beginning
              originalIndex = index - wrappingOffset - popularServices.length;
            } else {
              // It's a regular item from the original array
              originalIndex = index - wrappingOffset;
            }

            return (
              <motion.div
                key={`${service.id}-${index}`}
                className="flex-shrink-0 px-4"
                onClick={(e) => {
                  if (!isDragging && !isTransitioning.current) {
                    if (isItemActive(index)) {
                      // If clicking on active item, do nothing - let the Link handle navigation
                      return;
                    } else {
                      // If clicking on non-active item, prevent default navigation and just scroll
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveIndex(originalIndex);
                    }
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={hasMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(0.1 * index, 0.4),
                }}
              >
                <CarouselItem service={service} isActive={isItemActive(index)} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Navigation controls - right arrow */}
      {showNavigation && (
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: isHovering ? 1 : 0,
            x: isHovering ? 0 : 20,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={handleNextItem}
            className="p-3 rounded-full bg-[#252A32]/80 backdrop-blur-sm hover:bg-[#353A42]/80 transition-all text-white shadow-lg"
            aria-label="Следующая услуга"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </motion.div>
      )}

      {/* Pagination indicators - only show if multiple services */}
      {showNavigation && (
        <div className="flex justify-center mt-6 space-x-2">
          {popularServices.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Перейти к услуге ${index + 1}`}
              className="relative h-2 rounded-full overflow-hidden"
              initial={{ width: 8 }}
              animate={{
                width: index === getRealIndex(activeIndex) ? 24 : 8,
                backgroundColor: index === getRealIndex(activeIndex) ? '#3B82F6' : '#4B5563',
              }}
              whileHover={{
                width: index === getRealIndex(activeIndex) ? 24 : 16,
                backgroundColor: index === getRealIndex(activeIndex) ? '#3B82F6' : '#6B7280',
              }}
              transition={{ duration: 0.3 }}
            >
              {index === getRealIndex(activeIndex) && (
                <motion.div
                  className="absolute inset-0 bg-blue-400/50"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 5, // Match autoplay timer
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
