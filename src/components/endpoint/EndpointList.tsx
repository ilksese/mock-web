import { For } from "solid-js";
import EndpointCard from "./EndpointCard";

interface Endpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  enabled: boolean;
  delayMs: number;
}

interface Props {
  endpoints: Endpoint[];
  workspaceId: string;
  onToggle: (id: string, enabled: boolean) => void;
}

export default function EndpointList(props: Props) {
  if (props.endpoints.length === 0) {
    return (
      <div class="bg-canvas-soft rounded-md p-8 text-center text-mute text-base">
        <p class="mb-2">No endpoints yet</p>
        <p class="text-sm">Create your first mock endpoint to get started.</p>
      </div>
    );
  }

  return (
    <div class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(360px,1fr))]">
      <For each={props.endpoints}>
        {(ep) => (
          <EndpointCard endpoint={ep} workspaceId={props.workspaceId} onToggle={props.onToggle} />
        )}
      </For>
    </div>
  );
}