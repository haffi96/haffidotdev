import { Link } from "@tanstack/react-router";
import avatarUrl from "../media/avatar.png?url";
import { profile } from "../lib/profile";
import { ThemeToggle } from "./ThemeToggle";

const linkClass =
  "rounded-full px-2.5 py-1.5 text-sm font-medium text-muted no-underline transition-colors hover:text-fg sm:px-3";
const activeClass = "bg-tile-2 text-fg! shadow-[inset_0_0_0_1px_var(--line)]";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-line bg-tile/75 py-1.5 pr-1.5 pl-1.5 shadow-[var(--shadow)] backdrop-blur-xl sm:pl-2"
      >
        <Link to="/" className="flex min-w-0 items-center gap-2 rounded-full pr-2 no-underline" aria-label="Home">
          <img src={avatarUrl} alt="" className="size-8 shrink-0 rounded-full object-cover" width={32} height={32} />
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">{profile.name}</span>
        </Link>
        <div className="flex items-center gap-0.5">
          <Link to="/" className={linkClass} activeProps={{ className: activeClass }} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/projects" className={linkClass} activeProps={{ className: activeClass }}>
            Projects
          </Link>
          <Link to="/blogs" className={linkClass} activeProps={{ className: activeClass }}>
            Writing
          </Link>
          <a href={profile.links.resume} className={`${linkClass} hidden sm:inline-flex`} target="_blank" rel="noreferrer">
            Resume
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
