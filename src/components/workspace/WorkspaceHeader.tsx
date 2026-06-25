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
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
          "margin-bottom": "var(--spacing-3xl)",
        }}
      >
        <div>
          <h1 style={{ "font-size": "24px", "font-weight": "700", color: "var(--color-ink-strong)" }}>
            {props.name}
          </h1>
          <p style={{ color: "var(--color-mute)", "font-size": "13px", "margin-top": "4px" }}>
            Manage key: <code style={{ "font-family": "var(--font-mono)", "font-size": "12px" }}>{props.manageKey.slice(0, 12)}...</code>
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
          <Button variant="outline" onClick={copyKey}>
            {copied() ? "Copied!" : "Copy Key"}
          </Button>
          <button
            onClick={openConfirm}
            style={{
              "font-family": "var(--font-sans)",
              "font-size": "16px",
              "font-weight": "600",
              "line-height": "24px",
              padding: "var(--spacing-md) var(--spacing-lg)",
              "border-radius": "var(--rounded-sm)",
              cursor: "pointer",
              background: "transparent",
              color: "#ef4444",
              border: "1px solid #ef4444",
              display: "inline-flex",
              "align-items": "center",
              "justify-content": "center",
            }}
          >
            Delete Workspace
          </button>
        </div>
      </div>

      <Modal open={confirmOpen()} onClose={() => setConfirmOpen(false)} title="Delete Workspace">
        <p style={{ color: "var(--color-body)", "font-size": "14px", "margin-bottom": "var(--spacing-lg)" }}>
          This will permanently delete <strong style={{ color: "var(--color-ink-strong)" }}>{props.name}</strong> and all endpoints and response rules inside it. This action cannot be undone.
        </p>
        <p style={{ color: "var(--color-mute)", "font-size": "13px", "margin-bottom": "var(--spacing-md)" }}>
          Type the workspace name to confirm:
        </p>
        <Input
          placeholder={props.name}
          value={confirmName()}
          onInput={(e) => setConfirmName(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && confirmName() === props.name && handleDelete()}
        />
        <div style={{ display: "flex", gap: "var(--spacing-sm)", "margin-top": "var(--spacing-lg)" }}>
          <button
            onClick={handleDelete}
            disabled={confirmName() !== props.name || deleting()}
            style={{
              flex: 1,
              "font-family": "var(--font-sans)",
              "font-size": "16px",
              "font-weight": "600",
              "line-height": "24px",
              padding: "var(--spacing-md) var(--spacing-lg)",
              "border-radius": "var(--rounded-sm)",
              cursor: confirmName() === props.name && !deleting() ? "pointer" : "not-allowed",
              background: confirmName() === props.name ? "#ef4444" : "var(--color-canvas-soft)",
              color: confirmName() === props.name ? "#ffffff" : "var(--color-mute)",
              border: "none",
              display: "inline-flex",
              "align-items": "center",
              "justify-content": "center",
              opacity: confirmName() === props.name ? 1 : 0.5,
            }}
          >
            {deleting() ? "Deleting..." : "Delete"}
          </button>
          <Button variant="outline" onClick={() => setConfirmOpen(false)} style={{ flex: 1 }}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}