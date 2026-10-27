import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { assertGuard, isHttpUrl, sanitizeStr } from "./lib";

const CATEGORIES = [
  "Sito Web",
  "E-Commerce",
  "Brand Identity",
  "Social Media",
  "Advertising",
  "SEO",
  "Intelligenza Artificiale",
] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("portfolio")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const generateUploadUrl = mutation({
  args: { guard: v.string() },
  handler: async (ctx, { guard }) => {
    assertGuard(guard);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    guard: v.string(),
    title: v.string(),
    client: v.string(),
    url: v.string(),
    category: v.string(),
    description: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    assertGuard(args.guard);
    const title = sanitizeStr(args.title, 120);
    const client = sanitizeStr(args.client, 120);
    if (!title || !client) throw new Error("Titolo e cliente sono obbligatori.");
    const url = sanitizeStr(args.url, 400);
    if (url && !isHttpUrl(url)) throw new Error("URL progetto non valido.");
    const category = (CATEGORIES as readonly string[]).includes(args.category)
      ? args.category
      : "Sito Web";
    let imageUrl: string | undefined = undefined;
    if (args.imageStorageId) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }
    return await ctx.db.insert("portfolio", {
      title,
      client,
      url,
      category,
      description: sanitizeStr(args.description, 800),
      imageStorageId: args.imageStorageId,
      imageUrl,
      featured: args.featured === true,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { guard: v.string(), id: v.id("portfolio") },
  handler: async (ctx, { guard, id }) => {
    assertGuard(guard);
    await ctx.db.delete(id);
  },
});
