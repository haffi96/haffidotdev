import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function Page({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main id="content" className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
