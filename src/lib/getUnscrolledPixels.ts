export const getUnscrolledPixels = (el: HTMLElement | null = null) => {
  const node = el || document.documentElement;
  const top = node.scrollTop;
  const bottom = node.scrollHeight - node.clientHeight - node.scrollTop;

  return { top, bottom };
};
