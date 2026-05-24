import { cn } from "#/lib/utils";

export function TabButton(props: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        props.active ? "bg-slate-950 text-white shadow" : "bg-white text-slate-600 hover:bg-slate-100"
      )}
    >
      {props.children}
    </button>
  );
}
