import { For, Show } from "solid-js";
import ResponseRuleCard from "./ResponseRuleCard";

interface Rule {
  id: string;
  conditions: string;
  statusCode: number;
  headers: string;
  body: string;
  priority: number;
}

interface Props {
  rules: Rule[];
  onEdit: (rule: Rule) => void;
  onDelete: (id: string) => void;
}

export default function ResponseRuleList(props: Props) {
  return (
    <Show
      when={props.rules.length > 0}
      fallback={
        <div style={{
          background: "var(--color-canvas-soft)",
          "border-radius": "var(--rounded-md)",
          padding: "var(--spacing-3xl)",
          "text-align": "center",
          color: "var(--color-mute)",
          "font-size": "16px",
        }}>
          <p style={{ "margin-bottom": "var(--spacing-sm)" }}>No response rules yet</p>
          <p style={{ "font-size": "14px" }}>Add a response rule to define what this endpoint returns.</p>
        </div>
      }
    >
      <div style={{ display: "flex", "flex-direction": "column", gap: "var(--spacing-md)" }}>
        <For each={props.rules}>
          {(rule) => <ResponseRuleCard rule={rule} onEdit={props.onEdit} onDelete={props.onDelete} />}
        </For>
      </div>
    </Show>
  );
}