import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { SceneBackdrop } from "./SceneBackdrop";
import { NetworkFallback } from "./SceneFallback";

type Backdrop = "hero" | "ambient" | "static";

export function Page({
  children,
  className = "",
  backdrop = "static"
}: Readonly<{ children: ReactNode; className?: string; backdrop?: Backdrop }>) {
  return (
    <>
      {backdrop === "static" ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[40rem] overflow-hidden">
          <NetworkFallback />
        </div>
      ) : (
        <SceneBackdrop variant={backdrop} />
      )}
      <Nav />
      <main className={`relative z-10 ${className}`}>{children}</main>
      <Footer />
    </>
  );
}

export function PageHeader({ eyebrow, title, children }: Readonly<{ eyebrow: string; title: ReactNode; children?: ReactNode }>) {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-32 pb-10 sm:px-8 md:pt-40 md:pb-14">
      <p className="eyebrow motion-safe:animate-rise">{eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance text-white motion-safe:animate-rise sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {children ? <div className="mt-5 max-w-2xl text-base text-mist motion-safe:animate-rise md:text-lg">{children}</div> : null}
    </header>
  );
}
