import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

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
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    client: v.string(),
    url: v.string(),
    category: v.string(),
    description: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    let imageUrl: string | undefined = undefined;
    if (args.imageStorageId) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }
    return await ctx.db.insert("portfolio", {
      ...args,
      imageUrl,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("portfolio") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
