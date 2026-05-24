import { Label } from "./ui/label";

export function Field(props: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-2">
      <Label>{props.label}</Label>
      {props.children}
      {props.hint ? <p className="text-xs leading-5 text-slate-500">{props.hint}</p> : null}
    </div>
  );
}
