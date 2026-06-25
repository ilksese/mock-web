import { createSignal } from "solid-js";
import Button from "../ui/Button";
import { useToast } from "../../store/toast";

interface Props {
  name: string;
  manageKey: string;
}

export default function WorkspaceHeader(props: Props) {
  const [copied, setCopied] = createSignal(false);
  const toast = useToast();

  const copyKey = async () => {
    await navigator.clipboard.writeText(props.manageKey);
    setCopied(true);
    toast.add("Manage key copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        "align-items": "center",
        "justify-content": "space-between",
        "margin-bottom": "var(--spacing-3xl)",
      }}
    >
      <div>
        <h1 style={{ "font-size": "24px", "font-weight": "700", color: "var(--color-ink-strong)" }}>
          {props.name}
        </h1>
        <p style={{ color: "var(--color-mute)", "font-size": "13px", "margin-top": "4px" }}>
          Manage key: <code style={{ "font-family": "var(--font-mono)", "font-size": "12px" }}>{props.manageKey.slice(0, 12)}...</code>
        </p>
      </div>
      <Button variant="outline" onClick={copyKey}>
        {copied() ? "Copied!" : "Copy Key"}
      </Button>
    </div>
  );
}