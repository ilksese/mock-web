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
    <div class="text-sm">
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-mute text-xs uppercase tracking-[1px]">Query Params</span>
          <Button variant="ghost" onClick={addQuery} class="text-xs py-[2px] px-2">+ Add</Button>
        </div>
        <For each={queryPairs()}>
          {(pair, idx) => (
            <div class="flex gap-1 mb-1">
              <Input placeholder="key" value={pair.key} onInput={(e) => updateQuery(idx(), "key", e.currentTarget.value)} class="flex-1 py-1.5 px-2" />
              <Input placeholder="value" value={pair.value} onInput={(e) => updateQuery(idx(), "value", e.currentTarget.value)} class="flex-1 py-1.5 px-2" />
              <Button variant="ghost" onClick={() => removeQuery(idx())} class="text-xs py-1 px-1.5 text-[#ef4444]">×</Button>
            </div>
          )}
        </For>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-mute text-xs uppercase tracking-[1px]">Headers</span>
          <Button variant="ghost" onClick={addHeader} class="text-xs py-[2px] px-2">+ Add</Button>
        </div>
        <For each={headerPairs()}>
          {(pair, idx) => (
            <div class="flex gap-1 mb-1">
              <Input placeholder="key" value={pair.key} onInput={(e) => updateHeader(idx(), "key", e.currentTarget.value)} class="flex-1 py-1.5 px-2" />
              <Input placeholder="value" value={pair.value} onInput={(e) => updateHeader(idx(), "value", e.currentTarget.value)} class="flex-1 py-1.5 px-2" />
              <Button variant="ghost" onClick={() => removeHeader(idx())} class="text-xs py-1 px-1.5 text-[#ef4444]">×</Button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}