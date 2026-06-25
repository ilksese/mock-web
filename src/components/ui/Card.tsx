import type { JSX } from "solid-js";

interface CardProps {
  children: JSX.Element;
  emphasized?: boolean;
  class?: string;
}

export default function Card(props: CardProps) {
  return (
    <div class={`bg-canvas text-ink border-hairline rounded-md p-6 ${props.emphasized ? "border-3" : "border"} ${props.class ?? ""}`}>
      {props.children}
    </div>
  );
}