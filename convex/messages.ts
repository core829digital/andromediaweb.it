import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { assertGuard, isEmail, sanitizeStr } from "./lib";

/** Finestra anti-spam: massimo messaggi in 10 minuti per stesso hash IP. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 6;

/**
 * Chiamata SOLO dal server Next (/api/contact) con guardia HMAC.
 * Il form pubblico non parla mai direttamente con Convex.
 */
export const create = mutation({
  args: {
    guard: v.string(),
    name: v.string(),
    email: v.string(),
    message: v.string(),
    source: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    assertGuard(args.guard);

    const name = sanitizeStr(args.name, 100);
    const email = sanitizeStr(args.email, 200).toLowerCase();
    const message = sanitizeStr(args.message, 4000);
    const source = sanitizeStr(args.source, 60);

    if (!name) throw new Error("Il nome è obbligatorio.");
    if (!isEmail(email)) throw new Error("Email non valida.");
    if (message.length < 2) throw new Error("Il messaggio è troppo corto.");
    if (Math.abs(Date.now() - args.createdAt) > 60_000) throw new Error("Richiesta scaduta, riprova.");

    // anti-flood: conta i messaggi negli ultimi 10 minuti
    const recent = await ctx.db
      .query("messages")
      .withIndex("by_created", (q) => q.gte("createdAt", Date.now() - RATE_WINDOW_MS))
      .collect();
    if (recent.length >= RATE_MAX * 3) throw new Error("Troppi messaggi in arrivo, riprova più tardi.");

    return await ctx.db.insert("messages", { name, email, message, source, createdAt: args.createdAt });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_created")
      .order("desc")
      .take(200);
  },
});

export const remove = mutation({
  args: { guard: v.string(), id: v.id("messages") },
  handler: async (ctx, { guard, id }) => {
    assertGuard(guard);
    await ctx.db.delete(id);
  },
});
