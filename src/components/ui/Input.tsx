import { splitProps, type ComponentProps, type JSX } from "solid-js";

export default function Input(props: ComponentProps<"input">) {
  const [local, rest] = splitProps(props, ["style"]);
  return (
    <input
      {...rest}
      style={{
        background: "var(--color-canvas-soft)",
        color: "var(--color-ink)",
        border: "1px solid var(--color-hairline)",
        "border-radius": "var(--rounded-sm)",
        padding: "var(--spacing-md) var(--spacing-lg)",
        "font-family": "var(--font-sans)",
        "font-size": "14px",
        outline: "none",
        width: "100%",
        ...(typeof local.style === "object" ? (local.style as JSX.CSSProperties) : {}),
      }}
    />
  );
}