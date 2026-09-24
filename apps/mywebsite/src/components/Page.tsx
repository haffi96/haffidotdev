import type { ReactNode } from "react";
import { DesktopIcons } from "./DesktopIcons";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function Page({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-ph-yellow px-3 py-2 font-bold text-[#151515] focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Nav />
      <DesktopIcons />
      <main id="main" className={`mx-auto w-full max-w-[1100px] flex-1 px-3 pt-5 sm:px-5 sm:pt-8 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
