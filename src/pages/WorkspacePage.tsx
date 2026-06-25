import { createSignal, createResource, createEffect, Show, For } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import WorkspaceHeader from "../components/workspace/WorkspaceHeader";
import EndpointList from "../components/endpoint/EndpointList";
import CreateEndpointModal from "../components/endpoint/CreateEndpointModal";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import { api } from "../lib/client";
import { removeRecentWorkspace, clearActiveWorkspace } from "../lib/storage";
import { useWorkspaceStore } from "../store/workspace";

function HeaderSkeleton() {
  return (
    <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "var(--spacing-3xl)" }}>
      <div style={{ flex: 1 }}>
        <Skeleton width="200px" height="24px" radius="4px" style={{ "margin-bottom": "8px" }} />
        <Skeleton width="300px" height="14px" radius="4px" />
      </div>
      <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
        <Skeleton width="90px" height="32px" radius="var(--rounded-sm)" />
        <Skeleton width="140px" height="32px" radius="var(--rounded-sm)" />
      </div>
    </div>
  );
}

function EndpointCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        "border-radius": "var(--rounded-md)",
        padding: "var(--spacing-2xl)",
      }}
    >
      <div style={{ display: "flex", "align-items": "flex-start", "justify-content": "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", "align-items": "center", gap: "var(--spacing-sm)", "margin-bottom": "var(--spacing-sm)" }}>
            <Skeleton width="48px" height="22px" radius="4px" />
            <Skeleton width="120px" height="20px" radius="4px" />
          </div>
          <Skeleton width="70%" height="16px" radius="4px" style={{ "margin-bottom": "var(--spacing-lg)" }} />
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <Skeleton width="70px" height="28px" radius="var(--rounded-sm)" />
            <Skeleton width="60px" height="28px" radius="var(--rounded-sm)" />
          </div>
        </div>
        <Skeleton width="40px" height="22px" radius="var(--rounded-pill)" />
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    await api.deleteWorkspace(params.id);
    removeRecentWorkspace(params.id);
    clearActiveWorkspace();
    navigate("/", { replace: true });
  };

  const handleCreated = () => {
    refetch();
  };

  return (
    <div>
      <Show when={!workspace.loading} fallback={<HeaderSkeleton />}>
        <Show when={workspace()}>
          <WorkspaceHeader name={workspace()!.name} manageKey={workspace()!.manageKey} onDelete={handleDelete} />
        </Show>
      </Show>

      <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "var(--spacing-xl)" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600" }}>Endpoints</h2>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + New Endpoint
        </Button>
      </div>

      <Show when={!endpoints.loading} fallback={
        <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(360px, 1fr))", gap: "var(--spacing-xl)" }}>
          <For each={[0, 1, 2, 3]}>{() => <EndpointCardSkeleton />}</For>
        </div>
      }>
        <Show
          when={endpoints() && endpoints()!.length > 0}
          fallback={
            <div style={{
              background: "var(--color-canvas-soft)",
              "border-radius": "var(--rounded-md)",
              padding: "var(--spacing-3xl)",
              "text-align": "center",
              color: "var(--color-mute)",
              "font-size": "16px",
            }}>
              <p style={{ "margin-bottom": "var(--spacing-sm)" }}>No endpoints yet</p>
              <p style={{ "font-size": "14px" }}>Create your first mock endpoint to get started.</p>
            </div>
          }
        >
          <EndpointList
            endpoints={endpoints() || []}
            workspaceId={params.id}
            onToggle={() => refetch()}
          />
        </Show>
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