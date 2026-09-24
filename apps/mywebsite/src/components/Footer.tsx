import { profile } from "../lib/profile";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./ui";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-300 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-sm font-medium">
            &copy; {new Date().getFullYear()} {profile.name}{" "}
            <span className="font-mono text-amber-600 dark:text-amber-400">:)</span>
          </p>
          <p className="mt-1 font-mono text-xs text-zinc-500">Built with TanStack Start on Cloudflare Workers</p>
        </div>
        <div className="flex items-center gap-1">
          <FooterIcon href={`mailto:${profile.email}`} label="Email">
            <MailIcon className="size-[18px]" />
          </FooterIcon>
          <FooterIcon href={profile.links.linkedin} label="LinkedIn">
            <LinkedInIcon className="size-4" />
          </FooterIcon>
          <FooterIcon href={profile.links.github} label="GitHub">
            <GitHubIcon className="size-4" />
          </FooterIcon>
          <a
            href="#top"
            className="ml-2 rounded-md px-2 py-1.5 font-mono text-xs text-zinc-500 no-underline hover:text-zinc-950 dark:hover:text-white"
          >
            top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterIcon({ href, label, children }: Readonly<{ href: string; label: string; children: React.ReactNode }>) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex size-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
    >
      {children}
    </a>
  );
}
