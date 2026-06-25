import { createSignal, createResource, createMemo, Show, For } from "solid-js";
import { useParams } from "@solidjs/router";
import EndpointInfoBar from "../components/endpoint/EndpointInfoBar";
import ResponseRuleList from "../components/response/ResponseRuleList";
import ResponseRuleEditor from "../components/response/ResponseRuleEditor";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import { api } from "../lib/client";
import { useToast } from "../store/toast";

interface Rule {
  id: string;
  conditions: string;
  statusCode: number;
  headers: string;
  body: string;
  priority: number;
}

function InfoBarSkeleton() {
  return (
    <div class="bg-canvas border border-hairline rounded-md py-4 px-5 mb-6 flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <Skeleton width="50px" height="22px" radius="4px" />
        <Skeleton width="150px" height="20px" radius="4px" />
        <Skeleton width="180px" height="16px" radius="4px" />
      </div>
      <div class="flex gap-2">
        <Skeleton width="90px" height="28px" radius="var(--rounded-sm)" />
        <Skeleton width="80px" height="28px" radius="var(--rounded-sm)" />
      </div>
    </div>
  );
}

function RuleCardSkeleton() {
  return (
    <div class="bg-canvas border border-hairline rounded-md p-6">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-3">
            <Skeleton width="30px" height="20px" radius="4px" />
            <Skeleton width="40px" height="22px" radius="4px" />
            <Skeleton width="60px" height="14px" radius="4px" />
          </div>
          <Skeleton width="80%" height="14px" radius="4px" class="mb-2" />
          <Skeleton width="90%" height="16px" radius="4px" />
        </div>
        <div class="flex gap-1">
          <Skeleton width="40px" height="24px" radius="var(--rounded-sm)" />
          <Skeleton width="36px" height="24px" radius="var(--rounded-sm)" />
        </div>
      </div>
    </div>
  );
}

export default function EndpointEditPage() {
  const params = useParams<{ id: string; eid: string }>();
  const toast = useToast();
  const [editorOpen, setEditorOpen] = createSignal(false);
  const [editingRule, setEditingRule] = createSignal<Rule | null>(null);

  const [endpoint, { refetch }] = createResource(
    () => ({ wsId: params.id, epId: params.eid }),
    ({ wsId, epId }) => api.getEndpoint(wsId, epId)
  );

  const rules = createMemo(() => endpoint()?.responseRules ?? []);

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setEditorOpen(true);
  };

  const handleNew = () => {
    setEditingRule(null);
    setEditorOpen(true);
  };

  const handleDelete = async (ruleId: string) => {
    try {
      await api.deleteResponseRule(ruleId);
      toast.add("Rule deleted", "success");
      refetch();
    } catch (e: any) {
      toast.add(e.message, "error");
    }
  };

  const sectionsLoading = () => endpoint.loading;

  return (
    <div>
      <Show when={!sectionsLoading()} fallback={<InfoBarSkeleton />}>
        <Show when={endpoint()}>
          <EndpointInfoBar
            method={endpoint()!.method}
            path={endpoint()!.path}
            name={endpoint()!.name}
          />
        </Show>
      </Show>

      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-semibold">Response Rules</h2>
        <Button variant="primary" onClick={handleNew}>+ Add Rule</Button>
      </div>

      <Show when={!sectionsLoading()} fallback={
        <div class="flex flex-col gap-3">
          <For each={[0, 1, 2]}>{() => <RuleCardSkeleton />}</For>
        </div>
      }>
        <Show
          when={rules().length > 0}
          fallback={
            <div class="bg-canvas-soft rounded-md p-8 text-center text-mute text-base">
              <p class="mb-2">No response rules yet</p>
              <p class="text-sm">Add a response rule to define what this endpoint returns.</p>
            </div>
          }
        >
          <ResponseRuleList rules={rules()} onEdit={handleEdit} onDelete={handleDelete} />
        </Show>
      </Show>

      <Show when={endpoint()}>
        <ResponseRuleEditor
          endpointId={params.eid}
          rule={editingRule()}
          open={editorOpen()}
          onClose={() => setEditorOpen(false)}
          onSaved={() => refetch()}
        />
      </Show>
    </div>
  );
}