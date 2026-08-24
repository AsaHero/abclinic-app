export const getHiddenPixels = (el: Element, scope: Element | null = null) => {
  const elRect = el.getBoundingClientRect();
  const containerRect = scope
    ? scope.getBoundingClientRect()
    : { top: 0, bottom: window.innerHeight };

  const topHidden = Math.max(0, containerRect.top - elRect.top);
  const bottomHidden = Math.max(0, elRect.bottom - containerRect.bottom);

  return { top: topHidden, bottom: bottomHidden };
};
