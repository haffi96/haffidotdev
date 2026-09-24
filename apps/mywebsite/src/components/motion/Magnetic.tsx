import { m, useMotionValue, useSpring } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

/** Pulls its child towards the cursor with a soft spring. Mouse only. */
export function Magnetic({ children, strength = 0.3, className }: Readonly<{ children: ReactNode; strength?: number; className?: string }>) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 });

  function onMove(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType !== "mouse" || !ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.span ref={ref} className={`inline-flex ${className ?? ""}`} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </m.span>
  );
}
