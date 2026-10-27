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
});
