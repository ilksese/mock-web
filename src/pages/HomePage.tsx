import { createMemo } from "solid-js";
import { A } from "@solidjs/router";
import WorkspaceCreateCard from "../components/workspace/WorkspaceCreateCard";
import { getRecentWorkspaces } from "../lib/storage";

export default function HomePage() {
  const recents = createMemo(() => getRecentWorkspaces());

  return (
    <div>
      <section class="text-center py-12">
        <p class="font-sans text-sm font-semibold tracking-[2.52px] text-mute mb-4 uppercase">
          Online Mock API Platform
        </p>
        <h1 class="font-sans text-[60px] font-normal leading-[60px] tracking-[-0.65px] text-ink-strong mb-4">
          Mock APIs in Seconds
        </h1>
        <p class="text-lg text-body max-w-[600px] mx-auto mb-10">
          Create custom endpoints, define responses with status codes and
          headers, and start testing immediately — no deployment, no config.
        </p>
      </section>

      <WorkspaceCreateCard />

      {recents().length > 0 && (
        <section class="max-w-[480px] mx-auto mt-10">
          <h3 class="text-sm font-semibold uppercase tracking-[1px] text-mute mb-4">
            Recent Workspaces
          </h3>
          <div class="flex flex-col gap-2">
            {recents().map((ws) => (
              <A
                href={`/workspace/${ws.id}`}
                class="block py-3 px-4 bg-canvas-soft border border-hairline rounded-sm no-underline text-ink-strong text-sm transition-colors"
              >
                {ws.name}
              </A>
            ))}
          </div>
        </section>
      )}

      <div class="text-center mt-10 text-mute text-sm">
        <p>Workspaces are managed via Bearer token. No account required.</p>
      </div>
    </div>
  );
}