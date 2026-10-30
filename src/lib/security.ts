import "server-only";
import crypto from "node:crypto";

/* ========================= Firma HMAC ========================= */

export function hmacSign(payload: string, secret = process.env.AW_EVENTS_SECRET ?? ""): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/** Digest della guardia Convex: sha256 del segreto AW_CONVEX_GUARD.
 *  Fail-fast: senza segreto ogni mutation sarebbe rigettata da Convex
 *  con "firma di sicurezza mancante" — meglio un errore esplicito qui. */
export function convexGuardDigest(): string {
  const secret = process.env.AW_CONVEX_GUARD ?? "";
  if (!secret && process.env.NODE_ENV !== "development") {
    throw new Error(
      "AW_CONVEX_GUARD non configurato su questo processo server: riavvia il server dopo aver impostato la variabile in .env.local",
    );
  }
  return crypto
    .createHash("sha256")
    .update(secret)
    .digest("hex");
}

/* ========================= Sanitizzazione / validazione ========================= */

/** Rimuove caratteri di controllo, <, >, backtick e javascript:; trunca a maxLen. */
export function sanitizeText(s: unknown, maxLen = 500): string {
  if (typeof s !== "string") return "";
  return s
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[<>`]/g, "'")
    .replace(/javascript:/gi, "")
    .trim()
    .slice(0, maxLen);
}

export function isEmail(s: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(s);
}

export function isHttpUrl(s: string): boolean {
  return /^https?:\/\/[^\s]{1,500}$/.test(s);
}

/** Escaping HTML per contesti dove il testo finisce in attributi. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ========================= Rate limiting (in-memory) ========================= */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Finestra scorrevole per chiave. True = consentito. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= max) return false;
  b.count++;
  return true;
}

/** Reset contatore (es. dopo un login riuscito). */
export function rateLimitReset(key: string): void {
  buckets.delete(key);
}

/* ========================= IP client ========================= */

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 64) ??
    headers.get("x-real-ip")?.slice(0, 64) ??
    "local"
  );
}
