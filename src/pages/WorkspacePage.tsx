import { createSignal, createResource, createEffect, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import WorkspaceHeader from "../components/workspace/WorkspaceHeader";
import EndpointList from "../components/endpoint/EndpointList";
import CreateEndpointModal from "../components/endpoint/CreateEndpointModal";
import Button from "../components/ui/Button";
import { api } from "../lib/client";
import { useWorkspaceStore } from "../store/workspace";

export default function WorkspacePage() {
  const params = useParams<{ id: string }>();
  const [modalOpen, setModalOpen] = createSignal(false);
  const { setWorkspace } = useWorkspaceStore();

  const [workspace] = createResource(() => params.id, api.getWorkspace);
  const [endpoints, { refetch }] = createResource(() => params.id, api.getEndpoints);

  createEffect(() => {
    const ws = workspace();
    if (ws) {
      setWorkspace(ws.id, ws.manageKey, ws.name);
    }
  });

  const handleCreated = () => {
    refetch();
  };

  return (
    <div>
      <Show when={workspace()}>
        <WorkspaceHeader name={workspace()!.name} manageKey={workspace()!.manageKey} />
      </Show>

      <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "var(--spacing-xl)" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600" }}>Endpoints</h2>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + New Endpoint
        </Button>
      </div>

      <Show when={endpoints()}>
        <EndpointList
          endpoints={endpoints() || []}
          workspaceId={params.id}
          onToggle={() => refetch()}
        />
      </Show>

      <CreateEndpointModal
        open={modalOpen()}
        workspaceId={params.id}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}