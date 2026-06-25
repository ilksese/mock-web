import type { JSX } from "solid-js";
import { onCleanup } from "solid-js";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: JSX.Element;
}

export default function Modal(props: ModalProps) {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") props.onClose();
  };
  if (props.open) {
    document.addEventListener("keydown", handleKey);
    onCleanup(() => document.removeEventListener("keydown", handleKey));
  }
  if (!props.open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        "z-index": 100,
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        background: "rgba(0,0,0,0.6)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-hairline)",
          "border-radius": "var(--rounded-md)",
          padding: "var(--spacing-2xl)",
          "min-width": "420px",
          "max-width": "90vw",
          "max-height": "90vh",
          overflow: "auto",
        }}
      >
        <h2 style={{ "font-size": "20px", "font-weight": "600", "margin-bottom": "var(--spacing-lg)" }}>{props.title}</h2>
        {props.children}
      </div>
    </div>
  );
}