import { createSignal } from "solid-js";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const [toasts, setToasts] = createSignal<Toast[]>([]);

export function useToast() {
  const add = (message: string, type: Toast["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 3000);
  };
  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
  return { toasts, add, remove };
}