import type { JSX } from "solid-js";
export default function Layout(props: { children: JSX.Element }) {
  return <div style={{ "min-height": "100vh" }}>{props.children}</div>;
}