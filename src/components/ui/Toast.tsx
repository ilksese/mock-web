import { For } from "solid-js";
import { useToast } from "../../store/toast";

export default function ToastContainer() {
  const { toasts, remove } = useToast();
  return (
    <div class="fixed top-8 right-8 z-200 flex flex-col gap-2">
      <For each={toasts()}>
        {(t) => (
          <div
            onClick={() => remove(t.id)}
            class={`bg-canvas border border-hairline rounded-md py-3 px-4 text-sm cursor-pointer min-w-[280px] ${t.type === "error" ? "text-[#f87171]" : t.type === "success" ? "text-primary" : "text-ink"}`}
          >
            {t.message}
          </div>
        )}
      </For>
    </div>
  );
}