import { Hono } from "hono";
import { db } from "../../db";
import { responseRules, endpoints, workspaces } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { workspaceAuth } from "../../middleware/auth";

type Variables = {
  workspace: typeof workspaces.$inferSelect;
};

const resp = new Hono<{ Variables: Variables }>();

// POST /_manage/endpoints/:epId/responses
resp.post("/:epId/responses", workspaceAuth, async (c) => {
  const epId = c.req.param("epId")!;
  const ws = c.get("workspace");
  const ep = await db.query.endpoints.findFirst({
    where: and(eq(endpoints.id, epId), eq(endpoints.workspaceId, ws.id)),
  });
  if (!ep) return c.json({ error: "Not Found" }, 404);

  const body = await c.req.json<{
    conditions?: Record<string, any>;
    statusCode?: number;
    headers?: Record<string, string>;
    body?: string;
    priority?: number;
  }>();

  const [rule] = await db
    .insert(responseRules)
    .values({
      endpointId: epId,
      conditions: JSON.stringify(body.conditions ?? {}),
      statusCode: body.statusCode ?? 200,
      headers: typeof body.headers === "string" ? body.headers : JSON.stringify(body.headers ?? { "Content-Type": "application/json" }),
      body: body.body ?? "",
      priority: body.priority ?? 0,
    })
    .returning();
  return c.json(rule, 201);
});

// PUT /_manage/responses/:id
resp.put("/:id", workspaceAuth, async (c) => {
  const id = c.req.param("id")!;
  const body = await c.req.json<{
    conditions?: Record<string, any>;
    statusCode?: number;
    headers?: Record<string, string>;
    body?: string;
    priority?: number;
  }>();
  const updateData: Record<string, any> = { updatedAt: new Date() };
  if (body.conditions !== undefined) updateData.conditions = JSON.stringify(body.conditions);
  if (body.statusCode !== undefined) updateData.statusCode = body.statusCode;
  if (body.headers !== undefined) updateData.headers = typeof body.headers === "string" ? body.headers : JSON.stringify(body.headers);
  if (body.body !== undefined) updateData.body = body.body;
  if (body.priority !== undefined) updateData.priority = body.priority;

  const [updated] = await db
    .update(responseRules)
    .set(updateData)
    .where(eq(responseRules.id, id))
    .returning();
  if (!updated) return c.json({ error: "Not Found" }, 404);
  return c.json(updated);
});

// DELETE /_manage/responses/:id
resp.delete("/:id", workspaceAuth, async (c) => {
  const [deleted] = await db
    .delete(responseRules)
    .where(eq(responseRules.id, c.req.param("id")!))
    .returning({ id: responseRules.id });
  if (!deleted) return c.json({ error: "Not Found" }, 404);
  return c.json({ success: true });
});

export const responseRoutes = resp;