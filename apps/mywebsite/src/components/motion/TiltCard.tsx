import { m, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

/** 3D hover tilt with a soft glare that follows the cursor. Mouse only. */
export function TiltCard({ children, className }: Readonly<{ children: ReactNode; className?: string }>) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springConfig = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), springConfig);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.18), transparent 45%)`;

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <m.div
      className={`group relative [transform-style:preserve-3d] ${className ?? ""}`}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glare }}
      />
    </m.div>
  );
}
