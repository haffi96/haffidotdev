import { experience } from "../lib/profile";
import { Chip, StatusDot } from "./Hud";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toStamp(value: string) {
  const [month, year] = value.split(" ");
  const index = MONTHS.indexOf(month ?? "");
  if (index === -1 || !year) {
    return value.toUpperCase();
  }
  return `${year}-${String(index + 1).padStart(2, "0")}`;
}

function duration(start: string, end: string) {
  const parse = (value: string) => {
    const [month, year] = value.split(" ");
    return Number(year) * 12 + MONTHS.indexOf(month ?? "");
  };
  const months = parse(end) - parse(start) + 1;
  if (!Number.isFinite(months) || months <= 0) {
    return null;
  }
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years ? `${years}y` : "", rest ? `${rest}m` : ""].filter(Boolean).join(" ");
}

export function SessionLog() {
  return (
    <ol className="relative">
      {experience.map((role, roleIndex) => {
        const active = role.end.toLowerCase() === "present";
        const sessionId = String(experience.length - roleIndex).padStart(2, "0");
        const span = active ? null : duration(role.start, role.end);

        return (
          <li key={role.company} className="relative grid gap-3 pb-10 last:pb-0 md:grid-cols-[10rem_1fr] md:gap-8">
            {/* Timeline rail */}
            <span aria-hidden="true" className="absolute top-2 bottom-0 left-[3px] w-px bg-line md:left-[calc(10rem+15px)]" />
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-0 size-[7px] rotate-45 border md:left-[calc(10rem+12px)] ${
                active ? "border-phos bg-phos" : "border-zinc-500 bg-ink-950"
              }`}
            />

            <div className="pl-6 font-mono text-xs md:pl-0 md:text-right">
              <p className="text-zinc-300 tabular-nums">
                {toStamp(role.start)} <span className="text-zinc-600">→</span> {active ? "NOW" : toStamp(role.end)}
              </p>
              <p className="mt-1 tracking-wider text-zinc-500 uppercase">
                Session {sessionId}
                {span ? ` · ${span}` : ""}
              </p>
            </div>

            <div className="min-w-0 pl-6 md:pl-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-xl font-semibold text-zinc-50">{role.company}</h3>
                {active ? (
                  <span className="flex items-center gap-1.5 border border-phos/40 px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-phos uppercase">
                    <StatusDot /> Active
                  </span>
                ) : (
                  <span className="border border-line-strong px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                    Closed
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                {role.role} <span className="text-zinc-600">·</span> {role.location}
              </p>

              <ul className="mt-4 space-y-2.5">
                {role.highlights.map((highlight, index) => (
                  <li key={highlight} className="grid grid-cols-[auto_1fr] gap-3 text-[15px] leading-relaxed text-zinc-300">
                    <span className="pt-[3px] font-mono text-[11px] text-zinc-600 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {role.stack.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
