// hooks/useScrollLock.ts
import { useEffect, useRef } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * Useful for modals, drawers, or any overlay components
 */
export const useScrollLock = (isLocked: boolean) => {
  const scrollPositionRef = useRef<number>(0);
  const isLockedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isLocked && !isLockedRef.current) {
      // Lock scroll
      scrollPositionRef.current = window.scrollY;
      isLockedRef.current = true;
      
      // Apply styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      
    } else if (!isLocked && isLockedRef.current) {
      // Unlock scroll
      const scrollY = scrollPositionRef.current;
      isLockedRef.current = false;
      
      // Remove styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }

    // Cleanup function
    return () => {
      if (isLockedRef.current) {
        const scrollY = scrollPositionRef.current;
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
        });
        
        isLockedRef.current = false;
      }
    };
  }, [isLocked]);

  // Return current lock status
  return isLockedRef.current;
};