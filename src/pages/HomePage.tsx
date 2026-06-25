import { createMemo } from "solid-js";
import { A } from "@solidjs/router";
import WorkspaceCreateCard from "../components/workspace/WorkspaceCreateCard";
import { getRecentWorkspaces } from "../lib/storage";

export default function HomePage() {
  const recents = createMemo(() => getRecentWorkspaces());

  return (
    <div>
      <section
        style={{
          "text-align": "center",
          padding: "var(--spacing-5xl) 0",
        }}
      >
        <p
          style={{
            "font-family": "var(--font-sans)",
            "font-size": "14px",
            "font-weight": "600",
            "letter-spacing": "2.52px",
            color: "var(--color-mute)",
            "margin-bottom": "var(--spacing-lg)",
            "text-transform": "uppercase",
          }}
        >
          Online Mock API Platform
        </p>
        <h1
          style={{
            "font-family": "var(--font-sans)",
            "font-size": "60px",
            "font-weight": "400",
            "line-height": "60px",
            "letter-spacing": "-0.65px",
            color: "var(--color-ink-strong)",
            "margin-bottom": "var(--spacing-lg)",
          }}
        >
          Mock APIs in Seconds
        </h1>
        <p
          style={{
            "font-size": "18px",
            color: "var(--color-body)",
            "max-width": "600px",
            margin: "0 auto var(--spacing-4xl)",
          }}
        >
          Create custom endpoints, define responses with status codes and
          headers, and start testing immediately — no deployment, no config.
        </p>
      </section>

      <WorkspaceCreateCard />

      {recents().length > 0 && (
        <section style={{ "max-width": "480px", margin: "var(--spacing-4xl) auto 0" }}>
          <h3 style={{ "font-size": "14px", "font-weight": "600", "text-transform": "uppercase", "letter-spacing": "1px", color: "var(--color-mute)", "margin-bottom": "var(--spacing-lg)" }}>
            Recent Workspaces
          </h3>
          <div style={{ display: "flex", "flex-direction": "column", gap: "var(--spacing-sm)" }}>
            {recents().map((ws) => (
              <A
                href={`/workspace/${ws.id}`}
                style={{
                  display: "block",
                  padding: "var(--spacing-md) var(--spacing-lg)",
                  background: "var(--color-canvas-soft)",
                  border: "1px solid var(--color-hairline)",
                  "border-radius": "var(--rounded-sm)",
                  "text-decoration": "none",
                  color: "var(--color-ink-strong)",
                  "font-size": "14px",
                  transition: "border-color 0.15s",
                }}
              >
                {ws.name}
              </A>
            ))}
          </div>
        </section>
      )}

      <div
        style={{
          "text-align": "center",
          "margin-top": "var(--spacing-4xl)",
          color: "var(--color-mute)",
          "font-size": "14px",
        }}
      >
        <p>Workspaces are managed via Bearer token. No account required.</p>
      </div>
    </div>
  );
}