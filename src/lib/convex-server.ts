import "server-only";
import { ConvexHttpClient } from "convex/browser";
import { convexGuardDigest } from "@/lib/security";

export const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
export const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL ?? "";

function client(): ConvexHttpClient | null {
  if (!convexUrl) return null;
  try {
    return new ConvexHttpClient(convexUrl);
  } catch {
    return null;
  }
}

/** Esegue una mutation Convex aggiungendo la guardia di sicurezza. */
export async function convexMutate(name: string, args: Record<string, unknown>): Promise<unknown> {
  const c = client();
  if (!c) throw new Error("Convex non collegato (NEXT_PUBLIC_CONVEX_URL mancante).");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await c.mutation(name as any, { ...args, guard: convexGuardDigest() });
}

/** Esegue una query Convex lato server. */
export async function convexQuery(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
  const c = client();
  if (!c) throw new Error("Convex non collegato (NEXT_PUBLIC_CONVEX_URL mancante).");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await c.query(name as any, args);
}

/** Scrive nel registro audit (best-effort: non blocca mai l'operazione chiamante). */
export async function audit(actor: string, action: string, target: string, detail?: string): Promise<void> {
  try {
    await convexMutate("audit:add", { actor, action, target, ...(detail ? { detail } : {}) });
  } catch {
    // audit best-effort
  }
}
