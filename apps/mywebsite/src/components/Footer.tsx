import { Link } from "@tanstack/react-router";
import { profile } from "../lib/profile";
import { GitHubIcon, LinkedInIcon, InitialsMark, MailIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-[1100px] px-3 pb-6 sm:px-5">
      <div className="rounded-lg border-[1.5px] border-edge bg-desk-2 p-5 sm:p-7">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-bold text-ink">
              <InitialsMark className="size-7" />
              haffi.dev
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Built with TanStack Start, served from Cloudflare's edge. This footer loads in roughly 0ms, which is still my
              personal best.
            </p>
          </div>
          <div>
            <h2 className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Explore</h2>
            <ul className="mt-3 space-y-1.5 text-sm font-semibold">
              <li>
                <Link className="text-ink no-underline hover:underline" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="text-ink no-underline hover:underline" to="/projects">
                  Projects
                </Link>
              </li>
              <li>
                <Link className="text-ink no-underline hover:underline" to="/blogs">
                  Learning logs
                </Link>
              </li>
              <li>
                <a className="text-ink no-underline hover:underline" href={profile.links.resume}>
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Ping me</h2>
            <ul className="mt-3 space-y-1.5 text-sm font-semibold">
              <li>
                <a className="inline-flex items-center gap-2 break-all text-ink no-underline hover:underline" href={`mailto:${profile.email}`}>
                  <MailIcon className="size-4 shrink-0" /> {profile.email}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 text-ink no-underline hover:underline" href={profile.links.linkedin}>
                  <LinkedInIcon className="size-4 shrink-0" /> LinkedIn
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 text-ink no-underline hover:underline" href={profile.links.github}>
                  <GitHubIcon className="size-4 shrink-0" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t-[1.5px] border-dashed border-line pt-4 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} {profile.name}</span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="size-2 rounded-full bg-hm-green" />
            All systems operational (I checked)
          </span>
        </div>
      </div>
    </footer>
  );
}
