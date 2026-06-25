import Badge, { methodColors } from "../ui/Badge";
import Button from "../ui/Button";
import { useToast } from "../../store/toast";

interface Props {
  method: string;
  path: string;
  name: string;
}

export default function EndpointInfoBar(props: Props) {
  const toast = useToast();
  const url = `${location.origin}${props.path}`;
  const curl = `curl -X ${props.method} ${url}`;

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
        <Badge color={(methodColors as any)[props.method]}>{props.method}</Badge>
        <span style={{ "font-weight": "600" }}>{props.name}</span>
        <code style={{ "font-family": "var(--font-mono)", "font-size": "13px", color: "var(--color-primary-soft)" }}>
          {props.path}
        </code>
      </div>
      <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
        <Button
          variant="outline"
          onClick={async () => {
            await navigator.clipboard.writeText(curl);
            toast.add("cURL copied!", "success");
          }}
          style={{ "font-size": "13px", padding: "6px 12px" } as any}
        >
          Copy cURL
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            toast.add("URL copied!", "success");
          }}
          style={{ "font-size": "13px", padding: "6px 12px" } as any}
        >
          Copy URL
        </Button>
      </div>
    </div>
  );
}