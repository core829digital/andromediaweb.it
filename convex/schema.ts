import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverStorageId: v.optional(v.id("_storage")),
    coverUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.union(v.literal("draft"), v.literal("published")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]).index("by_status", ["status"]),

  portfolio: defineTable({
    title: v.string(),
    client: v.string(),
    url: v.string(),
    category: v.string(),
    description: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    featured: v.boolean(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  messages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    source: v.string(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  /** Impostazioni e contenuti del sito (chiave → valore JSON flessibile). */
  settings: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  }).index("by_key", ["key"]),

  /** Eventi analytics: view/click tracciati via endpoint firmato. */
  events: defineTable({
    type: v.union(v.literal("view"), v.literal("click")),
    path: v.string(),
    label: v.optional(v.string()),
    ref: v.optional(v.string()),
    ip: v.optional(v.string()),
    ts: v.number(),
  })
    .index("by_ts", ["ts"])
    .index("by_type_ts", ["type", "ts"])
    .index("by_path_ts", ["path", "ts"])
    .index("by_ip_ts", ["ip", "ts"]),

  /** Registro audit: ogni azione amministrativa è tracciata. */
  auditLog: defineTable({
    actor: v.string(),
    action: v.string(),
    target: v.string(),
    detail: v.optional(v.string()),
    ts: v.number(),
  }).index("by_ts", ["ts"]),
});
