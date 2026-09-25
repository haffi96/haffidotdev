import { useIsomorphicLayoutEffect } from "motion/react";
import { useState, type RefObject } from "react";

/**
 * Content is always SSR-rendered in its final, visible state. Only once we are
 * on the client (before paint) do we "arm" elements that start below the fold,
 * so scroll-reveals never hide content for no-JS visitors or above-the-fold content.
 */
export function useBelowFold(ref: RefObject<Element | null>) {
  const [armed, setArmed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    if (node.getBoundingClientRect().top > window.innerHeight * 0.92) {
      setArmed(true);
    }
  }, []);

  return armed;
}
