import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface Rule {
  id: string;
  conditions: string;
  statusCode: number;
  headers: string;
  body: string;
  priority: number;
}

interface Props {
  rule: Rule;
  onEdit: (rule: Rule) => void;
  onDelete: (id: string) => void;
}

function parseJSON(s: string): any {
  try { return JSON.parse(s); } catch { return {}; }
}

export default function ResponseRuleCard(props: Props) {
  const r = props.rule;
  const cond = parseJSON(r.conditions);
  const isDefault = !cond || Object.keys(cond).length === 0;

  const bodyPreview = r.body.length > 80 ? r.body.slice(0, 80) + "..." : r.body;

  return (
    <Card>
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs text-mute bg-canvas-soft py-[2px] px-2 rounded-xs">
              P{r.priority}
            </span>
            <Badge color={r.statusCode >= 400 ? "#ef4444" : r.statusCode >= 300 ? "#f59e0b" : "#00d992"}>
              {String(r.statusCode)}
            </Badge>
            {isDefault && (
              <span class="text-xs text-mute">Default</span>
            )}
          </div>
          {!isDefault && (
            <div class="text-[13px] text-body mb-1">
              {Object.entries(cond).map(([k, v]) => (
                <span class="mr-3">
                  {k}: {JSON.stringify(v)}
                </span>
              ))}
            </div>
          )}
          <code class="font-mono text-[13px] text-canvas-text-soft break-all">
            {bodyPreview || "(empty body)"}
          </code>
        </div>
        <div class="flex gap-1">
          <Button variant="ghost" onClick={() => props.onEdit(r)} class="text-xs py-1 px-2">
            Edit
          </Button>
          <Button variant="ghost" onClick={() => props.onDelete(r.id)} class="text-xs py-1 px-2 text-[#ef4444]">
            Del
          </Button>
        </div>
      </div>
    </Card>
  );
}