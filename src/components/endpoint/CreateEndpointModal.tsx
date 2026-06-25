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
      <div class="flex flex-col gap-3">
        <Input placeholder="Endpoint name (e.g. Get Users)" value={name()} onInput={(e) => setName(e.currentTarget.value)} />
        <div class="flex gap-2">
          <select
            value={method()}
            onChange={(e) => setMethod(e.currentTarget.value)}
            class="bg-canvas-soft text-ink border border-hairline rounded-sm py-3 px-4 font-sans text-sm min-w-[120px]"
          >
            {METHODS.map((m) => (
              <option value={m}>{m}</option>
            ))}
          </select>
          <div class="flex-1 relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-mute text-sm">
              /
            </span>
            <Input
              placeholder="my-api/users"
              value={path().replace(/^\//, "")}
              onInput={(e) => setPath("/" + e.currentTarget.value.replace(/^\//, ""))}
              class="pl-7"
            />
          </div>
        </div>
        <Input
          type="number"
          placeholder="Delay (ms) — optional"
          value={delayMs() === 0 ? "" : String(delayMs())}
          onInput={(e) => setDelayMs(Number(e.currentTarget.value) || 0)}
        />
        <div class="flex gap-2 mt-2">
          <Button variant="primary" onClick={handleCreate} disabled={loading()} class="flex-1">
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