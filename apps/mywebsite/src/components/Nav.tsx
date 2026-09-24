import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import avatarUrl from "../media/avatar.png?url";
import { profile } from "../lib/profile";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "home", exact: true },
  { to: "/projects", label: "projects", exact: false },
  { to: "/blogs", label: "blogs", exact: false }
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (to: string, exact: boolean) => (exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`));

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-300/70 bg-zinc-100/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <nav aria-label="Main" className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5 no-underline">
          <img src={avatarUrl} alt="" className="size-7 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-700" />
          <span className="font-mono text-sm font-medium">
            haffi<span className="text-zinc-500">.dev</span>{" "}
            <span className="text-amber-600 dark:text-amber-400">:)</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} active={isActive(link.to, link.exact)}>
              {link.label}
            </NavLink>
          ))}
          <a
            href={profile.links.resume}
            className="rounded-md px-3 py-1.5 font-mono text-sm text-zinc-600 no-underline hover:bg-zinc-200 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            resume
          </a>
          <span aria-hidden className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-800" />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((current) => !current)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-zinc-300/70 md:hidden dark:border-zinc-800/80">
          <div className="mx-auto flex max-w-5xl flex-col px-5 py-3 sm:px-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-2.5 font-mono text-sm no-underline ${
                  isActive(link.to, link.exact)
                    ? "bg-zinc-200 text-zinc-950 dark:bg-zinc-900 dark:text-white"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <span className="text-amber-600 dark:text-amber-400">~/</span>
                {link.label}
              </Link>
            ))}
            <a href={profile.links.resume} className="rounded-md px-3 py-2.5 font-mono text-sm text-zinc-600 no-underline dark:text-zinc-400">
              <span className="text-amber-600 dark:text-amber-400">~/</span>resume.pdf
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavLink({ to, active, children }: Readonly<{ to: string; active: boolean; children: React.ReactNode }>) {
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={`rounded-md px-3 py-1.5 font-mono text-sm no-underline transition-colors ${
        active
          ? "bg-zinc-200 text-zinc-950 dark:bg-zinc-900 dark:text-white"
          : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
