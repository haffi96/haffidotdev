import { m, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ease } from "./MotionProvider";
import { useBelowFold } from "./useBelowFold";

type RevealProps = Readonly<{
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article";
}>;

export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const armed = useBelowFold(ref);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const hidden = armed && !inView;
  const Component = m[as] as typeof m.div;

  return (
    <Component
      ref={ref}
      className={className}
      initial={false}
      animate={hidden ? "hidden" : "shown"}
      variants={{
        hidden: { opacity: 0, y, transition: { duration: 0 } },
        shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay } }
      }}
    >
      {children}
    </Component>
  );
}
