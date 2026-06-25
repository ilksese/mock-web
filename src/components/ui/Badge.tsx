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
      style={{
        display: "inline-block",
        background: bg,
        color: bg === "#f59e0b" || bg === "#3b82f6" ? "#fff" : "#101010",
        "font-family": "var(--font-sans)",
        "font-size": "12px",
        "font-weight": "600",
        "line-height": "16px",
        padding: "2px 8px",
        "border-radius": "var(--rounded-pill)",
      }}
    >
      {props.children}
    </span>
  );
}