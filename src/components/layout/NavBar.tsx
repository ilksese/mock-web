import { A } from "@solidjs/router";

export default function NavBar() {
  return (
    <nav class="bg-canvas text-ink py-3 px-8 flex items-center justify-between border-b border-hairline sticky top-0 z-50">
      <A
        href="/"
        class="flex items-center gap-2 no-underline text-ink-strong font-semibold text-lg"
      >
        <svg width="24" height="24" viewBox="0 0 32 32">
          <path d="M18 4L10 18h5l-1 10 8-14h-5l1-10z" fill="#00d992" />
        </svg>
        MockWeb
      </A>
    </nav>
  );
}