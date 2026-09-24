import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("./features").then((mod) => mod.default);

export const ease = [0.22, 1, 0.36, 1] as const;
export const spring = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
