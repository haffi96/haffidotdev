import type { ReactNode } from "react";

export function Page({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return <main className={`relative ${className}`}>{children}</main>;
}
