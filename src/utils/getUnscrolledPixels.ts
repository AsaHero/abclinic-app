
export const getUnscrolledPixels = (el = null) => {
    // Choose the metric source
    const node = el || document.documentElement;      // <html> for the page
    const top    = node.scrollTop;                    // already scrolled out at the top
    const bottom = node.scrollHeight                  // full content height
                  - node.clientHeight                 // minus the visible window
                  - node.scrollTop;                   // minus what’s scrolled so far
  
    return { top, bottom };
}