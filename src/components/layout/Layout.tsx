import type { JSX } from "solid-js";
import NavBar from "./NavBar";
import ToastContainer from "../ui/Toast";

export default function Layout(props: { children: JSX.Element }) {
  return (
    <div class="min-h-screen flex flex-col">
      <NavBar />
      <main class="flex-1 max-w-[1200px] mx-auto w-full p-8">
        {props.children}
      </main>
      <ToastContainer />
    </div>
  );
}