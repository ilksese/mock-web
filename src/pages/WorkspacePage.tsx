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
    <div class="flex items-center justify-between mb-8">
      <div class="flex-1">
        <Skeleton width="200px" height="24px" radius="4px" class="mb-2" />
        <Skeleton width="300px" height="14px" radius="4px" />
      </div>
      <div class="flex gap-2">
        <Skeleton width="90px" height="32px" radius="var(--rounded-sm)" />
        <Skeleton width="140px" height="32px" radius="var(--rounded-sm)" />
      </div>
    </div>
  );
}

function EndpointCardSkeleton() {
  return (
    <div class="bg-canvas border border-hairline rounded-md p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <Skeleton width="48px" height="22px" radius="4px" />
            <Skeleton width="120px" height="20px" radius="4px" />
          </div>
          <Skeleton width="70%" height="16px" radius="4px" class="mb-4" />
          <div class="flex gap-2">
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

      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-semibold">Endpoints</h2>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + New Endpoint
        </Button>
      </div>

      <Show when={!endpoints.loading} fallback={
        <div class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(360px,1fr))]">
          <For each={[0, 1, 2, 3]}>{() => <EndpointCardSkeleton />}</For>
        </div>
      }>
        <Show
          when={endpoints() && endpoints()!.length > 0}
          fallback={
            <div class="bg-canvas-soft rounded-md p-8 text-center text-mute text-base">
              <p class="mb-2">No endpoints yet</p>
              <p class="text-sm">Create your first mock endpoint to get started.</p>
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