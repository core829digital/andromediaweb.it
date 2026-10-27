import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { assertGuard, sanitizeStr } from "./lib";

/** Chiavi ammesse — whitelist, così nulla di sconosciuto può finire nel DB. */
const ALLOWED_KEYS = [
  "global",
  "seo:default",
  "seo:home",
  "seo:servizi",
  "seo:portfolio",
  "seo:chi-siamo",
  "seo:contatti",
  "seo:blog",
  "content:home",
  "content:faq",
] as const;

/** Profondità massima e dimensione massima del valore JSON. */
const MAX_DEPTH = 6;
const MAX_BYTES = 60_000;

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) throw new Error("Struttura dati troppo annidata.");
  if (typeof value === "string") return sanitizeStr(value, 4000);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return 0;
    return Math.round(value * 1000) / 1000;
  }
  if (typeof value === "boolean" || value === null) return value;
  if (Array.isArray(value)) {
    if (value.length > 100) throw new Error("Troppi elementi in una lista.");
    return value.map((v) => sanitizeValue(v, depth + 1));
  }
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (!/^[a-zA-Z][a-zA-Z0-9_]{0,40}$/.test(k)) throw new Error("Nome campo non valido: " + k);
      out[k] = sanitizeValue(v, depth + 1);
    }
    return out;
  }
  return null;
}

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    if (!(ALLOWED_KEYS as readonly string[]).includes(key)) return null;
    return await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("settings").collect();
    const out: Record<string, unknown> = {};
    for (const d of docs) if ((ALLOWED_KEYS as readonly string[]).includes(d.key)) out[d.key] = d.value;
    return out;
  },
});

export const set = mutation({
  args: {
    guard: v.string(),
    key: v.string(),
    value: v.any(),
    actor: v.string(),
  },
  handler: async (ctx, { guard, key, value, actor }) => {
    assertGuard(guard);
    if (!(ALLOWED_KEYS as readonly string[]).includes(key)) throw new Error("Chiave non ammessa.");
    const clean = sanitizeValue(value);
    const size = JSON.stringify(clean ?? {}).length;
    if (size > MAX_BYTES) throw new Error("Valore troppo grande (max 60KB).");
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { value: clean, updatedAt: now, updatedBy: actor });
    } else {
      await ctx.db.insert("settings", { key, value: clean, updatedAt: now, updatedBy: actor });
    }
    await ctx.db.insert("auditLog", {
      actor,
      action: "settings.set",
      target: key,
      detail: size + " byte",
      ts: now,
    });
    return { key, updatedAt: now };
  },
});
