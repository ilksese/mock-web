import { splitProps, type ComponentProps, type JSX } from "solid-js";

type Variant = "primary" | "outline" | "ghost" | "pill";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
}

export default function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "children", "style"]);
  const v = local.variant ?? "primary";

  const baseStyle: JSX.CSSProperties = {
    "font-family": "var(--font-sans)",
    "font-size": "16px",
    "font-weight": "600",
    "line-height": "24px",
    padding: v === "pill" ? "var(--spacing-xs) var(--spacing-md)" : "var(--spacing-md) var(--spacing-lg)",
    "border-radius": v === "pill" ? "var(--rounded-pill)" : "var(--rounded-sm)",
    cursor: "pointer",
    border: "none",
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "center",
  };

  if (v === "primary") {
    baseStyle.background = "var(--color-primary)";
    baseStyle.color = "var(--color-on-primary)";
  } else if (v === "outline") {
    baseStyle.background = "var(--color-canvas)";
    baseStyle.color = "var(--color-ink)";
    baseStyle.border = "1px solid var(--color-hairline)";
  } else if (v === "ghost") {
    baseStyle.background = "transparent";
    baseStyle.color = "var(--color-primary-soft)";
  } else if (v === "pill") {
    baseStyle.background = "var(--color-canvas)";
    baseStyle.color = "var(--color-ink)";
    baseStyle.border = "1px solid var(--color-hairline)";
    baseStyle["font-size"] = "14px";
  }

  return (
    <button
      {...rest}
      style={{ ...baseStyle, ...(typeof local.style === "object" ? (local.style as JSX.CSSProperties) : {}) }}
    >
      {local.children}
    </button>
  );
}