import { useEffect, useRef, useState } from "react";
import { achievements } from "../lib/profile";
import { clamp, seededRandom, useInView, useReducedMotion } from "../lib/hooks";
import { Sparkline } from "./Sparkline";

type Series = {
  channel: string;
  min: number;
  max: number;
  threshold?: number;
  caption: string;
  initial: number[];
  /** When present, the series streams new samples while on screen. */
  next?: (previous: number) => number;
  tone: "phos" | "amber";
};

const POINTS = 40;

function makeSeries(seed: number, fn: (index: number, random: () => number) => number) {
  const random = seededRandom(seed);
  return Array.from({ length: POINTS }, (_, index) => fn(index, random));
}

const SERIES: Series[] = [
  {
    channel: "CH-01 · video",
    min: 60,
    max: 220,
    threshold: 200,
    caption: "g2g ms · budget 200",
    initial: makeSeries(11, (_, random) => 150 + (random() - 0.5) * 36),
    next: (previous) => clamp(previous + (150 - previous) * 0.3 + (Math.random() - 0.5) * 34 + (Math.random() < 0.06 ? 22 : 0), 112, 194),
    tone: "phos"
  },
  {
    channel: "CH-02 · control",
    min: 0,
    max: 60,
    threshold: 50,
    caption: "rtt ms · budget 50",
    initial: makeSeries(23, (_, random) => 31 + (random() - 0.5) * 12),
    next: (previous) => clamp(previous + (31 - previous) * 0.3 + (Math.random() - 0.5) * 11 + (Math.random() < 0.05 ? 8 : 0), 14, 47),
    tone: "phos"
  },
  {
    channel: "CH-03 · load test",
    min: 0,
    max: 16.5,
    caption: "concurrent users (M)",
    initial: makeSeries(37, (index, random) => {
      const ramp = Math.min(1, index / 18);
      const eased = ramp * ramp * (3 - 2 * ramp);
      return index > 34 ? 15 * (1 - (index - 34) / 8) : 15 * eased + (index > 18 ? (random() - 0.5) * 0.6 : 0);
    }),
    tone: "amber"
  },
  {
    channel: "CH-04 · issuance",
    min: 0,
    max: 1.05,
    caption: "vouchers issued, cumulative",
    initial: makeSeries(51, (index, random) => {
      const x = (index - 14) / 5;
      return 1 / (1 + Math.exp(-x)) + (random() - 0.5) * 0.015;
    }),
    tone: "amber"
  }
];

export function Telemetry() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {achievements.map((achievement, index) => {
        const series = SERIES[index] ?? SERIES[0]!;
        return <TelemetryTile key={achievement.label} achievement={achievement} series={series} />;
      })}
    </div>
  );
}

function TelemetryTile({
  achievement,
  series
}: Readonly<{ achievement: (typeof achievements)[number]; series: Series }>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reducedMotion = useReducedMotion();
  const [values, setValues] = useState(series.initial);

  useEffect(() => {
    const next = series.next;
    if (!next || !inView || reducedMotion) {
      return;
    }
    const id = window.setInterval(() => {
      setValues((current) => [...current.slice(1), next(current.at(-1) ?? series.initial[0]!)]);
    }, 700);
    return () => window.clearInterval(id);
  }, [series, inView, reducedMotion]);

  const streaming = Boolean(series.next);

  return (
    <div ref={ref} className="corners flex min-w-0 flex-col border border-line p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="hud-label truncate">{series.channel}</span>
        <span className={`hud-label shrink-0 ${streaming ? "text-phos-500" : "text-zinc-600"}`}>
          {streaming ? "● stream" : "○ archive"}
        </span>
      </div>
      <p className="mt-4 font-mono text-3xl font-medium tracking-tight text-zinc-50 sm:text-4xl">{achievement.value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-200">{achievement.label}</p>
      <Sparkline
        className="mt-4 h-14 w-full"
        values={values}
        min={series.min}
        max={series.max}
        threshold={series.threshold}
        tone={series.tone}
        label={`${achievement.label} telemetry, ${series.caption}`}
      />
      <p className="hud-label mt-1.5 text-zinc-600">{series.caption}</p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{achievement.detail}</p>
    </div>
  );
}
