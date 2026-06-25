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
    <div
      style={{
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        "border-radius": "var(--rounded-md)",
        padding: "var(--spacing-lg) var(--spacing-xl)",
        "margin-bottom": "var(--spacing-2xl)",
        display: "flex",
        "align-items": "center",
        "justify-content": "space-between",
        "flex-wrap": "wrap",
        gap: "var(--spacing-md)",
      }}
    >
      <div style={{ display: "flex", "align-items": "center", gap: "var(--spacing-md)" }}>
        <Skeleton width="50px" height="22px" radius="4px" />
        <Skeleton width="150px" height="20px" radius="4px" />
        <Skeleton width="180px" height="16px" radius="4px" />
      </div>
      <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
        <Skeleton width="90px" height="28px" radius="var(--rounded-sm)" />
        <Skeleton width="80px" height="28px" radius="var(--rounded-sm)" />
      </div>
    </div>
  );
}

function RuleCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        "border-radius": "var(--rounded-md)",
        padding: "var(--spacing-2xl)",
      }}
    >
      <div style={{ display: "flex", "justify-content": "space-between", "align-items": "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", "align-items": "center", gap: "var(--spacing-sm)", "margin-bottom": "var(--spacing-md)" }}>
            <Skeleton width="30px" height="20px" radius="4px" />
            <Skeleton width="40px" height="22px" radius="4px" />
            <Skeleton width="60px" height="14px" radius="4px" />
          </div>
          <Skeleton width="80%" height="14px" radius="4px" style={{ "margin-bottom": "var(--spacing-sm)" }} />
          <Skeleton width="90%" height="16px" radius="4px" />
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
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

      <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "var(--spacing-xl)" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600" }}>Response Rules</h2>
        <Button variant="primary" onClick={handleNew}>+ Add Rule</Button>
      </div>

      <Show when={!sectionsLoading()} fallback={
        <div style={{ display: "flex", "flex-direction": "column", gap: "var(--spacing-md)" }}>
          <For each={[0, 1, 2]}>{() => <RuleCardSkeleton />}</For>
        </div>
      }>
        <Show
          when={rules().length > 0}
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