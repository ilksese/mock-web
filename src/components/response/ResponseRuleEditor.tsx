import { createSignal, createEffect } from "solid-js";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ConditionBuilder from "./ConditionBuilder";
import BodyEditor from "./BodyEditor";
import { api } from "../../lib/client";
import { useToast } from "../../store/toast";

interface Rule {
  id: string;
  conditions: string;
  statusCode: number;
  headers: string;
  body: string;
  priority: number;
}

interface Props {
  endpointId: string;
  rule: Rule | null; // null = create mode
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function parseJSON(s: string): any {
  try { return JSON.parse(s); } catch { return {}; }
}

export default function ResponseRuleEditor(props: Props) {
  const isEdit = () => props.rule !== null;
  const [conditions, setConditions] = createSignal<Record<string, any>>({});
  const [statusCode, setStatusCode] = createSignal(200);
  const [headers, setHeaders] = createSignal('{"Content-Type": "application/json"}');
  const [body, setBody] = createSignal("");
  const [priority, setPriority] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const toast = useToast();

  createEffect(() => {
    if (props.open && props.rule) {
      setConditions(parseJSON(props.rule.conditions));
      setStatusCode(props.rule.statusCode);
      setHeaders(props.rule.headers);
      setBody(props.rule.body);
      setPriority(props.rule.priority);
    } else if (props.open) {
      setConditions({});
      setStatusCode(200);
      setHeaders('{"Content-Type": "application/json"}');
      setBody("");
      setPriority(0);
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = {
        conditions: conditions(),
        statusCode: statusCode(),
        headers: (() => { try { JSON.parse(headers()); return headers(); } catch { return '{"Content-Type": "application/json"}'; } })(),
        body: body(),
        priority: priority(),
      };
      if (isEdit()) {
        await api.updateResponseRule(props.rule!.id, data);
      } else {
        await api.createResponseRule(props.endpointId, data);
      }
      toast.add(isEdit() ? "Rule updated!" : "Rule created!", "success");
      props.onSaved();
      props.onClose();
    } catch (e: any) {
      toast.add(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={props.open} onClose={props.onClose} title={isEdit() ? "Edit Response Rule" : "New Response Rule"}>
      <div style={{ display: "flex", "flex-direction": "column", gap: "var(--spacing-md)" }}>
        <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
          <div style={{ flex: 1 }}>
            <label style={{ "font-size": "12px", color: "var(--color-mute)" }}>Status Code</label>
            <Input type="number" value={String(statusCode())} onInput={(e) => setStatusCode(Number(e.currentTarget.value) || 200)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ "font-size": "12px", color: "var(--color-mute)" }}>Priority</label>
            <Input type="number" value={String(priority())} onInput={(e) => setPriority(Number(e.currentTarget.value) || 0)} />
          </div>
        </div>

        <div>
          <label style={{ "font-size": "12px", color: "var(--color-mute)" }}>Headers (JSON)</label>
          <Input value={headers()} onInput={(e) => setHeaders(e.currentTarget.value)} placeholder='{"Content-Type": "application/json"}' />
        </div>

        <div>
          <label style={{ "font-size": "12px", color: "var(--color-mute)", "margin-bottom": "4px", display: "block" }}>Conditions</label>
          <ConditionBuilder conditions={conditions()} onChange={setConditions} />
        </div>

        <div>
          <label style={{ "font-size": "12px", color: "var(--color-mute)", "margin-bottom": "4px", display: "block" }}>Response Body</label>
          <BodyEditor value={body()} onChange={setBody} />
        </div>

        <div style={{ display: "flex", gap: "var(--spacing-sm)", "margin-top": "var(--spacing-sm)" }}>
          <Button variant="primary" onClick={handleSave} disabled={loading()} style={{ flex: 1 } as any}>
            {loading() ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={props.onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}