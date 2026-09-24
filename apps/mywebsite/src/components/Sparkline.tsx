import { useId } from "react";

/** Minimal SVG sparkline. Stretches to its container; strokes stay 1.5px. */
export function Sparkline({
  values,
  min,
  max,
  threshold,
  className = "h-12 w-full",
  tone = "phos",
  label
}: Readonly<{
  values: number[];
  min: number;
  max: number;
  threshold?: number;
  className?: string;
  tone?: "phos" | "amber";
  label?: string;
}>) {
  const gradientId = `spark-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const width = 100;
  const height = 40;
  const range = max - min || 1;
  const toY = (value: number) => height - ((Math.min(max, Math.max(min, value)) - min) / range) * height;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values.map((value, index) => `${(index * step).toFixed(2)},${toY(value).toFixed(2)}`);
  const line = points.join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  const color = tone === "phos" ? "var(--color-phos)" : "var(--color-amber)";

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((fraction) => (
        <line
          key={fraction}
          x1="0"
          x2={width}
          y1={height * fraction}
          y2={height * fraction}
          stroke="var(--color-line)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {threshold !== undefined ? (
        <line
          x1="0"
          x2={width}
          y1={toY(threshold)}
          y2={toY(threshold)}
          stroke="var(--color-amber)"
          strokeOpacity="0.7"
          strokeDasharray="3 3"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
      <polygon points={area} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
