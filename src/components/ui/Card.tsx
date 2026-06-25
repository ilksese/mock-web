import type { JSX } from "solid-js";

interface CardProps {
  children: JSX.Element;
  emphasized?: boolean;
  style?: JSX.CSSProperties;
  class?: string;
}

export default function Card(props: CardProps) {
  return (
    <div
      class={props.class}
      style={{
        background: "var(--color-canvas)",
        color: "var(--color-ink)",
        border: `${props.emphasized ? 3 : 1}px solid var(--color-hairline)`,
        "border-radius": "var(--rounded-md)",
        padding: "var(--spacing-2xl)",
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}