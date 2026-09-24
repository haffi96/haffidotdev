import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { profile } from "../lib/profile";
import { useReducedMotion } from "../lib/hooks";
import { StatusDot } from "./Hud";

const links = [
  { to: "/", label: "Home", code: "00", exact: true },
  { to: "/projects", label: "Projects", code: "01", exact: false },
  { to: "/blogs", label: "Logs", code: "02", exact: false }
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5 no-underline">
          <span className="grid size-7 shrink-0 place-items-center border border-phos/50 font-mono text-[11px] font-semibold text-phos">
            HM
          </span>
          <span className="hidden truncate font-mono text-xs tracking-[0.2em] text-zinc-300 uppercase sm:inline">
            haffi<span className="text-phos">.</span>dev
          </span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.exact }}
              className="px-2 py-1.5 font-mono text-[11px] tracking-[0.14em] text-zinc-400 uppercase no-underline transition-colors hover:text-zinc-100 sm:px-3 sm:text-xs"
              activeProps={{ className: "text-phos! hover:text-phos!" }}
            >
              <span className="hidden text-zinc-600 md:inline">{link.code} </span>
              {link.label}
            </Link>
          ))}
          <a
            href={profile.links.resume}
            className="ml-1 border border-line-strong px-2 py-1.5 font-mono text-[11px] tracking-[0.14em] text-zinc-300 uppercase no-underline transition-colors hover:border-phos/60 hover:text-phos sm:px-3 sm:text-xs"
          >
            CV
          </a>
        </nav>

        <LinkStatus />
      </div>
    </header>
  );
}

function LinkStatus() {
  const reducedMotion = useReducedMotion();
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    let value = 42;
    setMs(value);
    const id = window.setInterval(
      () => {
        value = Math.round(value + (42 - value) * 0.35 + (Math.random() - 0.5) * 10);
        value = Math.max(31, Math.min(58, value));
        setMs(value);
      },
      reducedMotion ? 4000 : 1500
    );
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <div
      className="hidden shrink-0 items-center gap-2 border border-line px-2.5 py-1 font-mono text-[11px] tracking-wider text-zinc-400 uppercase lg:flex"
      aria-label="Simulated link status"
    >
      <StatusDot pulse={!reducedMotion} />
      <span>
        Link OK <span className="text-zinc-600">·</span>{" "}
        <span className="inline-block w-[4ch] text-right text-phos tabular-nums">{ms === null ? "--" : ms}ms</span>
      </span>
    </div>
  );
}
