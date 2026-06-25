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
    <Card class="max-w-[480px] mx-auto">
      {!showKey() ? (
        <>
          <h3 class="text-xl font-semibold mb-4">
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
            class="mt-4 w-full"
          >
            {loading() ? "Creating..." : "Create Workspace"}
          </Button>
        </>
      ) : (
        <>
          <h3 class="text-xl font-semibold mb-2 text-primary">
            Workspace Created!
          </h3>
          <p class="text-body text-sm mb-4">
            Save this manage key — it won't be shown again.
          </p>
          <div
            onClick={async () => {
              await navigator.clipboard.writeText(showKey()!);
              toast.add("Key copied!", "success");
            }}
            class="bg-canvas-soft border border-hairline rounded-sm py-3 px-4 font-mono text-[13px] break-all cursor-pointer"
          >
            {showKey()}
          </div>
          <p class="text-mute text-xs mt-2">
            Click to copy. Redirecting to workspace...
          </p>
        </>
      )}
    </Card>
  );
}