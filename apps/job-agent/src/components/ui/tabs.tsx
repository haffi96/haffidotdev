import { cn } from "#/lib/utils";

export function TabButton(props: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        props.active ? "bg-slate-950 text-white shadow dark:bg-slate-100 dark:text-slate-950" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      )}
    >
      {props.children}
    </button>
  );
}
