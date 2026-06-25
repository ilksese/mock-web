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
      <div style={{ display: "flex", "justify-content": "space-between", "align-items": "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", "align-items": "center", gap: "var(--spacing-sm)", "margin-bottom": "var(--spacing-sm)" }}>
            <span style={{
              "font-size": "12px",
              color: "var(--color-mute)",
              background: "var(--color-canvas-soft)",
              padding: "2px 8px",
              "border-radius": "var(--rounded-xs)",
            }}>
              P{r.priority}
            </span>
            <Badge color={r.statusCode >= 400 ? "#ef4444" : r.statusCode >= 300 ? "#f59e0b" : "#00d992"}>
              {String(r.statusCode)}
            </Badge>
            {isDefault && (
              <span style={{ "font-size": "12px", color: "var(--color-mute)" }}>Default</span>
            )}
          </div>
          {!isDefault && (
            <div style={{ "font-size": "13px", color: "var(--color-body)", "margin-bottom": "4px" }}>
              {Object.entries(cond).map(([k, v]) => (
                <span style={{ "margin-right": "var(--spacing-md)" }}>
                  {k}: {JSON.stringify(v)}
                </span>
              ))}
            </div>
          )}
          <code style={{
            "font-family": "var(--font-mono)",
            "font-size": "13px",
            color: "var(--color-canvas-text-soft)",
            "word-break": "break-all",
          }}>
            {bodyPreview || "(empty body)"}
          </code>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <Button variant="ghost" onClick={() => props.onEdit(r)} style={{ "font-size": "12px", padding: "4px 8px" } as any}>
            Edit
          </Button>
          <Button variant="ghost" onClick={() => props.onDelete(r.id)} style={{ "font-size": "12px", padding: "4px 8px", color: "#ef4444" } as any}>
            Del
          </Button>
        </div>
      </div>
    </Card>
  );
}