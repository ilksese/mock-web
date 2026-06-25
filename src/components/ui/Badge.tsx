export const methodColors: Record<string, string> = {
  GET: "#00d992",
  POST: "#3b82f6",
  PUT: "#f59e0b",
  DELETE: "#ef4444",
  PATCH: "#8b5cf6",
};

interface BadgeProps {
  children: string;
  color?: string;
}

export default function Badge(props: BadgeProps) {
  const bg = props.color ?? "#3d3a39";
  return (
    <span
      class={`inline-block font-sans text-xs font-semibold leading-4 py-[2px] px-2 rounded-pill ${bg === "#f59e0b" || bg === "#3b82f6" ? "text-white" : "text-canvas"}`}
      style={{ background: bg }}
    >
      {props.children}
    </span>
  );
}