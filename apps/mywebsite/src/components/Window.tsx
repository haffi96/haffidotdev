import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

type WindowProps = Readonly<{
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Lets desktop visitors drag the window by its title bar. Ignored on touch/small screens. */
  draggable?: boolean;
  accent?: "yellow" | "blue" | "red" | "purple" | "green" | "none";
  as?: "section" | "article" | "div" | "aside";
  id?: string;
  labelledBy?: string;
}>;

const accentClass: Record<NonNullable<WindowProps["accent"]>, string> = {
  yellow: "bg-ph-yellow",
  blue: "bg-ph-blue",
  red: "bg-ph-red",
  purple: "bg-ph-purple",
  green: "bg-ph-green",
  none: "bg-transparent"
};

/**
 * A desktop-OS style window. On small screens it is simply a bordered card,
 * so the metaphor never gets in the way of reading.
 */
export function Window({
  title,
  children,
  className = "",
  bodyClassName = "p-5 sm:p-7",
  draggable = false,
  accent = "none",
  as: Tag = "section",
  id,
  labelledBy
}: WindowProps) {
  const { offset, dragging, handlers, enabled } = useDrag(draggable);

  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={`relative min-w-0 overflow-hidden rounded-lg border-[1.5px] border-edge bg-window shadow-[0_2px_0_0_var(--ph-edge)] ${
        dragging ? "z-30 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.35)]" : ""
      } ${className}`}
      style={enabled && (offset.x !== 0 || offset.y !== 0) ? { transform: `translate(${offset.x}px, ${offset.y}px)` } : undefined}
    >
      <div
        className={`flex items-center gap-2 border-b-[1.5px] border-edge bg-chrome px-3 py-1.5 ${
          enabled ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
        } select-none`}
        {...handlers}
      >
        <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-sm ${accentClass[accent]} ${accent === "none" ? "" : "border border-edge"}`} />
        <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted">
          {title}
          {enabled ? <span className="ml-2 hidden text-[0.65rem] opacity-70 lg:inline">(drag me)</span> : null}
        </p>
        <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5 text-muted">
          <svg className="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 9h8" />
          </svg>
          <svg className="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="8" height="8" rx="1" />
          </svg>
          <svg className="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m2.5 2.5 7 7m0-7-7 7" />
          </svg>
        </span>
      </div>
      <div className={bodyClassName}>{children}</div>
    </Tag>
  );
}

function useDrag(requested: boolean) {
  const [enabled, setEnabled] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef({ px: 0, py: 0, x: 0, y: 0 });

  useEffect(() => {
    if (!requested) {
      return;
    }
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => {
      setEnabled(query.matches);
      if (!query.matches) {
        setOffset({ x: 0, y: 0 });
      }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [requested]);

  if (!enabled) {
    return { offset, dragging: false, enabled, handlers: {} };
  }

  const handlers = {
    onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
      if (event.button !== 0) {
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      start.current = { px: event.clientX, py: event.clientY, x: offset.x, y: offset.y };
      setDragging(true);
    },
    onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
      if (!dragging) {
        return;
      }
      const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));
      setOffset({
        x: clamp(start.current.x + event.clientX - start.current.px, window.innerWidth / 2),
        y: clamp(start.current.y + event.clientY - start.current.py, 400)
      });
    },
    onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      setDragging(false);
    },
    onDoubleClick() {
      setOffset({ x: 0, y: 0 });
    }
  };

  return { offset, dragging, enabled, handlers };
}
