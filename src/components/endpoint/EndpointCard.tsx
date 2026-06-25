import Card from "../ui/Card";
import Badge, { methodColors } from "../ui/Badge";
import Toggle from "../ui/Toggle";
import Button from "../ui/Button";
import { api } from "../../lib/client";
import { useToast } from "../../store/toast";
import { A } from "@solidjs/router";

interface Endpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  enabled: boolean;
  delayMs: number;
}

interface Props {
  endpoint: Endpoint;
  workspaceId: string;
  onToggle: (id: string, enabled: boolean) => void;
}

export default function EndpointCard(props: Props) {
  const ep = () => props.endpoint;
  const toast = useToast();

  const copyUrl = () => {
    const url = `${location.origin}${ep().path}`;
    navigator.clipboard.writeText(url);
    toast.add("URL copied!", "success");
  };

  const toggle = async (enabled: boolean) => {
    try {
      await api.updateEndpoint(props.workspaceId, ep().id, { enabled });
      props.onToggle(ep().id, enabled);
    } catch (e: any) {
      toast.add(e.message, "error");
    }
  };

  return (
    <Card>
      <div style={{ display: "flex", "align-items": "flex-start", "justify-content": "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", "align-items": "center", gap: "var(--spacing-sm)", "margin-bottom": "var(--spacing-sm)" }}>
            <Badge color={(methodColors as any)[ep().method]}>{ep().method}</Badge>
            <span style={{ "font-weight": "600", "font-size": "16px" }}>{ep().name}</span>
          </div>
          <code
            style={{
              "font-family": "var(--font-mono)",
              "font-size": "13px",
              color: "var(--color-primary-soft)",
              "word-break": "break-all",
            }}
          >
            {ep().path}
          </code>
          {ep().delayMs > 0 && (
            <span
              style={{
                display: "inline-block",
                "margin-left": "var(--spacing-sm)",
                "font-size": "12px",
                color: "var(--color-mute)",
              }}
            >
              ⏱ {ep().delayMs}ms
            </span>
          )}
        </div>
        <div style={{ display: "flex", "align-items": "center", gap: "var(--spacing-md)" }}>
          <Toggle checked={ep().enabled} onChange={toggle} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "var(--spacing-sm)", "margin-top": "var(--spacing-lg)" }}>
        <Button variant="outline" onClick={copyUrl} style={{ "font-size": "13px", padding: "6px 12px" } as any}>
          Copy URL
        </Button>
        <A href={`/workspace/${props.workspaceId}/endpoint/${ep().id}`}>
          <Button variant="ghost" style={{ "font-size": "13px", padding: "6px 12px" } as any}>
            Edit →
          </Button>
        </A>
      </div>
    </Card>
  );
}