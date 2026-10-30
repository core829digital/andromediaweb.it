import type { MetadataRoute } from "next";
import { site } from "@/lib/site-data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        // blocca i riciclatori di articoli AI low-quality, largo ai crawler di ricerca
        userAgent: ["CCBot", "Bytespider"],
        disallow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
