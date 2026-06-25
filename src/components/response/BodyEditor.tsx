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
      class="w-full bg-canvas-soft text-canvas-text-soft border border-hairline rounded-md p-5 font-mono text-[13px] leading-[18px] resize-y outline-none"
      placeholder='{"message": "Hello World"}'
      spellcheck={false}
    />
  );
}