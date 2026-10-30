"use server";

import { cookies } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import { verifySessionToken } from "@/lib/auth";
import { convexMutate, audit } from "@/lib/convex-server";
import { isEmail, isHttpUrl, rateLimit, sanitizeText } from "@/lib/security";

export type ActionResult = { ok: boolean; error?: string };

/** Preflight comune: sessione valida + rate limit. */
async function requireAdmin(): Promise<string> {
  const jar = await cookies();
  const email = verifySessionToken(jar.get("aw_admin")?.value);
  if (!email) throw new Error("Sessione scaduta. Effettua di nuovo l'accesso.");
  if (!rateLimit(`admin:${email}`, 60, 60_000)) {
    throw new Error("Troppe operazioni in sequenza: attendi qualche secondo.");
  }
  return email;
}

function bustSiteCache(): void {
  updateTag("settings");
  updateTag("posts");
  for (const p of ["/", "/servizi", "/portfolio", "/chi-siamo", "/contatti", "/blog"]) {
    revalidatePath(p);
  }
}

function fail(err: unknown): { ok: false; error: string } {
  return { ok: false, error: err instanceof Error ? err.message : "Errore inatteso." };
}

/* ========================= Blog ========================= */

export interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string; // separati da virgola
  status: "draft" | "published";
  coverStorageId?: string;
}

export async function postSave(id: string | null, data: PostInput): Promise<ActionResult> {
  try {
    const email = await requireAdmin();
    const title = sanitizeText(data.title, 140);
    if (!title) throw new Error("Il titolo è obbligatorio.");
    const tags = data.tags
      .split(",")
      .map((t) => sanitizeText(t, 40))
      .filter(Boolean)
      .slice(0, 10);

    const args = {
      title,
      slug: sanitizeText(data.slug, 120).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
      excerpt: sanitizeText(data.excerpt, 300),
      content: sanitizeText(data.content, 40_000),
      tags,
      status: data.status === "published" ? ("published" as const) : ("draft" as const),
      ...(data.coverStorageId ? { coverStorageId: data.coverStorageId } : {}),
    };
    if (!args.slug) throw new Error("Slug non valido.");

    if (id) {
      await convexMutate("posts:update", { id, ...args });
    } else {
      await convexMutate("posts:create", args);
    }
    await audit(email, id ? "post.update" : "post.create", args.slug);
    bustSiteCache();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function postSetStatus(id: string, status: "draft" | "published"): Promise<ActionResult> {
  try {
    const email = await requireAdmin();
    if (status !== "draft" && status !== "published") throw new Error("Stato non valido.");
    await convexMutate("posts:setStatus", { id, status });
    await audit(email, "post.status", id, status);
    bustSiteCache();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function postRemove(id: string): Promise<ActionResult> {
  try {
    const email = await requireAdmin();
    await convexMutate("posts:remove", { id });
    await audit(email, "post.remove", id);
    bustSiteCache();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

/* ========================= Portfolio ========================= */

export interface WorkInput {
  title: string;
  client: string;
  url: string;
  category: string;
  description: string;
  featured: boolean;
  imageStorageId?: string;
}

export async function workCreate(data: WorkInput): Promise<ActionResult> {
  try {
    const email = await requireAdmin();
    const title = sanitizeText(data.title, 120);
    const client = sanitizeText(data.client, 120);
    if (!title || !client) throw new Error("Titolo e cliente sono obbligatori.");
    const url = sanitizeText(data.url, 400);
    if (url && !isHttpUrl(url)) throw new Error("URL progetto non valido (deve iniziare con http/https).");
    await convexMutate("portfolio:create", {
      title,
      client,
      url,
      category: sanitizeText(data.category, 40),
      description: sanitizeText(data.description, 800),
      featured: data.featured === true,
      ...(data.imageStorageId ? { imageStorageId: data.imageStorageId } : {}),
    });
    await audit(email, "work.create", title);
    bustSiteCache();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function workRemove(id: string): Promise<ActionResult> {
  try {
    const email = await requireAdmin();
    await convexMutate("portfolio:remove", { id });
    await audit(email, "work.remove", id);
    bustSiteCache();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

/* ========================= Messaggi ========================= */

export async function messageRemove(id: string): Promise<ActionResult> {
  try {
    const email = await requireAdmin();
    await convexMutate("messages:remove", { id });
    await audit(email, "message.remove", id);
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

/* ========================= Upload URL firmata ========================= */

/** URL di upload Convex generato dal server (la mutation richiede la guardia). */
export async function getUploadUrl(kind: "posts" | "portfolio"): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    await requireAdmin();
    const url = (await convexMutate(`${kind}:generateUploadUrl`, {})) as string;
    if (typeof url !== "string" || !url.startsWith("http")) throw new Error("URL di upload non valido.");
    return { ok: true, url };
  } catch (err) {
    return fail(err);
  }
}

/* ========================= Impostazioni & contenuti ========================= */

export async function settingSet(key: string, value: unknown): Promise<ActionResult> {
  try {
    const email = await requireAdmin();
    if (typeof key !== "string" || !/^[a-z0-9:\-]{1,60}$/.test(key)) throw new Error("Chiave non valida.");
    await convexMutate("settings:set", { key, value, actor: email });
    await audit(email, "settings.set", key);
    bustSiteCache();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

/* ========================= Manutenzione ========================= */

export async function eventsPurge(): Promise<ActionResult> {
  try {
    const email = await requireAdmin();
    await convexMutate("events:purge", { actor: email });
    await audit(email, "events.purge", "90 giorni");
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}
