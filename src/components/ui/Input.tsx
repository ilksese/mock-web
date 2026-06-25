import { splitProps, type ComponentProps } from "solid-js";

export default function Input(props: ComponentProps<"input">) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <input
      {...rest}
      class={`bg-canvas-soft text-ink border border-hairline rounded-sm py-3 px-4 font-sans text-sm outline-none w-full ${local.class ?? ""}`}
    />
  );
}