import { createSignal } from "solid-js";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { api } from "../../lib/client";
import { useToast } from "../../store/toast";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

interface Props {
  open: boolean;
  workspaceId: string;
  onClose: () => void;
  onCreated: (ep: any) => void;
}

export default function CreateEndpointModal(props: Props) {
  const [name, setName] = createSignal("");
  const [method, setMethod] = createSignal("GET");
  const [path, setPath] = createSignal("/");
  const [delayMs, setDelayMs] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const toast = useToast();

  const handleCreate = async () => {
    if (!name().trim() || !path().trim()) return;
    setLoading(true);
    try {
      const ep = await api.createEndpoint(props.workspaceId, {
        name: name().trim(),
        method: method(),
        path: path().startsWith("/") ? path() : "/" + path(),
        delayMs: delayMs(),
      });
      toast.add("Endpoint created!", "success");
      props.onCreated(ep);
      props.onClose();
      setName("");
      setPath("/");
      setDelayMs(0);
    } catch (e: any) {
      toast.add(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={props.open} onClose={props.onClose} title="Create Endpoint">
      <div style={{ display: "flex", "flex-direction": "column", gap: "var(--spacing-md)" }}>
        <Input placeholder="Endpoint name (e.g. Get Users)" value={name()} onInput={(e) => setName(e.currentTarget.value)} />
        <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
          <select
            value={method()}
            onChange={(e) => setMethod(e.currentTarget.value)}
            style={{
              background: "var(--color-canvas-soft)",
              color: "var(--color-ink)",
              border: "1px solid var(--color-hairline)",
              "border-radius": "var(--rounded-sm)",
              padding: "var(--spacing-md) var(--spacing-lg)",
              "font-family": "var(--font-sans)",
              "font-size": "14px",
              "min-width": "120px",
            }}
          >
            {METHODS.map((m) => (
              <option value={m}>{m}</option>
            ))}
          </select>
          <div style={{ flex: 1, position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "var(--spacing-lg)",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-mute)",
                "font-size": "14px",
              }}
            >
              /
            </span>
            <Input
              placeholder="my-api/users"
              value={path().replace(/^\//, "")}
              onInput={(e) => setPath("/" + e.currentTarget.value.replace(/^\//, ""))}
              style={{ "padding-left": "28px" } as any}
            />
          </div>
        </div>
        <Input
          type="number"
          placeholder="Delay (ms) — optional"
          value={delayMs() === 0 ? "" : String(delayMs())}
          onInput={(e) => setDelayMs(Number(e.currentTarget.value) || 0)}
        />
        <div style={{ display: "flex", gap: "var(--spacing-sm)", "margin-top": "var(--spacing-sm)" }}>
          <Button variant="primary" onClick={handleCreate} disabled={loading()} style={{ flex: 1 } as any}>
            {loading() ? "Creating..." : "Create"}
          </Button>
          <Button variant="outline" onClick={props.onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}