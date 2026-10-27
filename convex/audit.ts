import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { assertGuard, sanitizeStr } from "./lib";

export const add = mutation({
  args: {
    guard: v.string(),
    actor: v.string(),
    action: v.string(),
    target: v.string(),
    detail: v.optional(v.string()),
  },
  handler: async (ctx, { guard, actor, action, target, detail }) => {
    assertGuard(guard);
    await ctx.db.insert("auditLog", {
      actor: sanitizeStr(actor, 120),
      action: sanitizeStr(action, 60),
      target: sanitizeStr(target, 200),
      detail: detail ? sanitizeStr(detail, 300) : undefined,
      ts: Date.now(),
    });
    return true;
  },
});

export const list = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("auditLog")
      .withIndex("by_ts")
      .order("desc")
      .take(Math.min(Math.max(1, limit), 200));
  },
});
