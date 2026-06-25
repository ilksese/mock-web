interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export default function Toggle(props: ToggleProps) {
  return (
    <label
      style={{
        display: "inline-flex",
        "align-items": "center",
        gap: "var(--spacing-sm)",
        cursor: "pointer",
        "font-size": "14px",
        color: "var(--color-body)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "22px",
          "border-radius": "var(--rounded-pill)",
          background: props.checked ? "var(--color-primary)" : "var(--color-hairline)",
          position: "relative",
          transition: "background 0.2s",
        }}
        onClick={() => props.onChange(!props.checked)}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            "border-radius": "50%",
            background: "#fff",
            position: "absolute",
            top: "2px",
            left: props.checked ? "20px" : "2px",
            transition: "left 0.2s",
          }}
        />
      </div>
      {props.label}
    </label>
  );
}