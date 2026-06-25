import { Hono } from "hono";
import { handle } from "hono/vercel";
import { workspaceRoutes } from "./routes/manage/workspaces";
import { endpointRoutes } from "./routes/manage/endpoints";
import { responseRoutes } from "./routes/manage/responses";
import { serveMock } from "./routes/mock/serve";

const app = new Hono().basePath("/");

app.route("/_manage/workspaces", workspaceRoutes);
app.route("/_manage/workspaces/:wsId/endpoints", endpointRoutes);
app.route("/_manage/endpoints", responseRoutes);
app.get("/_manage/health", (c) => c.json({ status: "ok" }));

// Mock serving catch-all (AFTER all other routes)
app.all("*", serveMock);

export default handle(app);