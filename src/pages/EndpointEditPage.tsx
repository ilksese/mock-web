import { createSignal, createResource, createMemo, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import EndpointInfoBar from "../components/endpoint/EndpointInfoBar";
import ResponseRuleList from "../components/response/ResponseRuleList";
import ResponseRuleEditor from "../components/response/ResponseRuleEditor";
import Button from "../components/ui/Button";
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

  return (
    <div>
      <Show when={endpoint()}>
        <EndpointInfoBar
          method={endpoint()!.method}
          path={endpoint()!.path}
          name={endpoint()!.name}
        />
      </Show>

      <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "var(--spacing-xl)" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600" }}>Response Rules</h2>
        <Button variant="primary" onClick={handleNew}>+ Add Rule</Button>
      </div>

      <ResponseRuleList rules={rules()} onEdit={handleEdit} onDelete={handleDelete} />

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