import { Hono } from "hono";
import { db } from "../../db/index.js";
import { endpoints, workspaces } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { workspaceAuth } from "../../middleware/auth.js";

const VALID_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

type Variables = {
  workspace: typeof workspaces.$inferSelect;
};

const ep = new Hono<{ Variables: Variables }>();

// POST /_manage/workspaces/:wsId/endpoints
ep.post("/", workspaceAuth, async (c) => {
  const ws = c.get("workspace");
  const body = await c.req.json<{ name: string; method: string; path: string; delayMs?: number }>();
  const errors: string[] = [];
  if (!body.name?.trim()) errors.push("name is required");
  if (!VALID_METHODS.includes(body.method as any)) errors.push("method must be one of: GET, POST, PUT, DELETE, PATCH");
  if (!body.path || !body.path.startsWith("/")) errors.push("path must start with /");
  if (errors.length) return c.json({ error: "Validation Error", details: errors }, 400);

  const [endpoint] = await db
    .insert(endpoints)
    .values({
      workspaceId: ws.id,
      name: body.name.trim(),
      method: body.method as typeof VALID_METHODS[number],
      path: body.path,
      delayMs: body.delayMs ?? 0,
    })
    .returning();
  return c.json(endpoint, 201);
});

// GET /_manage/workspaces/:wsId/endpoints
ep.get("/", workspaceAuth, async (c) => {
  const ws = c.get("workspace");
  const list = await db.query.endpoints.findMany({
    where: eq(endpoints.workspaceId, ws.id),
    orderBy: (ep, { desc }) => [desc(ep.updatedAt)],
  });
  return c.json(list);
});

// GET /_manage/workspaces/:wsId/endpoints/:id
ep.get("/:id", workspaceAuth, async (c) => {
  const ws = c.get("workspace");
  const ep = await db.query.endpoints.findFirst({
    where: and(eq(endpoints.id, c.req.param("id")!), eq(endpoints.workspaceId, ws.id)),
    with: { responseRules: true },
  });
  if (!ep) return c.json({ error: "Not Found" }, 404);
  return c.json(ep);
});

// PUT /_manage/workspaces/:wsId/endpoints/:id
ep.put("/:id", workspaceAuth, async (c) => {
  const ws = c.get("workspace");
  const body = await c.req.json<{ name?: string; method?: string; path?: string; enabled?: boolean; delayMs?: number }>();
  const updateData: Record<string, any> = { updatedAt: new Date() };
  if (body.name !== undefined) {
    if (!body.name.trim()) return c.json({ error: "Validation Error", details: ["name cannot be empty"] }, 400);
    updateData.name = body.name.trim();
  }
  if (body.method !== undefined) {
    if (!VALID_METHODS.includes(body.method as any)) return c.json({ error: "Validation Error", details: ["invalid method"] }, 400);
    updateData.method = body.method;
  }
  if (body.path !== undefined) {
    if (!body.path.startsWith("/")) return c.json({ error: "Validation Error", details: ["path must start with /"] }, 400);
    updateData.path = body.path;
  }
  if (body.enabled !== undefined) updateData.enabled = body.enabled;
  if (body.delayMs !== undefined) updateData.delayMs = body.delayMs;

  const [updated] = await db
    .update(endpoints)
    .set(updateData)
    .where(and(eq(endpoints.id, c.req.param("id")!), eq(endpoints.workspaceId, ws.id)))
    .returning();
  if (!updated) return c.json({ error: "Not Found" }, 404);
  return c.json(updated);
});

// DELETE /_manage/workspaces/:wsId/endpoints/:id
ep.delete("/:id", workspaceAuth, async (c) => {
  const ws = c.get("workspace");
  const [deleted] = await db
    .delete(endpoints)
    .where(and(eq(endpoints.id, c.req.param("id")!), eq(endpoints.workspaceId, ws.id)))
    .returning({ id: endpoints.id });
  if (!deleted) return c.json({ error: "Not Found" }, 404);
  return c.json({ success: true });
});

export const endpointRoutes = ep;