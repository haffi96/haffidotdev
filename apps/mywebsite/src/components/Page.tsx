import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function Page({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 bg-phos px-3 py-2 font-mono text-xs text-ink-950 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className={`mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
