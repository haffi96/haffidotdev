import { useEffect, useState } from "react";

const TIME_ZONE = "Europe/London";

function readClock() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short"
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const hour = Number(get("hour"));
  return {
    hours: get("hour"),
    minutes: get("minute"),
    zone: get("timeZoneName"),
    isDay: hour >= 7 && hour < 19
  };
}

/** Live Oxford clock. Renders a placeholder on the server to avoid hydration mismatch. */
export function LocalTime() {
  const [clock, setClock] = useState<ReturnType<typeof readClock> | null>(null);

  useEffect(() => {
    setClock(readClock());
    const id = window.setInterval(() => setClock(readClock()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      <p className="font-mono text-4xl font-medium tracking-tight tabular-nums sm:text-5xl" aria-live="off">
        {clock ? clock.hours : "--"}
        <span className="blink text-accent">:</span>
        {clock ? clock.minutes : "--"}
      </p>
      <p className="mt-1 text-sm text-muted">
        {clock ? `${clock.zone} · ${clock.isDay ? "Daytime" : "After hours"} in Oxford` : "Local time in Oxford"}
      </p>
    </div>
  );
}

/** Copy-to-clipboard button with a short confirmation state. */
export function CopyButton({ value, label = "Copy" }: Readonly<{ value: string; label?: string }>) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      className="btn btn-ghost relative z-10"
      onClick={() => {
        void navigator.clipboard?.writeText(value).then(() => setCopied(true));
      }}
      aria-live="polite"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
