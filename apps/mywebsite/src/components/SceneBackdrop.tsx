import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery, useReducedMotion } from "../hooks/useMediaQuery";
import { GlobeFallback, NetworkFallback } from "./SceneFallback";

export type SceneProps = {
  compact: boolean;
  reducedMotion: boolean;
  onReady: () => void;
};

// Three.js never ships in the Worker bundle: on the server these are null and the
// dynamic imports are removed as dead code. On the client they load lazily.
const HeroScene = import.meta.env.SSR ? null : lazy(() => import("./three/HeroScene"));
const AmbientScene = import.meta.env.SSR ? null : lazy(() => import("./three/AmbientScene"));

type Status = "idle" | "loading" | "ready" | "unsupported";

export function SceneBackdrop({ variant }: Readonly<{ variant: "hero" | "ambient" }>) {
  const [status, setStatus] = useState<Status>("idle");
  const compact = useMediaQuery("(max-width: 767px)");
  const reducedMotion = useReducedMotion();
  const dimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasWebGL()) {
      setStatus("unsupported");
      return;
    }
    // Let the page paint and hydrate before pulling in three.js.
    const start = () => setStatus((current) => (current === "idle" ? "loading" : current));
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 200);
    return () => clearTimeout(id);
  }, []);

  // Dim the hero scene as the visitor scrolls into the content.
  useEffect(() => {
    if (variant !== "hero") {
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.9), 1);
      if (dimRef.current) {
        dimRef.current.style.opacity = String(progress * 0.72);
      }
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [variant]);

  const Scene = variant === "hero" ? HeroScene : AmbientScene;
  const Fallback = variant === "hero" ? GlobeFallback : NetworkFallback;
  const showScene = Scene && (status === "loading" || status === "ready");

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${status === "ready" ? "opacity-0" : "opacity-100"}`}>
        <Fallback />
      </div>
      {showScene ? (
        <SceneErrorBoundary onError={() => setStatus("unsupported")}>
          <Suspense fallback={null}>
            <div
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: status === "ready" ? (variant === "ambient" ? 0.75 : 1) : 0 }}
            >
              <Scene compact={compact} reducedMotion={reducedMotion} onReady={() => setStatus("ready")} />
            </div>
          </Suspense>
        </SceneErrorBoundary>
      ) : null}
      {variant === "hero" ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgb(4_6_11/0.85),transparent_60%)] max-md:bg-[linear-gradient(to_bottom,rgb(4_6_11/0.2),rgb(4_6_11/0.75)_70%)]" />
          <div ref={dimRef} className="absolute inset-0 bg-void opacity-0" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgb(4_6_11/0.9)_85%)]" />
      )}
    </div>
  );
}

let webGLSupport: boolean | undefined;

function hasWebGL() {
  webGLSupport ??= probeWebGL();
  return webGLSupport;
}

function probeWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch() {
    this.props.onError();
  }

  override render() {
    return this.state.failed ? null : this.props.children;
  }
}
