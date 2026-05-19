import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function Page({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <>
      <Nav />
      <main className={className}>{children}</main>
      <Footer />
    </>
  );
}
