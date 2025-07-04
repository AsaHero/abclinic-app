
export const getHiddenPixels = (el, scope = null) => {
    // Choose the coordinate system
    const container = scope || document.documentElement; // <html> for viewport
  
    const elRect       = el.getBoundingClientRect();
    const containerRect = scope
        ? scope.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };
  
    // Pixels above the visible area
    const topHidden = Math.max(0, containerRect.top - elRect.top);
  
    // Pixels below the visible area
    const bottomHidden = Math.max(0, elRect.bottom - containerRect.bottom);
  
    return { top: topHidden, bottom: bottomHidden };
}

  