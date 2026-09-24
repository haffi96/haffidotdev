import { m } from "motion/react";

// The initial theme class is applied by an inline script in <head> before paint,
// so the icons are driven purely by the `dark` class and never mismatch on hydration.
export function ThemeToggle() {
  function toggle() {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("theme", next);
  }

  return (
    <m.button
      type="button"
      aria-label="Toggle colour theme"
      onClick={toggle}
      whileTap={{ scale: 0.88, rotate: -20 }}
      className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-card/80 text-fg shadow-sm backdrop-blur-md transition-colors hover:border-accent/50 hover:text-accent"
    >
      <svg
        className="absolute size-[18px] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] dark:translate-y-6 dark:rotate-90 dark:opacity-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" strokeLinejoin="round" />
      </svg>
      <svg
        className="absolute size-[18px] -translate-y-6 -rotate-90 opacity-0 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] dark:translate-y-0 dark:rotate-0 dark:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"
          strokeLinecap="round"
        />
      </svg>
    </m.button>
  );
}
