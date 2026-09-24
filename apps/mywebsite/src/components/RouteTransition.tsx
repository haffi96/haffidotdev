import { useRouterState } from "@tanstack/react-router";
import { m } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { ease } from "./motion/MotionProvider";

/**
 * Cross-route transition. The first (SSR) render is static so nothing depends on
 * hydration; subsequent client navigations fade and lift the incoming page in.
 */
export function RouteTransition({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return (
    // Keyed so each route remounts and plays its entrance. TanStack's <Outlet /> swaps
    // content synchronously, so an exit animation would show the *new* page twice.
    <m.div
      key={pathname}
      initial={firstRender.current ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease } }}
    >
      {children}
    </m.div>
  );
}
