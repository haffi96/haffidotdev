import { profile } from "../lib/profile";
import { StatusDot } from "./Hud";
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink-950/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="hud-label text-phos-500">[EOT] End of transmission</p>
          <p className="mt-2 text-lg font-medium text-zinc-100">Open a channel.</p>
          <p className="mt-1 max-w-md text-sm text-zinc-400">
            Real-time systems, streaming, backend performance. Happy to talk shop.
          </p>
        </div>
        <ContactLinks />
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 font-mono text-[11px] tracking-wider text-zinc-500 uppercase sm:px-6">
          <span>
            &copy; {new Date().getFullYear()} {profile.name}
          </span>
          <span className="flex items-center gap-2">
            <StatusDot /> {profile.location} · Built with TanStack Start
          </span>
        </div>
      </div>
    </footer>
  );
}

export function ContactLinks({ className = "" }: Readonly<{ className?: string }>) {
  const items = [
    { href: `mailto:${profile.email}`, label: profile.email, icon: <MailIcon />, external: false },
    { href: profile.links.linkedin, label: "LinkedIn", icon: <LinkedInIcon />, external: true },
    { href: profile.links.github, label: "GitHub", icon: <GitHubIcon />, external: true },
    { href: profile.links.resume, label: "Resume", icon: <FileIcon />, external: false }
  ];

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item.href} className="min-w-0">
          <a
            href={item.href}
            className="flex min-w-0 items-center gap-2 border border-line-strong bg-ink-900 px-3 py-2 font-mono text-xs text-zinc-300 no-underline transition-colors hover:border-phos/60 hover:text-phos"
            {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            <span className="shrink-0 text-phos-500">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
