interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export default function Toggle(props: ToggleProps) {
  return (
    <label class="inline-flex items-center gap-2 cursor-pointer text-sm text-body">
      <div
        class="w-10 h-[22px] rounded-pill relative transition-colors duration-200"
        style={{ background: props.checked ? "var(--color-primary)" : "var(--color-hairline)" }}
        onClick={() => props.onChange(!props.checked)}
      >
        <div
          class="w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-[left] duration-200"
          style={{ left: props.checked ? "20px" : "2px" }}
        />
      </div>
      {props.label}
    </label>
  );
}