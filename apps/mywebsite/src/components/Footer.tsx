import { profile } from "../lib/profile";
import { ArrowUpRightIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";
import { Magnetic } from "./motion/Magnetic";
import { Reveal } from "./motion/Reveal";

export function Footer() {
  const links = [
    { label: "LinkedIn", href: profile.links.linkedin, icon: <LinkedInIcon /> },
    { label: "GitHub", href: profile.links.github, icon: <GitHubIcon /> },
    { label: "Resume", href: profile.links.resume, icon: <ArrowUpRightIcon /> }
  ];

  return (
    <footer className="mt-28 border-t border-line sm:mt-36">
      <div className="shell py-16 sm:py-24">
        <Reveal>
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-4 max-w-3xl text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
            Have a hard, real-time problem? <span className="font-display font-normal text-accent italic">Let's talk.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Magnetic strength={0.15}>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex max-w-full items-center gap-3 rounded-full bg-fg py-3 pr-5 pl-3 text-bg no-underline transition-transform active:scale-[0.98]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform duration-500 group-hover:rotate-[-12deg]">
                <MailIcon />
              </span>
              <span className="truncate text-sm font-medium sm:text-base">{profile.email}</span>
            </a>
          </Magnetic>
          <ul className="flex flex-wrap gap-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-sm font-medium text-soft no-underline transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {link.icon}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 font-mono text-xs text-muted sm:flex-row sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {profile.name} · {profile.location}
          </span>
          <span>Built with TanStack Start &amp; Motion</span>
        </div>
      </div>
    </footer>
  );
}
