import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { useBelowFold } from "./useBelowFold";

/**
 * Renders the final value on the server; on the client, values that start
 * below the fold count up from zero once they scroll into view.
 * Accepts strings like "<200ms", "15M" or "10,000s".
 */
export function Counter({ value, className }: Readonly<{ value: string; className?: string }>) {
  const ref = useRef<HTMLSpanElement>(null);
  const armed = useBelowFold(ref);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const match = value.match(/^(\D*)([\d,.]+)(.*)$/);

  useEffect(() => {
    const node = ref.current;
    if (!armed || !match || !node) {
      return;
    }
    const [, prefix = "", digits = "0", suffix = ""] = match;
    const target = Number(digits.replace(/,/g, ""));
    const format = (n: number) => `${prefix}${digits.includes(",") ? Math.round(n).toLocaleString("en-GB") : Math.round(n)}${suffix}`;

    if (!inView) {
      node.textContent = format(0);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest);
      }
    });
    return () => controls.stop();
  }, [armed, inView]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {value}
    </span>
  );
}
