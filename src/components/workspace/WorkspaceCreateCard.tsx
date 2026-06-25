import { createSignal } from "solid-js";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { api } from "../../lib/client";
import { useWorkspaceStore } from "../../store/workspace";
import { useNavigate } from "@solidjs/router";
import { useToast } from "../../store/toast";

export default function WorkspaceCreateCard() {
  const [name, setName] = createSignal("");
  const [showKey, setShowKey] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);
  const { setWorkspace } = useWorkspaceStore();
  const navigate = useNavigate();
  const toast = useToast();

  const handleCreate = async () => {
    if (!name().trim()) return;
    setLoading(true);
    try {
      const ws = await api.createWorkspace(name().trim());
      setWorkspace(ws.id, ws.manageKey, ws.name);
      setShowKey(ws.manageKey);
      toast.add("Workspace created!", "success");
      navigate(`/workspace/${ws.id}`);
    } catch (e: any) {
      toast.add(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ "max-width": "480px", margin: "0 auto" }}>
      {!showKey() ? (
        <>
          <h3 style={{ "font-size": "20px", "font-weight": "600", "margin-bottom": "var(--spacing-lg)" }}>
            Create a Workspace
          </h3>
          <Input
            placeholder="My Project"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={loading()}
            style={{ "margin-top": "var(--spacing-lg)", width: "100%" }}
          >
            {loading() ? "Creating..." : "Create Workspace"}
          </Button>
        </>
      ) : (
        <>
          <h3 style={{ "font-size": "20px", "font-weight": "600", "margin-bottom": "var(--spacing-sm)", color: "var(--color-primary)" }}>
            Workspace Created!
          </h3>
          <p style={{ color: "var(--color-body)", "font-size": "14px", "margin-bottom": "var(--spacing-lg)" }}>
            Save this manage key — it won't be shown again.
          </p>
          <div
            onClick={async () => {
              await navigator.clipboard.writeText(showKey()!);
              toast.add("Key copied!", "success");
            }}
            style={{
              background: "var(--color-canvas-soft)",
              border: "1px solid var(--color-hairline)",
              "border-radius": "var(--rounded-sm)",
              padding: "var(--spacing-md) var(--spacing-lg)",
              "font-family": "var(--font-mono)",
              "font-size": "13px",
              "word-break": "break-all",
              cursor: "pointer",
            }}
          >
            {showKey()}
          </div>
          <p style={{ color: "var(--color-mute)", "font-size": "12px", "margin-top": "var(--spacing-sm)" }}>
            Click to copy. Redirecting to workspace...
          </p>
        </>
      )}
    </Card>
  );
}