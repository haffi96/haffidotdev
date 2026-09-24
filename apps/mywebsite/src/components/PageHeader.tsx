import type { ReactNode } from "react";
import { Tile } from "./Tile";

export function PageHeader({
  eyebrow,
  title,
  children,
  aside
}: Readonly<{ eyebrow: string; title: ReactNode; children?: ReactNode; aside?: ReactNode }>) {
  return (
    <Tile
      as="header"
      className="flex flex-col justify-between gap-6 p-6 sm:p-8 md:col-span-2 md:flex-row md:items-end lg:col-span-4"
    >
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h1>
        {children ? <p className="mt-4 text-[15px] leading-relaxed text-fg-2">{children}</p> : null}
      </div>
      {aside}
    </Tile>
  );
}
