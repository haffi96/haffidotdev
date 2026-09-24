import type { ReactNode } from "react";

export function Panel({
  label,
  meta,
  children,
  className = "",
  bodyClassName = ""
}: Readonly<{
  label?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}>) {
  return (
    <section className={`corners relative min-w-0 border border-line ${className}`}>
      {label || meta ? (
        <header className="flex items-center justify-between gap-3 border-b border-line px-3 py-2 sm:px-4">
          <span className="hud-label truncate text-zinc-400">{label}</span>
          {meta ? <span className="hud-label shrink-0">{meta}</span> : null}
        </header>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  index,
  title,
  kicker,
  action
}: Readonly<{ index: string; title: string; kicker?: string; action?: ReactNode }>) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 sm:mb-6">
      <div className="min-w-0">
        <p className="hud-label text-phos-500">
          <span className="text-zinc-600">[{index}]</span> {kicker}
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatusDot({ tone = "ok", pulse = false }: Readonly<{ tone?: "ok" | "warn" | "alert"; pulse?: boolean }>) {
  const color = tone === "ok" ? "bg-phos" : tone === "warn" ? "bg-amber" : "bg-alert";
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-1.5 shrink-0 rounded-full ${color} ${pulse ? "animate-pulse-ring" : ""}`}
    />
  );
}

export function Chip({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span className="inline-flex items-center border border-line-strong bg-ink-850 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
      {children}
    </span>
  );
}

export function ArrowLink({ href, children, external = false }: Readonly<{ href: string; children: ReactNode; external?: boolean }>) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-phos uppercase no-underline hover:text-phos-200"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
        {external ? "↗" : "→"}
      </span>
    </a>
  );
}

/** Splits the legacy "( Typescript, NextJS ) =>" techstack string into clean tags. */
export function parseTechstack(techstack: string) {
  return techstack
    .replace(/=>/g, "")
    .replace(/[()]/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function readingMinutes(body: string) {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
