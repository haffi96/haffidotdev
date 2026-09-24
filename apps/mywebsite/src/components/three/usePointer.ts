import { useEffect, useRef } from "react";

/**
 * Normalised pointer position (-1..1) tracked on the window, so the canvas can stay
 * `pointer-events: none` and never swallow clicks or touch scrolling.
 */
export function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointer;
}
