import { m, useAnimationControls, useDragControls } from "motion/react";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { spring } from "./motion/MotionProvider";

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
  yellow: "bg-hm-yellow",
  blue: "bg-hm-blue",
  red: "bg-hm-red",
  purple: "bg-hm-purple",
  green: "bg-hm-green",
  none: "bg-transparent"
};

/**
 * A desktop-OS style window. On small screens it is simply a bordered card,
 * so the metaphor never gets in the way of reading.
 */
export function Window(props: WindowProps) {
  return props.draggable ? <DraggableWindow {...props} /> : <StaticWindow {...props} />;
}

function StaticWindow({ title, children, className = "", bodyClassName = "p-5 sm:p-7", accent = "none", as: Tag = "section", id, labelledBy }: WindowProps) {
  return (
    <Tag id={id} aria-labelledby={labelledBy} className={`${frameClass} ${className}`}>
      <TitleBar title={title} accent={accent} />
      <div className={bodyClassName}>{children}</div>
    </Tag>
  );
}

/**
 * Draggable by its title bar on desktop (fine pointer, >= 1024px). Picks up with a little
 * spring, tilts slightly while carried, and springs home on double-click.
 */
function DraggableWindow({ title, children, className = "", bodyClassName = "p-5 sm:p-7", accent = "none", as = "section", id, labelledBy }: WindowProps) {
  const enabled = useDesktopPointer();
  const dragControls = useDragControls();
  const controls = useAnimationControls();
  const [dragging, setDragging] = useState(false);
  const Tag = m[as] as typeof m.section;

  useEffect(() => {
    if (!enabled) {
      controls.set({ x: 0, y: 0 });
    }
  }, [enabled, controls]);

  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={`${frameClass} ${dragging ? "z-30 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.35)]" : ""} ${className}`}
      drag={enabled}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.12}
      dragConstraints={{ left: -480, right: 480, top: -320, bottom: 320 }}
      animate={controls}
      whileDrag={{ scale: 1.015, rotate: -0.6 }}
      transition={spring}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
    >
      <TitleBar
        title={title}
        accent={accent}
        draggable={enabled}
        dragging={dragging}
        onPointerDown={enabled ? (event) => dragControls.start(event) : undefined}
        onDoubleClick={enabled ? () => controls.start({ x: 0, y: 0 }) : undefined}
      />
      <div className={bodyClassName}>{children}</div>
    </Tag>
  );
}

const frameClass = "relative min-w-0 overflow-hidden rounded-lg border-[1.5px] border-edge bg-window shadow-[0_2px_0_0_var(--hm-edge)]";

function TitleBar({
  title,
  accent,
  draggable = false,
  dragging = false,
  onPointerDown,
  onDoubleClick
}: Readonly<{
  title: string;
  accent: NonNullable<WindowProps["accent"]>;
  draggable?: boolean;
  dragging?: boolean;
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onDoubleClick?: () => void;
}>) {
  return (
    <div
      className={`flex items-center gap-2 border-b-[1.5px] border-edge bg-chrome px-3 py-1.5 select-none ${
        draggable ? `touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}` : ""
      }`}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-sm ${accentClass[accent]} ${accent === "none" ? "" : "border border-edge"}`} />
      <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted">
        {title}
        {draggable ? <span className="ml-2 hidden text-[0.65rem] opacity-70 lg:inline">(drag me)</span> : null}
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
  );
}

function useDesktopPointer() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return enabled;
}
