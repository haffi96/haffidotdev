import type { ReactNode } from "react";
import { profile } from "../lib/profile";

type DesktopIcon = { label: string; href: string; icon: ReactNode };

const left: DesktopIcon[] = [
  { label: "Home", href: "/", icon: <HouseGlyph /> },
  { label: "Projects", href: "/projects", icon: <FolderGlyph color="#f7a501" /> },
  { label: "Learning logs", href: "/blogs", icon: <NotepadGlyph /> },
  { label: "resume.pdf", href: profile.links.resume, icon: <PdfGlyph /> }
];

const right: DesktopIcon[] = [
  { label: "GitHub", href: profile.links.github, icon: <BadgeGlyph color="#151515" text="GH" /> },
  { label: "LinkedIn", href: profile.links.linkedin, icon: <BadgeGlyph color="#1d4aff" text="in" /> },
  { label: "Email me", href: `mailto:${profile.email}`, icon: <EnvelopeGlyph /> },
  { label: "Trash", href: "/trash", icon: <TrashGlyph /> }
];

/**
 * Desktop shortcuts pinned to the edges of very wide screens.
 * Purely a bonus: everything here is also reachable from the taskbar and footer.
 */
export function DesktopIcons() {
  return (
    <>
      <IconColumn items={left} side="left" />
      <IconColumn items={right} side="right" />
    </>
  );
}

function IconColumn({ items, side }: Readonly<{ items: DesktopIcon[]; side: "left" | "right" }>) {
  return (
    <nav
      aria-label={side === "left" ? "Desktop shortcuts" : "Contact shortcuts"}
      className={`fixed top-20 z-10 hidden w-[92px] flex-col gap-3 min-[1380px]:flex ${side === "left" ? "left-3" : "right-3"}`}
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="hover-wiggle group flex flex-col items-center gap-1 rounded-md p-2 text-center no-underline hover:bg-chrome/70"
        >
          <span className="wiggle-target block size-11 drop-shadow-[0_2px_0_rgb(0_0_0/0.25)]">{item.icon}</span>
          <span className="rounded px-1 text-[0.72rem] leading-tight font-semibold text-ink group-hover:bg-hm-yellow group-hover:text-[#151515]">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

function HouseGlyph() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <path d="M6 21 22 7l16 14v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" fill="#eb9d2a" stroke="#151515" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17 39V27h10v12" fill="#fdfdf8" stroke="#151515" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 22 22 5l19 17" fill="none" stroke="#f54e00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderGlyph({ color }: Readonly<{ color: string }>) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <path d="M4 10a2 2 0 0 1 2-2h11l4 4h17a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill={color} stroke="#151515" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 17h36" stroke="#151515" strokeWidth="2" />
    </svg>
  );
}

function NotepadGlyph() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <rect x="8" y="5" width="28" height="35" rx="2" fill="#fdfdf8" stroke="#151515" strokeWidth="2" />
      <path d="M8 11h28" stroke="#1d4aff" strokeWidth="4" />
      <path d="M13 19h18M13 25h18M13 31h11" stroke="#151515" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PdfGlyph() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <path d="M10 4h17l9 9v25a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fdfdf8" stroke="#151515" strokeWidth="2" strokeLinejoin="round" />
      <path d="M27 4v9h9" fill="none" stroke="#151515" strokeWidth="2" strokeLinejoin="round" />
      <rect x="4" y="21" width="26" height="11" rx="1.5" fill="#f54e00" stroke="#151515" strokeWidth="2" />
      <text x="17" y="29.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="IBM Plex Mono, monospace">
        CV
      </text>
    </svg>
  );
}

function BadgeGlyph({ color, text }: Readonly<{ color: string; text: string }>) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <rect x="5" y="5" width="34" height="34" rx="8" fill={color} stroke="#151515" strokeWidth="2" />
      <text x="22" y="28" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" fontFamily="IBM Plex Sans, sans-serif">
        {text}
      </text>
    </svg>
  );
}

function EnvelopeGlyph() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <rect x="4" y="10" width="36" height="25" rx="2" fill="#f7a501" stroke="#151515" strokeWidth="2" />
      <path d="m4 12 18 13 18-13" fill="none" stroke="#151515" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function TrashGlyph() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <path d="M10 13h24l-2 25a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z" fill="#bfc1b7" stroke="#151515" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 13h30M18 8h8" stroke="#151515" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 19v15M26 19v15" stroke="#151515" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
