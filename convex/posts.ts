import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { assertGuard, isSlug, sanitizeStr } from "./lib";

export const generateUploadUrl = mutation({
  args: { guard: v.string() },
  handler: async (ctx, { guard }) => {
    assertGuard(guard);
    return await ctx.storage.generateUploadUrl();
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

function postArgs(args: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags?: string[];
  status: "draft" | "published";
}) {
  const title = sanitizeStr(args.title, 140);
  const slug = sanitizeStr(args.slug, 120).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!title) throw new Error("Il titolo è obbligatorio.");
  if (!isSlug(slug)) throw new Error("Slug non valido (solo lettere minuscole, numeri e trattini).");
  return {
    title,
    slug,
    excerpt: sanitizeStr(args.excerpt, 300),
    content: sanitizeStr(args.content, 40_000),
    tags: (args.tags ?? []).slice(0, 10).map((t) => sanitizeStr(t, 40)),
    status: args.status,
  };
}

export const create = mutation({
  args: {
    guard: v.string(),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverStorageId: v.optional(v.id("_storage")),
    tags: v.optional(v.array(v.string())),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    assertGuard(args.guard);
    const data = postArgs(args);
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", data.slug))
      .unique();
    if (existing) throw new Error("Slug già esistente");
    const now = Date.now();
    let coverUrl: string | undefined = undefined;
    if (args.coverStorageId) {
      coverUrl = (await ctx.storage.getUrl(args.coverStorageId)) ?? undefined;
    }
    return await ctx.db.insert("posts", {
      ...data,
      coverStorageId: args.coverStorageId,
      coverUrl,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    guard: v.string(),
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverStorageId: v.optional(v.id("_storage")),
    tags: v.optional(v.array(v.string())),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    assertGuard(args.guard);
    const data = postArgs(args);
    let coverUrl: string | undefined = undefined;
    if (args.coverStorageId) {
      coverUrl = (await ctx.storage.getUrl(args.coverStorageId)) ?? undefined;
    }
    return await ctx.db.patch(args.id, {
      ...data,
      coverStorageId: args.coverStorageId,
      ...(coverUrl ? { coverUrl } : {}),
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { guard: v.string(), id: v.id("posts") },
  handler: async (ctx, { guard, id }) => {
    assertGuard(guard);
    await ctx.db.delete(id);
  },
});

export const setStatus = mutation({
  args: {
    guard: v.string(),
    id: v.id("posts"),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, { guard, id, status }) => {
    assertGuard(guard);
    await ctx.db.patch(id, { status, updatedAt: Date.now() });
  },
});
