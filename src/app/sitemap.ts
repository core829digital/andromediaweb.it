import type { MetadataRoute } from "next";
import { site } from "@/lib/site-data";
import { getPublishedPosts } from "@/lib/server-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${site.url}/servizi`, changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: `${site.url}/portfolio`, changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: `${site.url}/chi-siamo`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${site.url}/contatti`, changeFrequency: "yearly", priority: 0.8, lastModified: now },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: `${site.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${site.url}/cookie`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
  ];

  try {
    const posts = await getPublishedPosts();
    const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt ?? p.createdAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
    return [...statics, ...postEntries];
  } catch {
    return statics;
  }
}
