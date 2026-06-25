interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  class?: string;
}

export default function Skeleton(props: SkeletonProps) {
  return (
    <div
      class={`sk ${props.class ?? ""}`}
      style={{
        width: props.width ?? "100%",
        height: props.height ?? "1em",
        "border-radius": props.radius ?? "var(--rounded-sm)",
      }}
    />
  );
}