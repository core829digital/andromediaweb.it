import { httpActionGeneric, httpRouter } from "convex/server";
import { anyApi } from "convex/server";
import { hmacSha256Hex, sanitizeStr, constantTimeEquals } from "./lib";

/**
 * Endpoint eventi firmato: /recordEvent
 * - Il server Next firma il corpo con HMAC-SHA256(AW_EVENTS_SECRET, body).
 * - Qui la firma viene RIVERIFICATA: solo eventi provenienti dal nostro server
 *   (mai direttamente dal browser di un estraneo) vengono accettati.
 * - Finestra anti-replay di ±5 minuti sul timestamp incluso nel payload.
 * - Rate limit per IP lato database (vedi events.record).
 */

const CORS = {
  "Access-Control-Allow-Origin": process.env.AW_SITE_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-aw-signature",
  "Access-Control-Max-Age": "86400",
};

const preflight = httpActionGeneric(async () => {
  return new Response(null, { status: 204, headers: CORS });
});

const recordEvent = httpActionGeneric(async (ctx, request) => {
  const headers = new Headers(CORS);

  const secret = process.env.AW_EVENTS_SECRET ?? "";
  if (!secret) return json({ error: "config" }, 500, headers);

  const signature = request.headers.get("x-aw-signature") ?? "";
  const body = await request.text();

  // limite dimensione corpo (anti-abuse)
  if (body.length > 4000) return json({ error: "payload-too-large" }, 413, headers);

  const expected = hmacSha256Hex(secret, body);
  if (signature.length !== expected.length || !constantTimeEquals(signature, expected)) {
    return json({ error: "signature-non-valida" }, 401, headers);
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return json({ error: "json-non-valido" }, 400, headers);
  }

  const type = payload.type === "click" ? "click" : payload.type === "view" ? "view" : null;
  const path = typeof payload.path === "string" ? sanitizeStr(payload.path, 200) : "";
  const label = typeof payload.label === "string" ? sanitizeStr(payload.label, 120) : undefined;
  const ref = typeof payload.ref === "string" ? sanitizeStr(payload.ref, 300) : undefined;
  const ts = typeof payload.ts === "number" && Number.isFinite(payload.ts) ? Math.trunc(payload.ts) : 0;

  if (!type || !path.startsWith("/") || Math.abs(ts - Date.now()) > 5 * 60 * 1000) {
    return json({ error: "payload-non-valido" }, 400, headers);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 64) ??
    request.headers.get("x-real-ip")?.slice(0, 64) ??
    "sconosciuto";

  const guard = process.env.AW_GUARD_DIGEST ?? "";
  const result = (await ctx.runMutation(anyApi.events.record, {
    guard,
    type,
    path,
    ...(label ? { label } : {}),
    ...(ref ? { ref } : {}),
    ip,
    ts,
  })) as { rateLimited?: boolean };

  if (result?.rateLimited) return json({ error: "rate-limit" }, 429, headers);
  return json({ ok: true }, 200, headers);
});

function json(data: unknown, status: number, extra?: Headers): Response {
  const headers = new Headers(extra ?? undefined);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

const http = httpRouter();
http.route({ path: "/recordEvent", method: "POST", handler: recordEvent });
http.route({ path: "/recordEvent", method: "OPTIONS", handler: preflight });

export default http;
