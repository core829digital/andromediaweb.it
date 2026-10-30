import "server-only";
import { ConvexHttpClient } from "convex/browser";
import { cacheTag } from "next/cache";

export interface PostRecord {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl?: string;
  tags?: string[];
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
}

export interface WorkRecord {
  _id: string;
  title: string;
  client: string;
  url: string;
  category: string;
  description: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: number;
}

async function cachedQuery(name: string, args: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  try {
    const c = new ConvexHttpClient(url);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await c.query(name as any, args);
  } catch {
    return null;
  }
}

/** Post pubblicato per slug (cached + tag "posts", invalidata dalle server actions). */
export async function getPostBySlug(slug: string): Promise<PostRecord | null> {
  "use cache";
  cacheTag(`post:${slug}`, "posts");
  const raw = (await cachedQuery("posts:getBySlug", { slug })) as PostRecord | null;
  if (!raw || raw.status !== "published") return null;
  return raw;
}

/** Tutti i post pubblicati (cached per sitemap e indice blog). */
export async function getPublishedPosts(): Promise<PostRecord[]> {
  "use cache";
  cacheTag("posts");
  const raw = (await cachedQuery("posts:listPublished", {})) as PostRecord[] | null;
  return raw ?? [];
}
