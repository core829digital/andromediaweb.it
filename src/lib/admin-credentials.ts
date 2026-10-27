import "server-only";
import crypto from "node:crypto";

/**
 * Credenziali backoffice Andromedia Web.
 * Nota: i valori sono configurabili via variabili d'ambiente
 * AW_ADMIN_USERS (formato JSON) per non hardcodare nulla in produzione.
 */

export interface AdminUser {
  email: string;
  password: string;
  role: "owner" | "admin";
}

const DEFAULT_ADMINS: AdminUser[] = [
  {
    email: "toni@andromediaweb.it",
    password: "Theonly@limit80!",
    role: "owner",
  },
  {
    email: "contact.core829@gmail.com",
    password: "STEFANdenis@2026",
    role: "admin",
  },
];

export function getAdmins(): AdminUser[] {
  const raw = process.env.AW_ADMIN_USERS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as AdminUser[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback ai default
    }
  }
  return DEFAULT_ADMINS;
}

export function authenticate(email: string, password: string): AdminUser | null {
  const admin = getAdmins().find(
    (a) => a.email.toLowerCase() === email.toLowerCase().trim()
  );
  if (!admin) return null;
  // Confronto a tempo costante
  const ok =
    crypto.timingSafeEqual(
      Buffer.from(crypto.createHash("sha256").update(password).digest("hex")),
      Buffer.from(crypto.createHash("sha256").update(admin.password).digest("hex"))
    );
  return ok ? admin : null;
}
