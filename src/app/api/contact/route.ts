import { NextRequest } from "next/server";
import { convexMutate } from "@/lib/convex-server";
import { clientIp, isEmail, rateLimit, sanitizeText } from "@/lib/security";

/**
 * Endpoint contatti: valida, sanifica, anti-spam (honeypot + rate limit)
 * e inoltra a Convex con la guardia di sicurezza server-side.
 */
export async function POST(req: NextRequest): Promise<Response> {
  const ip = clientIp(req.headers);
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000)) {
    return Response.json({ ok: false, error: "Troppi tentativi. Riprova più tardi." }, { status: 429 });
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Richiesta non valida." }, { status: 400 });
  }

  // honeypot: i bot riempiono campi nascosti — risposta finta e scarto silenzioso
  if (typeof body.company === "string" && body.company.length > 0) {
    return Response.json({ ok: true });
  }

  const name = sanitizeText(body.name, 100);
  const email = sanitizeText(body.email, 200).toLowerCase();
  const message = sanitizeText(body.message, 4000);
  const source = sanitizeText(body.source, 60) || "form";

  if (!name || name.length < 2) {
    return Response.json({ ok: false, error: "Inserisci il tuo nome." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return Response.json({ ok: false, error: "Inserisci un indirizzo email valido." }, { status: 400 });
  }
  if (message.length < 10) {
    return Response.json({ ok: false, error: "Scrivici qualche parola in più (minimo 10 caratteri)." }, { status: 400 });
  }

  try {
    await convexMutate("messages:create", {
      name,
      email,
      message,
      source,
      createdAt: Date.now(),
    });
    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore di invio. Riprova.";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
