import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { assertGuard, sanitizeStr } from "./lib";

/** Finestra rate-limit: massimo eventi per IP in 60 secondi. */
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;

/**
 * Registrazione evento (chiamata solo dall'endpoint HTTP firmato o dal purge).
 * La firma HMAC è verificata PRIMA in http.ts; qui applichiamo la guardia interna.
 */
export const record = mutation({
  args: {
    guard: v.string(),
    type: v.union(v.literal("view"), v.literal("click")),
    path: v.string(),
    label: v.optional(v.string()),
    ref: v.optional(v.string()),
    ip: v.string(),
    ts: v.number(),
  },
  handler: async (ctx, args) => {
    assertGuard(args.guard);

    // rate limit per IP via indice by_ts (filtro per IP in codice)
    const recent = await ctx.db
      .query("events")
      .withIndex("by_ts", (q) => q.gte("ts", args.ts - RATE_WINDOW_MS))
      .order("desc")
      .take(400);
    const sameIp = recent.filter((e) => e.ip === args.ip).length;
    if (sameIp >= RATE_MAX) return { rateLimited: true };

    await ctx.db.insert("events", {
      type: args.type,
      path: args.path,
      label: args.label ? sanitizeStr(args.label, 120) : undefined,
      ref: args.ref ? sanitizeStr(args.ref, 300) : undefined,
      ip: args.ip.slice(0, 64),
      ts: args.ts,
    });
    return { ok: true };
  },
});

export interface DayPoint {
  day: string;
  views: number;
  clicks: number;
}

/** Serie temporale giornaliera (views + clicks) per gli ultimi N giorni. */
export const timeseries = query({
  args: { days: v.number() },
  handler: async (ctx, { days }) => {
    const n = Math.min(Math.max(1, days), 90);
    const from = startOfDay(Date.now()) - (n - 1) * DAY_MS;
    const events = await ctx.db
      .query("events")
      .withIndex("by_ts", (q) => q.gte("ts", from))
      .collect();

    const buckets = new Map<string, DayPoint>();
    for (let i = 0; i < n; i++) {
      const t = from + i * DAY_MS;
      buckets.set(dayKey(t), { day: dayKey(t), views: 0, clicks: 0 });
    }
    for (const e of events) {
      const k = dayKey(e.ts);
      const b = buckets.get(k);
      if (!b) continue;
      if (e.type === "view") b.views++;
      else b.clicks++;
    }
    return Array.from(buckets.values());
  },
});

/** Riepilogo: totali e per periodo. */
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const from30 = startOfDay(now) - 29 * DAY_MS;
    const events = await ctx.db
      .query("events")
      .withIndex("by_ts", (q) => q.gte("ts", from30))
      .collect();
    const todayFrom = startOfDay(now);
    let viewsToday = 0, clicksToday = 0, views7 = 0, clicks7 = 0, views30 = 0, clicks30 = 0;
    for (const e of events) {
      if (e.type === "view") {
        views30++;
        if (e.ts >= todayFrom) viewsToday++;
        if (e.ts >= now - 7 * DAY_MS) views7++;
      } else {
        clicks30++;
        if (e.ts >= todayFrom) clicksToday++;
        if (e.ts >= now - 7 * DAY_MS) clicks7++;
      }
    }
    return {
      viewsToday,
      clicksToday,
      views7,
      clicks7,
      views30,
      clicks30,
      ctr30: views30 > 0 ? Math.round((clicks30 / views30) * 1000) / 10 : 0,
      total: await countAll(ctx),
    };
  },
});

async function countAll(ctx: { db: { query: (t: string) => { collect: () => Promise<{ _id: string }[]> } } }) {
  const all = await ctx.db.query("events").collect();
  return all.length;
}

/** Pagine più visitate negli ultimi N giorni. */
export const topPaths = query({
  args: { days: v.number(), limit: v.number() },
  handler: async (ctx, { days, limit }) => {
    const n = Math.min(Math.max(1, days), 90);
    const from = Date.now() - n * DAY_MS;
    const events = await ctx.db
      .query("events")
      .withIndex("by_ts", (q) => q.gte("ts", from))
      .collect();
    const counts = new Map<string, number>();
    for (const e of events) {
      if (e.type !== "view") continue;
      counts.set(e.path, (counts.get(e.path) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.min(Math.max(1, limit), 20))
      .map(([path, count]) => ({ path, count }));
  },
});

/** Click per sezione/etichetta negli ultimi N giorni. */
export const topLabels = query({
  args: { days: v.number(), limit: v.number() },
  handler: async (ctx, { days, limit }) => {
    const n = Math.min(Math.max(1, days), 90);
    const from = Date.now() - n * DAY_MS;
    const events = await ctx.db
      .query("events")
      .withIndex("by_ts", (q) => q.gte("ts", from))
      .collect();
    const counts = new Map<string, number>();
    for (const e of events) {
      if (e.type !== "click") continue;
      const k = e.label ?? e.path;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.min(Math.max(1, limit), 20))
      .map(([label, count]) => ({ label, count }));
  },
});

/** Eventi recenti (per il pannello attività). */
export const recent = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("events")
      .withIndex("by_ts")
      .order("desc")
      .take(Math.min(Math.max(1, limit), 100));
  },
});

/** Rimozione eventi più vecchi di 90 giorni (pulizia periodica, dal backoffice). */
export const purge = mutation({
  args: { guard: v.string(), actor: v.string() },
  handler: async (ctx, { guard, actor }) => {
    assertGuard(guard);
    const cutoff = Date.now() - 90 * DAY_MS;
    const old = await ctx.db
      .query("events")
      .withIndex("by_ts", (q) => q.lte("ts", cutoff))
      .take(1000);
    for (const e of old) await ctx.db.delete(e._id);
    await ctx.db.insert("auditLog", {
      actor,
      action: "events.purge",
      target: String(old.length) + " eventi",
      ts: Date.now(),
    });
    return { removed: old.length };
  },
});

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function dayKey(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + day;
}
