import { NextRequest } from "next/server";
import { convexSiteUrl } from "@/lib/convex-server";
import { clientIp, hmacSign, isHttpUrl, rateLimit, sanitizeText } from "@/lib/security";

/**
 * Riceve gli eventi analytics dal sito (views + click), applica:
 * - controllo same-origin
 * - rate limit per IP (60/min) — anti-DDoS/anti-flood
 * - validazione e sanitizzazione completa dell'input
 * - firma HMAC-SHA256 sul corpo → Convex la riverifica (solo il nostro server può inviare)
 */
export async function POST(req: NextRequest): Promise<Response> {
  if (!convexSiteUrl) return new Response(null, { status: 503 });

  // same-origin
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin) {
    try {
      if (new URL(origin).host !== host) return new Response(null, { status: 403 });
    } catch {
      return new Response(null, { status: 403 });
    }
  }

  const ip = clientIp(req.headers);
  if (!rateLimit(`ev:${ip}`, 60, 60_000)) return new Response(null, { status: 429 });

  let body: Record<string, unknown> | null = null;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 400 });
  }

  const type = body.type === "view" || body.type === "click" ? body.type : null;
  const path = sanitizeText(body.path, 200);
  const label = body.label ? sanitizeText(body.label, 120) : undefined;
  const ref = body.ref ? sanitizeText(body.ref, 300) : undefined;

  if (!type || !path.startsWith("/")) return new Response(null, { status: 400 });
  if (ref && !isHttpUrl(ref)) return new Response(null, { status: 400 });

  const payload = {
    type,
    path,
    ...(label ? { label } : {}),
    ...(ref ? { ref } : {}),
    ts: Date.now(),
  };
  const serialized = JSON.stringify(payload);
  const signature = hmacSign(serialized);

  try {
    const upstream = await fetch(`${convexSiteUrl}/recordEvent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-aw-signature": signature },
      body: serialized,
      cache: "no-store",
    });
    void upstream;
    return new Response(null, { status: 204 });
  } catch {
    // analytics best-effort: mai bloccare la pagina utente
    return new Response(null, { status: 204 });
  }
}
