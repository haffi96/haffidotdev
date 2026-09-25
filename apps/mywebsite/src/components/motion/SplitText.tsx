import type { CSSProperties } from "react";

export type SplitSegment = string | Readonly<{ text: string; className?: string }>;

type SplitTextProps = Readonly<{
  /** Plain strings are split into words; objects stay together and keep their className (e.g. a highlighter span). */
  segments: SplitSegment[];
  delay?: number;
  stagger?: number;
}>;

/**
 * Staggered word reveal for headlines. Driven by CSS keyframes so it plays from
 * the very first SSR paint (no hydration wait, no invisible SSR HTML). Reduced-motion
 * users get static text via the media query in styles.css.
 */
export function SplitText({ segments, delay = 0.05, stagger = 0.055 }: SplitTextProps) {
  const words = segments.flatMap((segment) =>
    typeof segment === "string" ? segment.split(" ").filter(Boolean).map((text) => ({ text, className: "" })) : [{ text: segment.text, className: segment.className ?? "" }]
  );
  const fullText = words.map((word) => word.text).join(" ");

  return (
    <>
      <span className="sr-only">{fullText}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word.text}-${index}`}>
            <span className="split-word" style={{ animationDelay: `${delay + index * stagger}s` } as CSSProperties}>
              <span className={word.className}>{word.text}</span>
            </span>
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}
