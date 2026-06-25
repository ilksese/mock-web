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
    <div class="bg-canvas border border-hairline rounded-md py-4 px-5 mb-6 flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <Badge color={(methodColors as any)[props.method]}>{props.method}</Badge>
        <span class="font-semibold">{props.name}</span>
        <code class="font-mono text-[13px] text-primary-soft">
          {props.path}
        </code>
      </div>
      <div class="flex gap-2">
        <Button
          variant="outline"
          onClick={async () => {
            await navigator.clipboard.writeText(curl);
            toast.add("cURL copied!", "success");
          }}
          class="text-[13px] py-1.5 px-3"
        >
          Copy cURL
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            toast.add("URL copied!", "success");
          }}
          class="text-[13px] py-1.5 px-3"
        >
          Copy URL
        </Button>
      </div>
    </div>
  );
}