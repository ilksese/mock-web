import WorkspaceCreateCard from "../components/workspace/WorkspaceCreateCard";

export default function HomePage() {
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