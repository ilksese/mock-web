import type { Context, Next } from "hono";
import { db } from "../db";
import { workspaces } from "../db/schema";
import { eq } from "drizzle-orm";

export async function workspaceAuth(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized", message: "Missing or invalid Authorization header" }, 401);
  }
  const key = authHeader.slice(7);
  const ws = await db.query.workspaces.findFirst({
    where: eq(workspaces.manageKey, key),
  });
  if (!ws) {
    return c.json({ error: "Unauthorized", message: "Invalid manage key" }, 401);
  }
  c.set("workspace", ws);
  await next();
}