import { profile } from "../lib/profile";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line/70 bg-void/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">// end of transmission</p>
          <p className="mt-3 font-display text-2xl font-semibold text-white">{profile.name}</p>
          <p className="mt-1 text-sm text-mist">
            {profile.title} · {profile.location}
          </p>
        </div>
        <ContactLinks />
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-10 font-mono text-[0.7rem] tracking-wide text-mist/70 sm:flex-row sm:justify-between sm:px-8">
        <span>&copy; {new Date().getFullYear()} {profile.name}</span>
        <span>Built with TanStack Start + React Three Fiber</span>
      </div>
    </footer>
  );
}

export function ContactLinks({ className = "" }: Readonly<{ className?: string }>) {
  const item =
    "inline-flex items-center gap-2 rounded-full border border-line bg-ink/70 px-3.5 py-2 text-sm text-haze no-underline transition-colors hover:border-neon/60 hover:text-white";
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      <li>
        <a className={item} href={`mailto:${profile.email}`}>
          <MailIcon className="size-4 text-neon" />
          <span className="break-all">{profile.email}</span>
        </a>
      </li>
      <li>
        <a className={item} href={profile.links.linkedin} rel="noreferrer" target="_blank">
          <LinkedInIcon className="size-4 text-neon" />
          LinkedIn
        </a>
      </li>
      <li>
        <a className={item} href={profile.links.github} rel="noreferrer" target="_blank">
          <GitHubIcon className="size-4 text-neon" />
          GitHub
        </a>
      </li>
    </ul>
  );
}
