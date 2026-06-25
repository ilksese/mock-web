import { Hono } from "hono";
import { workspaceRoutes } from "./routes/manage/workspaces.js";
import { endpointRoutes } from "./routes/manage/endpoints.js";
import { responseRoutes } from "./routes/manage/responses.js";
import { serveMock } from "./routes/mock/serve.js";

export const app = new Hono().basePath("/");

app.route("/_manage/workspaces", workspaceRoutes);
app.route("/_manage/workspaces/:wsId/endpoints", endpointRoutes);
app.route("/_manage/endpoints", responseRoutes);
app.route("/_manage/responses", responseRoutes);
app.get("/_manage/health", (c) => c.json({ status: "ok" }));

// Mock serving catch-all (AFTER all other routes)
app.all("*", serveMock);
