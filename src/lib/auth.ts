import "server-only";
import crypto from "node:crypto";

const COOKIE_NAME = "aw_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 giorni

function secret(): string {
  return process.env.AW_SESSION_SECRET ?? "andromedia-web-internal-secret-v1";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

/** Token di sessione firmato: <email_b64>.<exp_ms>.<hmac> */
export function createSessionToken(email: string): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${Buffer.from(email).toString("base64url")}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

/** Verifica token e ritorna l'email amministratore, o null. */
export function verifySessionToken(token?: string): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [emailB64, exp, sig] = parts;
  const payload = `${emailB64}.${exp}`;
  const expected = sign(payload);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  if (Number(exp) < Date.now()) return null;
  return Buffer.from(emailB64, "base64url").toString("utf8");
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: Math.floor(SESSION_TTL_MS / 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
