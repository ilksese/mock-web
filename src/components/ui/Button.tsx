import { splitProps, type ComponentProps } from "solid-js";

type Variant = "primary" | "outline" | "ghost" | "pill";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
}

export default function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "children", "class"]);
  const v = local.variant ?? "primary";

  const base = "font-sans font-semibold text-base leading-6 cursor-pointer inline-flex items-center justify-center border-none";

  const variantClass = {
    primary: "bg-primary text-on-primary rounded-sm py-3 px-4",
    outline: "bg-canvas text-ink border border-hairline rounded-sm py-3 px-4",
    ghost: "bg-transparent text-primary-soft rounded-sm py-3 px-4",
    pill: "bg-canvas text-ink border border-hairline rounded-pill text-sm py-1 px-3",
  }[v];

  return (
    <button {...rest} class={`${base} ${variantClass} ${local.class ?? ""}`}>
      {local.children}
    </button>
  );
}