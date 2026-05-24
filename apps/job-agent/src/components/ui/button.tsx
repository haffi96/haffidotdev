import * as React from "react";
import { cn } from "#/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-slate-950 text-white shadow hover:bg-slate-800",
        variant === "secondary" && "bg-amber-300 text-slate-950 shadow hover:bg-amber-200",
        variant === "outline" && "border border-slate-300 bg-white text-slate-950 hover:bg-slate-100",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}
