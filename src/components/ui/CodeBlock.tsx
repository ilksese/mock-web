import type { JSX } from "solid-js";

interface CodeBlockProps {
  children: string;
  style?: JSX.CSSProperties;
}

export default function CodeBlock(props: CodeBlockProps) {
  return (
    <pre
      style={{
        background: "var(--color-canvas-soft)",
        color: "var(--color-canvas-text-soft)",
        border: "1px solid var(--color-hairline)",
        "border-radius": "var(--rounded-md)",
        padding: "var(--spacing-xl)",
        "font-family": "var(--font-mono)",
        "font-size": "13px",
        "line-height": "18px",
        overflow: "auto",
        "white-space": "pre-wrap",
        "word-break": "break-word",
        margin: 0,
        ...props.style,
      }}
    >
      {props.children}
    </pre>
  );
}