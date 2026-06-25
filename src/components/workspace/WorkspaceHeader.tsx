import { createSignal } from "solid-js";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import { useToast } from "../../store/toast";

interface Props {
  name: string;
  manageKey: string;
  onDelete: () => void;
}

export default function WorkspaceHeader(props: Props) {
  const [copied, setCopied] = createSignal(false);
  const [confirmOpen, setConfirmOpen] = createSignal(false);
  const [confirmName, setConfirmName] = createSignal("");
  const [deleting, setDeleting] = createSignal(false);
  const toast = useToast();

  const copyKey = async () => {
    await navigator.clipboard.writeText(props.manageKey);
    setCopied(true);
    toast.add("Manage key copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const openConfirm = () => {
    setConfirmName("");
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await props.onDelete();
    } catch (e: any) {
      toast.add(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-ink-strong">
            {props.name}
          </h1>
          <p class="text-mute text-[13px] mt-1">
            Manage key: <code class="font-mono text-xs">{props.manageKey.slice(0, 12)}...</code>
          </p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" onClick={copyKey}>
            {copied() ? "Copied!" : "Copy Key"}
          </Button>
          <button
            onClick={openConfirm}
            class="font-sans font-semibold text-base leading-6 py-3 px-4 rounded-sm cursor-pointer bg-transparent text-[#ef4444] border border-[#ef4444] inline-flex items-center justify-center"
          >
            Delete Workspace
          </button>
        </div>
      </div>

      <Modal open={confirmOpen()} onClose={() => setConfirmOpen(false)} title="Delete Workspace">
        <p class="text-body text-sm mb-4">
          This will permanently delete <strong class="text-ink-strong">{props.name}</strong> and all endpoints and response rules inside it. This action cannot be undone.
        </p>
        <p class="text-mute text-[13px] mb-3">
          Type the workspace name to confirm:
        </p>
        <Input
          placeholder={props.name}
          value={confirmName()}
          onInput={(e) => setConfirmName(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && confirmName() === props.name && handleDelete()}
        />
        <div class="flex gap-2 mt-4">
          <button
            onClick={handleDelete}
            disabled={confirmName() !== props.name || deleting()}
            class={`flex-1 font-sans font-semibold text-base leading-6 py-3 px-4 rounded-sm cursor-pointer inline-flex items-center justify-center border-none ${confirmName() === props.name ? "bg-[#ef4444] text-white cursor-pointer opacity-100" : "bg-canvas-soft text-mute cursor-not-allowed opacity-50"}`}
          >
            {deleting() ? "Deleting..." : "Delete"}
          </button>
          <Button variant="outline" onClick={() => setConfirmOpen(false)} class="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}