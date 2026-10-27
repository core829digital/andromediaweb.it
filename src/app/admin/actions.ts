"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticate } from "@/lib/admin-credentials";
import { adminCookie, createSessionToken } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const admin = authenticate(email, password);
  if (!admin) {
    return { error: "Credenziali non valide. Riprova." };
  }

  const jar = await cookies();
  jar.set(adminCookie.name, createSessionToken(admin.email), {
    ...adminCookie,
    maxAge: adminCookie.maxAge,
  });

  return { error: undefined };
}

export async function logout() {
  const jar = await cookies();
  jar.delete(adminCookie.name);
  redirect("/admin");
}
