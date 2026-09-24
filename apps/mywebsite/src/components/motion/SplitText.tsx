import type { CSSProperties } from "react";

type SplitTextProps = Readonly<{
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Words (exact match) to render in the accent serif style. */
  emphasis?: string[];
}>;

/**
 * Staggered, masked word reveal. Driven by CSS keyframes so it plays from the
 * very first SSR paint (no hydration wait) and falls back to static text for
 * reduced-motion users.
 */
export function SplitText({ text, className, wordClassName = "", delay = 0, stagger = 0.06, emphasis = [] }: SplitTextProps) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, index) => {
        const emphasised = emphasis.includes(word);
        const style = { animationDelay: `${delay + index * stagger}s` } as CSSProperties;
        return (
          <span key={`${word}-${index}`} aria-hidden="true">
            <span className="split-mask">
              <span
                className={`split-word ${wordClassName} ${emphasised ? "font-display font-normal text-accent italic" : ""}`}
                style={style}
              >
                {word}
              </span>
            </span>
            {index < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </span>
  );
}
