import type { JSX } from "solid-js";

interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  style?: JSX.CSSProperties;
}

let injected = false;

function injectShimmer() {
  if (injected) return;
  injected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes sk-shimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .sk {
      background: linear-gradient(90deg,
        var(--color-canvas-soft) 0%,
        var(--color-hairline) 40%,
        var(--color-canvas-soft) 80%
      );
      background-size: 800px 100%;
      animation: sk-shimmer 1.6s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

export default function Skeleton(props: SkeletonProps) {
  injectShimmer();
  return (
    <div
      class="sk"
      style={{
        width: props.width ?? "100%",
        height: props.height ?? "1em",
        "border-radius": props.radius ?? "var(--rounded-sm)",
        ...props.style,
      }}
    />
  );
}