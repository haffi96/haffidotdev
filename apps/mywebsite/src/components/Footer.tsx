import { profile } from "../lib/profile";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

const iconLink =
  "grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent";

export function Footer() {
  return (
    <footer className="mx-auto mt-16 max-w-6xl px-3 pb-8 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
        <div>
          <p className="font-medium text-fg">&copy; {new Date().getFullYear()} {profile.name}</p>
          <p className="mt-1">
            {profile.title} &middot; {profile.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a className={iconLink} href={`mailto:${profile.email}`} aria-label="Email">
            <MailIcon className="size-4" />
          </a>
          <a className={iconLink} href={profile.links.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
            <LinkedInIcon className="size-4" />
          </a>
          <a className={iconLink} href={profile.links.github} aria-label="GitHub" target="_blank" rel="noreferrer">
            <GitHubIcon className="size-4" />
          </a>
          <a className={iconLink} href={profile.links.resume} aria-label="Resume (PDF)" target="_blank" rel="noreferrer">
            <DownloadIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
