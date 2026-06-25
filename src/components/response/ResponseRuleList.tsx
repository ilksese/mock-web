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
        <div class="bg-canvas-soft rounded-md p-8 text-center text-mute text-base">
          <p class="mb-2">No response rules yet</p>
          <p class="text-sm">Add a response rule to define what this endpoint returns.</p>
        </div>
      }
    >
      <div class="flex flex-col gap-3">
        <For each={props.rules}>
          {(rule) => <ResponseRuleCard rule={rule} onEdit={props.onEdit} onDelete={props.onDelete} />}
        </For>
      </div>
    </Show>
  );
}