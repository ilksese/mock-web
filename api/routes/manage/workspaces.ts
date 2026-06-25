import { Hono } from "hono";
import { db } from "../../db";
import { workspaces } from "../../db/schema";
import { eq } from "drizzle-orm";
import { workspaceAuth } from "../../middleware/auth";

function generateSlug(name: string): string {
  const id = crypto.randomUUID ? crypto.randomUUID().slice(0, 6) : Math.random().toString(36).slice(2, 8);
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + id;
}

function generateManageKey(): string {
  const id = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2);
  return "mw_" + id;
}

const ws = new Hono();

// POST /_manage/workspaces — create (no auth needed for creation)
ws.post("/", async (c) => {
  const body = await c.req.json<{ name: string }>();
  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    return c.json({ error: "Validation Error", details: ["name is required"] }, 400);
  }
  const slug = generateSlug(body.name.trim());
  const manageKey = generateManageKey();
  const [workspace] = await db
    .insert(workspaces)
    .values({ name: body.name.trim(), slug, manageKey })
    .returning();
  return c.json(workspace, 201);
});

// All routes below require auth
ws.use("/:id/*", workspaceAuth);

ws.get("/:id", async (c) => {
  const { id } = c.req.param();
  const ws = await db.query.workspaces.findFirst({ where: eq(workspaces.id, id) });
  if (!ws) return c.json({ error: "Not Found" }, 404);
  return c.json(ws);
});

ws.put("/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json<{ name: string }>();
  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    return c.json({ error: "Validation Error", details: ["name is required"] }, 400);
  }
  const [updated] = await db
    .update(workspaces)
    .set({ name: body.name.trim(), updatedAt: new Date() })
    .where(eq(workspaces.id, id))
    .returning();
  if (!updated) return c.json({ error: "Not Found" }, 404);
  return c.json(updated);
});

ws.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const existed = await db.query.workspaces.findFirst({ where: eq(workspaces.id, id) });
  if (!existed) return c.json({ error: "Not Found" }, 404);
  await db.delete(workspaces).where(eq(workspaces.id, id));
  return c.json({ success: true });
});

export const workspaceRoutes = ws;