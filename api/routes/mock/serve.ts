import type { Context } from "hono";
import { db } from "../../db/index.js";
import { endpoints, responseRules } from "../../db/schema.js";
import { and, eq } from "drizzle-orm";
import { getCached, setCache } from "../../middleware/cache.js";

function matchesConditions(conditions: Record<string, any>, c: Context): boolean {
  if (!conditions || Object.keys(conditions).length === 0) return true;

  const { query, body, headers } = conditions;

  if (query) {
    for (const [key, expected] of Object.entries(query)) {
      if (c.req.query(key) !== String(expected)) return false;
    }
  }
  if (headers) {
    for (const [key, expected] of Object.entries(headers)) {
      if (c.req.header(key) !== String(expected)) return false;
    }
  }
  // Body conditions require request body parsing — skipped for simplicity
  return true;
}

export async function serveMock(c: Context) {
  const method = c.req.method;
  const path = c.req.path;

  const cacheKey = `mock:${method}:${path}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return new Response(cached.body, {
      status: cached.statusCode,
      headers: { ...cached.headers, "X-Mock-Server": "true", "X-Cache": "HIT" },
    });
  }

  // Find matching enabled endpoint
  const ep = await db.query.endpoints.findFirst({
    where: and(
      eq(endpoints.method, method as any),
      eq(endpoints.path, path),
      eq(endpoints.enabled, true)
    ),
  });

  if (!ep) {
    return c.json({ error: "Not Found", message: "No mock endpoint matches this request" }, 404);
  }

  // Fetch response rules for this endpoint
  const rules = await db.query.responseRules.findMany({
    where: eq(responseRules.endpointId, ep.id),
    orderBy: (rules, { desc }) => [desc(rules.priority)],
  });

  // Delay
  if (ep.delayMs > 0) {
    await new Promise((r) => setTimeout(r, ep.delayMs));
  }

  // Match response rules
  let matchedRule = rules.find((r) => {
    try {
      const cond = JSON.parse(r.conditions);
      return matchesConditions(cond, c);
    } catch {
      return r.conditions === "{}" || r.conditions === "";
    }
  });

  if (!matchedRule) {
    matchedRule = rules.find((r) => r.conditions === "{}" || r.conditions === "");
  }

  const statusCode = matchedRule?.statusCode ?? 200;
  const headers = (() => {
    try {
      return matchedRule ? JSON.parse(matchedRule.headers) : { "Content-Type": "application/json" };
    } catch {
      return { "Content-Type": "application/json" };
    }
  })();
  const body = matchedRule?.body ?? "";

  // Cache the result
  setCache(cacheKey, { statusCode, headers, body });

  return new Response(body, {
    status: statusCode,
    headers: { ...headers, "X-Mock-Server": "true" },
  });
}