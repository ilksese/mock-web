interface CodeBlockProps {
  children: string;
  class?: string;
}

export default function CodeBlock(props: CodeBlockProps) {
  return (
    <pre class={`bg-canvas-soft text-canvas-text-soft border border-hairline rounded-md p-5 font-mono text-[13px] leading-[18px] overflow-auto whitespace-pre-wrap break-words m-0 ${props.class ?? ""}`}>
      {props.children}
    </pre>
  );
}