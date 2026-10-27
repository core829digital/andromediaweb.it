"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { authenticate } from "@/lib/admin-credentials";
import { adminCookie, createSessionToken, verifySessionToken } from "@/lib/auth";
import { audit } from "@/lib/convex-server";
import { clientIp, rateLimit, rateLimitReset } from "@/lib/security";

export interface LoginState {
  error?: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const emailRaw = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  // anti-DDoS/brute-force: massimo 5 tentativi in 15 minuti per IP
  const h = await headers();
  const ip = clientIp(h);
  if (!rateLimit(`login:${ip}`, 5, 15 * 60_000)) {
    return { error: "Troppi tentativi di accesso. Riprova tra 15 minuti." };
  }

  const admin = authenticate(emailRaw, password);
  if (!admin) {
    void audit(`sconosciuto:${emailRaw.slice(0, 60)}`, "login.fallito", ip);
    return { error: "Credenziali non valide. Riprova." };
  }

  rateLimitReset(`login:${ip}`);
  void audit(admin.email, "login.ok", ip);

  const jar = await cookies();
  jar.set(adminCookie.name, createSessionToken(admin.email), {
    ...adminCookie,
    maxAge: adminCookie.maxAge,
  });

  return { error: undefined };
}

export async function logout() {
  const jar = await cookies();
  const email = verifySessionToken(jar.get("aw_admin")?.value);
  if (email) void audit(email, "logout", "backoffice");
  jar.delete(adminCookie.name);
  redirect("/admin");
}
