// src/components/utils/ScrollManager.tsx
import { useEffect } from 'react';

const ScrollManager = () => {
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    let isScrolling = false;
    let lastScrollPosition = window.scrollY;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;

        // Clear any existing timeout
        clearTimeout(scrollTimer);

        // Set a new timeout to detect when scrolling stops
        scrollTimer = setTimeout(() => {
          const currentPosition = window.scrollY;
          const heroSection = document.querySelector('section'); // First section is hero
          const timelineSection = document.getElementById('timeline-section');

          if (!heroSection || !timelineSection) return;

          const heroHeight = heroSection.offsetHeight;
          const timelineTop = timelineSection.offsetTop;

          // If we're between sections (not fully in one or the other)
          if (currentPosition > 100 && currentPosition < timelineTop - 100) {
            // Determine direction by comparing with last position
            if (currentPosition > lastScrollPosition) {
              // Scrolling down - go to timeline
              timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              // Scrolling up - go to hero
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }

          lastScrollPosition = currentPosition;
          isScrolling = false;
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ScrollManager;
