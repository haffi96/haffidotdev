import { useEffect, type ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function Page({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  useSpotlight();

  return (
    <>
      <Nav />
      <main className={`mx-auto w-full max-w-6xl px-3 pt-6 sm:px-6 sm:pt-10 ${className}`}>{children}</main>
      <Footer />
    </>
  );
}

/**
 * One document-level listener that feeds the cursor position into the
 * hovered tile as CSS variables, driving its spotlight and gradient border.
 */
function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) {
      return;
    }

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const tile = (event.target as Element | null)?.closest?.<HTMLElement>(".tile");
      if (!tile) {
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = tile.getBoundingClientRect();
        tile.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        tile.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);
}
