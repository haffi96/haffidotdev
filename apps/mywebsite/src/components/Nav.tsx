import { Link, useRouterState } from "@tanstack/react-router";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import avatarUrl from "../media/avatar.png?url";
import { profile } from "../lib/profile";
import { Magnetic } from "./motion/Magnetic";
import { spring } from "./motion/MotionProvider";
import { ThemeToggle } from "./ThemeToggle";

const items = [
  { label: "Home", to: "/", match: (path: string) => path === "/" },
  { label: "Projects", to: "/projects", match: (path: string) => path.startsWith("/projects") },
  { label: "Blog", to: "/blogs", match: (path: string) => path.startsWith("/blogs") }
] as const;

export function Nav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 24));

  const active = items.find((item) => item.match(pathname))?.label ?? null;
  const highlighted = hovered ?? active;

  return (
    <header className="sticky top-0 z-50 pt-3 pb-3 sm:pt-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg via-bg/75 to-transparent"
      />
      <div className="shell flex items-center justify-between gap-2">
        <Link
          to="/"
          aria-label={`${profile.name}, home`}
          className="group hidden items-center gap-2.5 rounded-full py-1 pr-3 pl-1 no-underline sm:flex"
        >
          <img
            src={avatarUrl}
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full object-cover ring-2 ring-bg transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105"
          />
          <span className="text-sm font-semibold tracking-tight">
            Haffi<span className="text-accent">.</span>
          </span>
        </Link>

        <m.nav
          aria-label="Primary"
          className="flex items-center gap-0.5 rounded-full border p-1 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500"
          animate={{
            backgroundColor: scrolled ? "color-mix(in srgb, var(--card) 82%, transparent)" : "color-mix(in srgb, var(--card) 55%, transparent)",
            borderColor: scrolled ? "var(--line)" : "color-mix(in srgb, var(--line) 60%, transparent)",
            boxShadow: scrolled ? "0 10px 30px -12px rgb(0 0 0 / 0.18)" : "0 0 0 0 rgb(0 0 0 / 0)"
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {items.map((item) => {
            const isActive = active === item.label;
            return (
              <Magnetic key={item.label} strength={0.22}>
                <Link
                  to={item.to}
                  onPointerEnter={() => setHovered(item.label)}
                  onFocus={() => setHovered(item.label)}
                  onBlur={() => setHovered(null)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative block rounded-full px-3 py-1.5 text-[0.8rem] font-medium no-underline transition-colors duration-300 sm:px-4 sm:text-sm ${
                    highlighted === item.label ? "text-bg" : isActive ? "text-fg" : "text-soft hover:text-fg"
                  }`}
                >
                  {highlighted === item.label ? (
                    <m.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-fg" transition={spring} />
                  ) : null}
                  {isActive && highlighted !== item.label ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-accent sm:inset-x-4" aria-hidden="true" />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </Link>
              </Magnetic>
            );
          })}
          <Magnetic strength={0.22}>
            <a
              href={profile.links.resume}
              onPointerEnter={() => setHovered("Resume")}
              onFocus={() => setHovered("Resume")}
              onBlur={() => setHovered(null)}
              className={`relative block rounded-full px-3 py-1.5 text-[0.8rem] font-medium no-underline transition-colors duration-300 sm:px-4 sm:text-sm ${
                highlighted === "Resume" ? "text-bg" : "text-soft hover:text-fg"
              }`}
            >
              {highlighted === "Resume" ? (
                <m.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-fg" transition={spring} />
              ) : null}
              <span className="relative">Resume</span>
            </a>
          </Magnetic>
        </m.nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
