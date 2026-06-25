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
      <div
        style={{
          background: "var(--color-canvas-soft)",
          "border-radius": "var(--rounded-md)",
          padding: "var(--spacing-3xl)",
          "text-align": "center",
          color: "var(--color-mute)",
          "font-size": "16px",
        }}
      >
        <p style={{ "margin-bottom": "var(--spacing-sm)" }}>No endpoints yet</p>
        <p style={{ "font-size": "14px" }}>Create your first mock endpoint to get started.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        "grid-template-columns": "repeat(auto-fill, minmax(360px, 1fr))",
        gap: "var(--spacing-xl)",
      }}
    >
      <For each={props.endpoints}>
        {(ep) => (
          <EndpointCard endpoint={ep} workspaceId={props.workspaceId} onToggle={props.onToggle} />
        )}
      </For>
    </div>
  );
}