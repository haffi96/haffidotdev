import type { CSSProperties, ReactNode } from "react";

type TileProps = Readonly<{
  children: ReactNode;
  className?: string;
  /** Stagger index for the entrance animation. */
  index?: number;
  /** Adds the hover lift used by clickable tiles. */
  interactive?: boolean;
  as?: "div" | "section" | "article" | "aside" | "header";
}>;

export function Tile({ children, className = "", index = 0, interactive = false, as: Tag = "div" }: TileProps) {
  return (
    <Tag
      className={`tile ${interactive ? "tile-link group" : ""} ${className}`}
      style={{ "--i": index } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

export function Chip({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="chip">{children}</span>;
}

/** Turns the "( Typescript, NextJS ) =>" frontmatter format into a list. */
export function parseTechstack(techstack: string) {
  return techstack
    .replace(/=>\s*$/, "")
    .replace(/[()]/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
