import type { JSX } from "solid-js";
import NavBar from "./NavBar";
import ToastContainer from "../ui/Toast";

export default function Layout(props: { children: JSX.Element }) {
  return (
    <div style={{ "min-height": "100vh", display: "flex", "flex-direction": "column" }}>
      <NavBar />
      <main style={{ flex: 1, "max-width": "1200px", margin: "0 auto", width: "100%", padding: "var(--spacing-3xl)" }}>
        {props.children}
      </main>
      <ToastContainer />
    </div>
  );
}