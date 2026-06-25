import { Hono } from "hono";
import { handle } from "hono/vercel";
import { workspaceRoutes } from "./routes/manage/workspaces";

const app = new Hono().basePath("/");

app.route("/_manage/workspaces", workspaceRoutes);
app.get("/_manage/health", (c) => c.json({ status: "ok" }));

app.all("*", (c) => {
  return c.json({ error: "Not Found", message: "No mock endpoint matches this request" }, 404);
});

export default handle(app);