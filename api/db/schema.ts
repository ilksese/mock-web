import { pgTable, uuid, text, integer, boolean, timestamp, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";

export const httpMethodEnum = pgEnum("http_method", ["GET", "POST", "PUT", "DELETE", "PATCH"]);

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  manageKey: text("manage_key").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const endpoints = pgTable(
  "endpoints",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    method: httpMethodEnum("method").notNull(),
    path: text("path").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    delayMs: integer("delay_ms").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("uq_endpoint_ws_method_path").on(table.workspaceId, table.method, table.path)]
);

export const responseRules = pgTable("response_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  endpointId: uuid("endpoint_id")
    .notNull()
    .references(() => endpoints.id, { onDelete: "cascade" }),
  conditions: text("conditions").default("{}").notNull(),
  statusCode: integer("status_code").default(200).notNull(),
  headers: text("headers").default("{}").notNull(),
  body: text("body").default("").notNull(),
  priority: integer("priority").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});