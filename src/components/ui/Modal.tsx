import type { JSX } from "solid-js";
import { Show, onCleanup } from "solid-js";

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
  document.addEventListener("keydown", handleKey);
  onCleanup(() => document.removeEventListener("keydown", handleKey));
  return (
    <Show when={props.open}>
      <div
        class="fixed inset-0 z-100 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) props.onClose();
        }}
      >
        <div class="bg-canvas border border-hairline rounded-md p-6 min-w-[420px] max-w-[90vw] max-h-[90vh] overflow-auto">
          <h2 class="text-xl font-semibold mb-4">{props.title}</h2>
          {props.children}
        </div>
      </div>
    </Show>
  );
}