import { For, createSignal } from "solid-js";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface KV { key: string; value: string }

interface Props {
  conditions: Record<string, any>;
  onChange: (cond: Record<string, any>) => void;
}

export default function ConditionBuilder(props: Props) {
  const [queryPairs, setQueryPairs] = createSignal<KV[]>(entriesToKV(props.conditions.query || {}));
  const [headerPairs, setHeaderPairs] = createSignal<KV[]>(entriesToKV(props.conditions.headers || {}));

  function entriesToKV(obj: Record<string, string>): KV[] {
    return Object.entries(obj).map(([k, v]) => ({ key: k, value: v }));
  }

  function kvToObj(pairs: KV[]): Record<string, string> {
    const obj: Record<string, string> = {};
    for (const p of pairs) {
      if (p.key.trim()) obj[p.key.trim()] = p.value;
    }
    return obj;
  }

  function emit() {
    props.onChange({
      query: kvToObj(queryPairs()),
      headers: kvToObj(headerPairs()),
    });
  }

  function addQuery() { setQueryPairs([...queryPairs(), { key: "", value: "" }]); }
  function addHeader() { setHeaderPairs([...headerPairs(), { key: "", value: "" }]); }

  function updateQuery(idx: number, field: "key" | "value", val: string) {
    const p = [...queryPairs()];
    p[idx] = { ...p[idx], [field]: val };
    setQueryPairs(p);
    emit();
  }

  function updateHeader(idx: number, field: "key" | "value", val: string) {
    const p = [...headerPairs()];
    p[idx] = { ...p[idx], [field]: val };
    setHeaderPairs(p);
    emit();
  }

  function removeQuery(idx: number) {
    setQueryPairs(queryPairs().filter((_, i) => i !== idx));
    emit();
  }

  function removeHeader(idx: number) {
    setHeaderPairs(headerPairs().filter((_, i) => i !== idx));
    emit();
  }

  return (
    <div style={{ "font-size": "14px" }}>
      <div style={{ "margin-bottom": "var(--spacing-md)" }}>
        <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "4px" }}>
          <span style={{ color: "var(--color-mute)", "font-size": "12px", "text-transform": "uppercase", "letter-spacing": "1px" }}>Query Params</span>
          <Button variant="ghost" onClick={addQuery} style={{ "font-size": "12px", padding: "2px 8px" } as any}>+ Add</Button>
        </div>
        <For each={queryPairs()}>
          {(pair, idx) => (
            <div style={{ display: "flex", gap: "4px", "margin-bottom": "4px" }}>
              <Input placeholder="key" value={pair.key} onInput={(e) => updateQuery(idx(), "key", e.currentTarget.value)} style={{ flex: 1, padding: "6px 8px" } as any} />
              <Input placeholder="value" value={pair.value} onInput={(e) => updateQuery(idx(), "value", e.currentTarget.value)} style={{ flex: 1, padding: "6px 8px" } as any} />
              <Button variant="ghost" onClick={() => removeQuery(idx())} style={{ "font-size": "12px", padding: "4px 6px", color: "#ef4444" } as any}>×</Button>
            </div>
          )}
        </For>
      </div>

      <div>
        <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "4px" }}>
          <span style={{ color: "var(--color-mute)", "font-size": "12px", "text-transform": "uppercase", "letter-spacing": "1px" }}>Headers</span>
          <Button variant="ghost" onClick={addHeader} style={{ "font-size": "12px", padding: "2px 8px" } as any}>+ Add</Button>
        </div>
        <For each={headerPairs()}>
          {(pair, idx) => (
            <div style={{ display: "flex", gap: "4px", "margin-bottom": "4px" }}>
              <Input placeholder="key" value={pair.key} onInput={(e) => updateHeader(idx(), "key", e.currentTarget.value)} style={{ flex: 1, padding: "6px 8px" } as any} />
              <Input placeholder="value" value={pair.value} onInput={(e) => updateHeader(idx(), "value", e.currentTarget.value)} style={{ flex: 1, padding: "6px 8px" } as any} />
              <Button variant="ghost" onClick={() => removeHeader(idx())} style={{ "font-size": "12px", padding: "4px 6px", color: "#ef4444" } as any}>×</Button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}