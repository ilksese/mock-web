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
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <Badge color={(methodColors as any)[ep().method]}>{ep().method}</Badge>
            <span class="font-semibold text-base">{ep().name}</span>
          </div>
          <code class="font-mono text-[13px] text-primary-soft break-all">
            {ep().path}
          </code>
          {ep().delayMs > 0 && (
            <span class="inline-block ml-2 text-xs text-mute">
              ⏱ {ep().delayMs}ms
            </span>
          )}
        </div>
        <div class="flex items-center gap-3">
          <Toggle checked={ep().enabled} onChange={toggle} />
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <Button variant="outline" onClick={copyUrl} class="text-[13px] py-1.5 px-3">
          Copy URL
        </Button>
        <A href={`/workspace/${props.workspaceId}/endpoint/${ep().id}`}>
          <Button variant="ghost" class="text-[13px] py-1.5 px-3">
            Edit →
          </Button>
        </A>
      </div>
    </Card>
  );
}