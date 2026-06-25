interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function BodyEditor(props: Props) {
  return (
    <textarea
      value={props.value}
      onInput={(e) => props.onChange(e.currentTarget.value)}
      rows={15}
      style={{
        width: "100%",
        background: "var(--color-canvas-soft)",
        color: "var(--color-canvas-text-soft)",
        border: "1px solid var(--color-hairline)",
        "border-radius": "var(--rounded-md)",
        padding: "var(--spacing-xl)",
        "font-family": "var(--font-mono)",
        "font-size": "13px",
        "line-height": "18px",
        resize: "vertical",
        outline: "none",
      }}
      placeholder='{"message": "Hello World"}'
      spellcheck={false}
    />
  );
}