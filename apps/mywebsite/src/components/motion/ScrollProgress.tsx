import { m, useScroll, useSpring } from "motion/react";

/** Thin accent bar pinned to the top of the viewport that tracks page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
