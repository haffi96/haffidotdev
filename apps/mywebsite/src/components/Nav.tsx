import { Link } from "@tanstack/react-router";
import { profile } from "../lib/profile";

const linkClass =
  "rounded-full px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.14em] uppercase text-mist no-underline transition-colors hover:text-white";
const activeClass = "bg-white/5 text-white";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-line/70 bg-void/60 py-1.5 pr-1.5 pl-4 shadow-[0_8px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl"
      >
        <Link to="/" className="group flex shrink-0 items-center gap-2.5 no-underline" aria-label={`${profile.name}, home`}>
          <span className="size-2 animate-pulse-dot rounded-full bg-neon motion-reduce:animate-none" />
          <span className="font-display text-sm font-semibold tracking-tight text-white">
            haffi<span className="text-neon">.dev</span>
          </span>
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Link to="/" className={`${linkClass} max-sm:hidden`} activeProps={{ className: activeClass }} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/projects" className={linkClass} activeProps={{ className: activeClass }}>
            Projects
          </Link>
          <Link to="/blogs" className={linkClass} activeProps={{ className: activeClass }}>
            Blog
          </Link>
          <a
            href={profile.links.resume}
            className="ml-1 rounded-full border border-neon/40 bg-neon/10 px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.14em] text-neon uppercase no-underline transition-colors hover:bg-neon hover:text-void"
          >
            CV
          </a>
        </div>
      </nav>
    </header>
  );
}
