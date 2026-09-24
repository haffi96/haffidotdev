import { education, skills } from "../lib/profile";
import { Panel, StatusDot } from "./Hud";

export function SystemStatus() {
  const total = skills.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
      <Panel label="Subsystems" meta={`${total} modules · all nominal`}>
        <ul>
          {skills.map((group, index) => (
            <li
              key={group.group}
              className="grid gap-3 border-b border-line px-3 py-4 last:border-b-0 sm:grid-cols-[13rem_1fr] sm:px-4"
            >
              <div className="flex items-start justify-between gap-3 sm:block">
                <p className="font-mono text-xs tracking-wider text-zinc-200 uppercase">
                  <span className="text-zinc-600">{String(index + 1).padStart(2, "0")} </span>
                  {group.group}
                </p>
                <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-phos-500 uppercase sm:mt-1.5">
                  <StatusDot /> Nominal
                </p>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line-strong bg-ink-850 px-2 py-1 font-mono text-xs text-zinc-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel label="Calibration · education" meta={`${education.length} records`}>
        <ul>
          {education.map((item) => (
            <li key={item.school} className="border-b border-line px-3 py-4 last:border-b-0 sm:px-4">
              <p className="font-mono text-[11px] tracking-wider text-zinc-500">{item.years}</p>
              <p className="mt-1 font-medium text-zinc-100">{item.school}</p>
              <p className="mt-0.5 text-sm text-zinc-400">{item.degree}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
