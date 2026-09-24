import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { profile } from "../lib/profile";
import { GitHubIcon, LinkedInIcon, LogoMark, MailIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/", label: "Home", exact: true },
  { to: "/projects", label: "Projects", exact: false },
  { to: "/blogs", label: "Blog", exact: false }
] as const;

/** Top taskbar. Collapses to a menu button on small screens. */
export function Nav() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (to: string, exact: boolean) => (exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`));

  return (
    <header className="sticky top-0 z-40 px-2 pt-2 sm:px-3">
      <nav
        aria-label="Main"
        className="mx-auto flex h-12 max-w-[1400px] items-center gap-1 rounded-lg border-[1.5px] border-edge bg-desk-2/90 px-2 backdrop-blur supports-[backdrop-filter]:bg-desk-2/75 sm:gap-2 sm:px-3"
      >
        <Link to="/" className="flex shrink-0 items-center gap-2 rounded-md px-1.5 py-1 font-bold text-ink no-underline hover:bg-chrome">
          <LogoMark className="h-5 w-auto text-ink" />
          <span className="text-[0.95rem] tracking-tight">haffi.dev</span>
        </Link>

        <ul className="ml-2 hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={isActive(item.to, item.exact) ? "page" : undefined}
                className={`rounded-md px-2.5 py-1.5 text-sm font-semibold no-underline transition-colors ${
                  isActive(item.to, item.exact) ? "bg-window text-ink shadow-[inset_0_0_0_1.5px_var(--ph-line)]" : "text-body hover:bg-chrome"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-body no-underline hover:bg-chrome" href={profile.links.resume}>
              Resume
            </a>
          </li>
        </ul>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <a
            aria-label="GitHub"
            href={profile.links.github}
            className="hidden size-9 items-center justify-center rounded-md text-ink hover:bg-chrome sm:flex"
          >
            <GitHubIcon className="size-[18px]" />
          </a>
          <a
            aria-label="LinkedIn"
            href={profile.links.linkedin}
            className="hidden size-9 items-center justify-center rounded-md text-ink hover:bg-chrome sm:flex"
          >
            <LinkedInIcon className="size-[18px]" />
          </a>
          <ThemeToggle />
          <a href={`mailto:${profile.email}`} className="btn-3d btn-orange ml-1 hidden px-3 py-1 text-[0.8rem] sm:inline-flex">
            <MailIcon className="size-4" />
            Say hi
          </a>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md text-ink hover:bg-chrome md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg className="size-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="animate-window-pop mx-auto mt-2 max-w-[1400px] overflow-hidden rounded-lg border-[1.5px] border-edge bg-window shadow-[0_3px_0_0_var(--ph-edge)] md:hidden"
        >
          <p className="border-b-[1.5px] border-edge bg-chrome px-3 py-1.5 font-mono text-xs text-muted">start-menu.exe</p>
          <ul className="grid gap-1 p-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={isActive(item.to, item.exact) ? "page" : undefined}
                  className={`block rounded-md px-3 py-2.5 font-semibold no-underline ${
                    isActive(item.to, item.exact) ? "bg-chrome text-ink" : "text-body hover:bg-chrome"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a className="block rounded-md px-3 py-2.5 font-semibold text-body no-underline hover:bg-chrome" href={profile.links.resume}>
                Resume (PDF)
              </a>
            </li>
          </ul>
          <div className="flex flex-wrap gap-2 border-t-[1.5px] border-dashed border-line p-3">
            <a href={`mailto:${profile.email}`} className="btn-3d btn-orange">
              <MailIcon /> Email
            </a>
            <a href={profile.links.linkedin} className="btn-3d btn-plain">
              <LinkedInIcon /> LinkedIn
            </a>
            <a href={profile.links.github} className="btn-3d btn-plain">
              <GitHubIcon /> GitHub
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
