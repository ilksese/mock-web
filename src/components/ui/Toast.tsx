import { For } from "solid-js";
import { useToast } from "../../store/toast";

export default function ToastContainer() {
  const { toasts, remove } = useToast();
  return (
    <div
      style={{
        position: "fixed",
        top: "var(--spacing-3xl)",
        right: "var(--spacing-3xl)",
        "z-index": 200,
        display: "flex",
        "flex-direction": "column",
        gap: "var(--spacing-sm)",
      }}
    >
      <For each={toasts()}>
        {(t) => (
          <div
            onClick={() => remove(t.id)}
            style={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-hairline)",
              "border-radius": "var(--rounded-md)",
              padding: "var(--spacing-md) var(--spacing-lg)",
              "font-size": "14px",
              color: t.type === "error" ? "#f87171" : t.type === "success" ? "var(--color-primary)" : "var(--color-ink)",
              cursor: "pointer",
              "min-width": "280px",
            }}
          >
            {t.message}
          </div>
        )}
      </For>
    </div>
  );
}