import { A } from "@solidjs/router";

export default function NavBar() {
  return (
    <nav
      style={{
        background: "var(--color-canvas)",
        color: "var(--color-ink)",
        padding: "var(--spacing-md) var(--spacing-3xl)",
        display: "flex",
        "align-items": "center",
        "justify-content": "space-between",
        "border-bottom": "1px solid var(--color-hairline)",
        position: "sticky",
        top: 0,
        "z-index": 50,
      }}
    >
      <A
        href="/"
        style={{
          display: "flex",
          "align-items": "center",
          gap: "var(--spacing-sm)",
          "text-decoration": "none",
          color: "var(--color-ink-strong)",
          "font-weight": "600",
          "font-size": "18px",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 32 32">
          <path d="M18 4L10 18h5l-1 10 8-14h-5l1-10z" fill="#00d992" />
        </svg>
        MockWeb
      </A>
    </nav>
  );
}